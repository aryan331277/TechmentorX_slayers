# ============================================
# EXPEDIA "REAL-TIME" FARE SIMULATION (KERNEL-SAFE)
# Dataset: https://www.kaggle.com/datasets/dilwong/flightprices
# File: itineraries.csv (huge) -> READ IN CHUNKS
# No synthetic prices. Uses REAL observed timestamps if present.
# ============================================

import os, re
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# -------------------------------
# 1) Find itineraries.csv
# -------------------------------
def find_itineraries_csv():
    for root, _, files in os.walk("/kaggle/input"):
        for f in files:
            if f.lower() == "itineraries.csv":
                return os.path.join(root, f)
    # fallback: any file containing "itinerar"
    for root, _, files in os.walk("/kaggle/input"):
        for f in files:
            if f.lower().endswith(".csv") and "itinerar" in f.lower():
                return os.path.join(root, f)
    return None

it_path = find_itineraries_csv()
if it_path is None:
    raise FileNotFoundError("itineraries.csv not found. Kaggle → Add Data → dilwong/flightprices")

print("✅ Using:", it_path)

# -------------------------------
# 2) Read header only + detect columns
# -------------------------------
header = pd.read_csv(it_path, nrows=0)
cols = header.columns.tolist()
cols_l = [c.lower() for c in cols]

def pick_col(patterns):
    for pat in patterns:
        rgx = re.compile(pat)
        for c, lc in zip(cols, cols_l):
            if rgx.search(lc):
                return c
    return None

# The *real* time axis here is usually searchDate / searchDatetime
c_time   = pick_col([r"searchdate", r"search.*date", r"search.*time", r"searched"])
c_origin = pick_col([r"startingairport", r"originairport", r"\borigin\b", r"fromairport"])
c_dest   = pick_col([r"destinationairport", r"destairport", r"\bdestination\b", r"\bdest\b", r"toairport"])
c_price  = pick_col([r"totalfare", r"basefare", r"\bprice\b", r"\bfare\b", r"total_amount", r"totalamount"])
c_airline= pick_col([r"airline", r"carrier", r"marketingcarrier", r"operatingcarrier"])
c_dep_dt = pick_col([r"departure.*date", r"start.*date", r"flight.*date", r"leg.*departure.*date"])

print("Detected:")
print(" time   =", c_time)
print(" origin =", c_origin)
print(" dest   =", c_dest)
print(" price  =", c_price)
print(" airline=", c_airline)
print(" dep_dt =", c_dep_dt)

# Brutal truth: without a real time column, you cannot do real-time insights from this dataset.
if c_time is None:
    raise ValueError(
        "No search/observed timestamp column detected in itineraries.csv. "
        "Without time, 'real-time price change' is impossible without synthetic timestamps."
    )

for name, col in [("origin", c_origin), ("dest", c_dest), ("price", c_price)]:
    if col is None:
        raise ValueError(f"Missing required column: {name}. Print cols and map manually.")

# -------------------------------
# 3) Stream in chunks & build compact time-series
# -------------------------------
USE_COLS = [c_time, c_origin, c_dest, c_price]
if c_airline: USE_COLS.append(c_airline)
if c_dep_dt:  USE_COLS.append(c_dep_dt)

# Tune these to your kernel limits
CHUNK_ROWS = 250_000          # if kernel still dies, drop to 100_000
MAX_ROUTES = 5000             # keep top routes only (demand proxy)
KEEP_LAST_N_PER_ROUTE = 60    # compact time-series per route (per airline optional)

# We do a quick first pass (small sample) to find frequent routes (so we don't keep everything).
sample = pd.read_csv(it_path, usecols=USE_COLS, nrows=400_000, low_memory=False)
sample = sample.rename(columns={c_origin:"origin", c_dest:"dest", c_time:"observed_at", c_price:"price"})
sample["origin"] = sample["origin"].astype(str).str.upper().str.strip()
sample["dest"]   = sample["dest"].astype(str).str.upper().str.strip()
sample["route"]  = sample["origin"] + "-" + sample["dest"]

top_routes = sample["route"].value_counts().head(MAX_ROUTES).index.tolist()
top_routes = set(top_routes)

del sample

print(f"✅ Keeping only top {len(top_routes)} routes to stay memory-safe.")

def clean_chunk(chunk):
    chunk = chunk.rename(columns={
        c_origin: "origin",
        c_dest: "dest",
        c_time: "observed_at",
        c_price: "price"
    })
    if c_airline and c_airline in chunk.columns:
        chunk = chunk.rename(columns={c_airline: "airline"})
    if c_dep_dt and c_dep_dt in chunk.columns:
        chunk = chunk.rename(columns={c_dep_dt: "departure_date"})

    chunk["origin"] = chunk["origin"].astype(str).str.upper().str.strip()
    chunk["dest"]   = chunk["dest"].astype(str).str.upper().str.strip()
    chunk["route"]  = chunk["origin"] + "-" + chunk["dest"]

    # keep only top routes
    chunk = chunk[chunk["route"].isin(top_routes)]

    # parse time
    chunk["observed_at"] = pd.to_datetime(chunk["observed_at"], errors="coerce")

    # price numeric
    chunk["price"] = (chunk["price"].astype(str).str.replace(r"[^0-9.]", "", regex=True))
    chunk["price"] = pd.to_numeric(chunk["price"], errors="coerce")

    # optional departure date
    if "departure_date" in chunk.columns:
        chunk["departure_date"] = pd.to_datetime(chunk["departure_date"], errors="coerce").dt.date
    else:
        chunk["departure_date"] = pd.NaT

    # drop junk
    chunk = chunk.dropna(subset=["observed_at", "price", "origin", "dest"])
    chunk = chunk[chunk["price"] > 0]

    return chunk

# We'll store only the last N observations per group (route + dep_date + airline)
store = {}  # key -> DataFrame (small)

def store_update(key, df_new):
    if key not in store:
        store[key] = df_new
    else:
        store[key] = pd.concat([store[key], df_new], ignore_index=True)

    # keep only last N by observed_at
    store[key] = store[key].sort_values("observed_at").tail(KEEP_LAST_N_PER_ROUTE)

# Stream
reader = pd.read_csv(it_path, usecols=USE_COLS, chunksize=CHUNK_ROWS, low_memory=False)

for i, ch in enumerate(reader, start=1):
    ch = clean_chunk(ch)

    # If airline missing, fill stable value so grouping works
    if "airline" not in ch.columns:
        ch["airline"] = "ALL"

    # We keep groups small
    group_cols = ["route", "departure_date", "airline"]
    for key, g in ch.groupby(group_cols):
        store_update(key, g[["observed_at","route","departure_date","airline","price"]])

    if i % 5 == 0:
        print(f"  processed chunks: {i} | groups stored: {len(store)}")

print("✅ Finished streaming. Groups stored:", len(store))

# Flatten to a single compact dataframe
fare_sig = pd.concat(store.values(), ignore_index=True)
fare_sig = fare_sig.sort_values(["route","departure_date","airline","observed_at"])

# Outlier trim (still real data, just removing garbage)
lo, hi = fare_sig["price"].quantile([0.005, 0.995])
fare_sig = fare_sig[(fare_sig["price"] >= lo) & (fare_sig["price"] <= hi)]

print("✅ Compact fare table shape:", fare_sig.shape)
print("Example rows (small):")
display(fare_sig.head(5))

# -------------------------------
# 4) Add trend/volatility signals (compact + fast)
# -------------------------------
def add_signals(df, k=12):
    df = df.copy()
    grp = ["route","departure_date","airline"]

    df["price_prev"] = df.groupby(grp)["price"].shift(1)
    df["pct_change_prev"] = (df["price"] - df["price_prev"]) / df["price_prev"]

    # Rolling stats inside each group
    df["volatility_recent"] = (
        df.groupby(grp)["price"]
          .rolling(k, min_periods=4).std()
          .reset_index(level=grp, drop=True)
        /
        df.groupby(grp)["price"]
          .rolling(k, min_periods=4).mean()
          .reset_index(level=grp, drop=True)
    )

    # Trend: last price vs first in rolling window
    def first_of_window(x):
        return x.iloc[0]
    first = (df.groupby(grp)["price"]
               .rolling(k, min_periods=4)
               .apply(lambda x: first_of_window(pd.Series(x)), raw=False)
               .reset_index(level=grp, drop=True))
    df["trend_recent_pct"] = (df["price"] - first) / first

    df["obs_count_in_group"] = df.groupby(grp)["price"].transform("size")
    return df

fare_sig = add_signals(fare_sig, k=12)
print("✅ Signals added.")

# -------------------------------
# 5) Live-like query (NO ML, explainable)
# -------------------------------
def get_live_fare(route, now=None, departure_date=None, airline=None, df=fare_sig):
    if now is None:
        now = pd.Timestamp.now()

    d = df[df["route"] == route].copy()
    if departure_date is not None:
        dd = pd.to_datetime(departure_date, errors="coerce").date()
        d = d[d["departure_date"] == dd]
    if airline is not None:
        d = d[d["airline"].astype(str).str.lower() == str(airline).lower()]

    d = d[d["observed_at"] <= pd.to_datetime(now)]
    if len(d) == 0:
        return {"ok": False, "reason": "No observations for that route/time filter."}

    row = d.sort_values("observed_at").iloc[-1]

    trend = row.get("trend_recent_pct", np.nan)
    vol   = row.get("volatility_recent", np.nan)

    decision = "HOLD"
    why = []

    if pd.notna(trend):
        if trend > 0.05:
            decision = "BOOK_NOW"
            why.append(f"Price trending up (~{trend*100:.1f}% recent).")
        elif trend < -0.05:
            decision = "WAIT"
            why.append(f"Price trending down (~{trend*100:.1f}% recent).")

    if pd.notna(vol) and vol > 0.10:
        decision = "BOOK_NOW"
        why.append("High volatility (big swings).")

    if not why:
        why.append("Limited recent signal; showing latest observed price.")

    return {
        "ok": True,
        "route": row["route"],
        "departure_date": row["departure_date"],
        "airline": row["airline"],
        "observed_at": row["observed_at"],
        "current_price": float(row["price"]),
        "trend_recent_pct": None if pd.isna(trend) else float(trend),
        "volatility_recent": None if pd.isna(vol) else float(vol),
        "decision": decision,
        "explanation": " ".join(why),
        "obs_count": int(row.get("obs_count_in_group", 0))
    }

# pick a route that has enough data
best_route = fare_sig["route"].value_counts().index[0]
print("✅ Example route:", best_route)
print(get_live_fare(best_route))

# -------------------------------
# 6) Alert simulation (REAL data; triggers when historically seen)
# -------------------------------
def simulate_price_alert(route, target_price, df=fare_sig, departure_date=None, airline=None):
    d = df[df["route"] == route].copy()
    if departure_date is not None:
        dd = pd.to_datetime(departure_date, errors="coerce").date()
        d = d[d["departure_date"] == dd]
    if airline is not None:
        d = d[d["airline"].astype(str).str.lower() == str(airline).lower()]

    d = d.sort_values("observed_at")
    hit = d[d["price"] <= target_price]
    if len(hit) == 0:
        return None

    r = hit.iloc[0]
    return {
        "route": route,
        "target_price": float(target_price),
        "triggered_at": r["observed_at"],
        "trigger_price": float(r["price"]),
        "departure_date": r["departure_date"],
        "airline": r["airline"]
    }

# Example alert using 25th percentile as target
target = fare_sig[fare_sig["route"]==best_route]["price"].quantile(0.25)
print("✅ Example alert:", simulate_price_alert(best_route, target))

# -------------------------------
# 7) Plot route timeline (compact, won’t kill kernel)
# -------------------------------
def plot_route_timeline(route, df=fare_sig, departure_date=None, airline=None):
    d = df[df["route"] == route].copy()
    if departure_date is not None:
        dd = pd.to_datetime(departure_date, errors="coerce").date()
        d = d[d["departure_date"] == dd]
    if airline is not None:
        d = d[d["airline"].astype(str).str.lower() == str(airline).lower()]

    d = d.sort_values("observed_at")
    if len(d) == 0:
        print("No data to plot for filters.")
        return

    plt.figure(figsize=(12,4))
    plt.plot(d["observed_at"], d["price"])
    plt.title(f"Fare Timeline (Real Observations): {route}")
    plt.xlabel("Observed time (search timestamp)")
    plt.ylabel("Price")
    plt.show()

plot_route_timeline(best_route)
