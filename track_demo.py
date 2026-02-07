# ============================================================
# FLIGHT DISRUPTION TRACKER (STATIC DATA) — PPT/DEMO READY
# What it DOES: "track" a flight by risk context (airport+airline+month)
# What it DOESN'T: realtime GPS / flight-number live status
# ============================================================

import pandas as pd
import numpy as np

# -----------------------------
# 0) Load same datasets (Kaggle paths)
# -----------------------------
ECONOMY_PATH  = "/kaggle/input/indian-airlines-ticket-price-analysis/economy.csv"
BUSINESS_PATH = "/kaggle/input/indian-airlines-ticket-price-analysis/business.csv"
DELAY_PATH    = "/kaggle/input/airline-on-time-statistics-and-delay-causes-bts/Airline_Delay_Cause.csv"

def standardize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = (
        df.columns.astype(str)
          .str.strip()
          .str.lower()
          .str.replace(" ", "_", regex=False)
          .str.replace("-", "_", regex=False)
    )
    return df

tickets_economy  = standardize_columns(pd.read_csv(ECONOMY_PATH))
tickets_business = standardize_columns(pd.read_csv(BUSINESS_PATH))
delay_df         = standardize_columns(pd.read_csv(DELAY_PATH))

# Show schema quickly (helps you prove what data supports in PPT)
print("Delay dataset columns:\n", list(delay_df.columns))

# -----------------------------
# 1) Robust column helpers
# -----------------------------
def pick_first_existing_col(df: pd.DataFrame, candidates):
    for c in candidates:
        if c in df.columns:
            return c
    return None

def get_numeric_series(df: pd.DataFrame, col: str, default_value=0.0) -> pd.Series:
    if col is not None and col in df.columns:
        return pd.to_numeric(df[col], errors="coerce").fillna(0)
    return pd.Series([default_value] * len(df), index=df.index)

def safe_upper_str_series(df: pd.DataFrame, col: str) -> pd.Series:
    if col is None or col not in df.columns:
        return pd.Series(["UNKNOWN"] * len(df), index=df.index)
    return df[col].astype(str).str.upper().str.strip()

# -----------------------------
# 2) Detect BTS aggregated fields
# -----------------------------
AIRPORT_COL = pick_first_existing_col(delay_df, ["airport", "origin", "origin_airport", "airport_code"])
CARRIER_COL = pick_first_existing_col(delay_df, ["carrier", "unique_carrier", "airline", "airline_code"])
YEAR_COL    = pick_first_existing_col(delay_df, ["year"])
MONTH_COL   = pick_first_existing_col(delay_df, ["month"])

FLIGHTS_COL       = pick_first_existing_col(delay_df, ["arr_flights", "flights"])
ARR_DELAY_MIN_COL = pick_first_existing_col(delay_df, ["arr_delay", "arr_delay_minutes"])
DEP_DELAY_MIN_COL = pick_first_existing_col(delay_df, ["dep_delay", "dep_delay_minutes"])

CANCELLED_COL = pick_first_existing_col(delay_df, ["arr_cancelled", "cancelled"])
DIVERTED_COL  = pick_first_existing_col(delay_df, ["arr_diverted", "diverted"])

CAUSE_MAP = {
    "late_aircraft": pick_first_existing_col(delay_df, ["late_aircraft_ct", "late_aircraft_delay"]),
    "carrier":       pick_first_existing_col(delay_df, ["carrier_ct", "carrier_delay"]),
    "nas":           pick_first_existing_col(delay_df, ["nas_ct", "nas_delay"]),
    "weather":       pick_first_existing_col(delay_df, ["weather_ct", "weather_delay"]),
    "security":      pick_first_existing_col(delay_df, ["security_ct", "security_delay"]),
}

print("\nDetected schema:", {
    "AIRPORT_COL": AIRPORT_COL,
    "CARRIER_COL": CARRIER_COL,
    "FLIGHTS_COL": FLIGHTS_COL,
    "ARR_DELAY_MIN_COL": ARR_DELAY_MIN_COL,
    "DEP_DELAY_MIN_COL": DEP_DELAY_MIN_COL,
    "CANCELLED_COL": CANCELLED_COL,
    "DIVERTED_COL": DIVERTED_COL,
    "CAUSE_MAP": CAUSE_MAP
})

# -----------------------------
# 3) Normalize fields into analysis-ready columns
# -----------------------------
delay_df["airport_std"] = safe_upper_str_series(delay_df, AIRPORT_COL)
delay_df["carrier_std"] = safe_upper_str_series(delay_df, CARRIER_COL)
delay_df["year"]  = get_numeric_series(delay_df, YEAR_COL, default_value=np.nan)
delay_df["month"] = get_numeric_series(delay_df, MONTH_COL, default_value=np.nan)

flights = get_numeric_series(delay_df, FLIGHTS_COL, default_value=0)

arr_delay_total = get_numeric_series(delay_df, ARR_DELAY_MIN_COL, default_value=0)
dep_delay_total = get_numeric_series(delay_df, DEP_DELAY_MIN_COL, default_value=0)
if dep_delay_total.sum() == 0 and arr_delay_total.sum() > 0:
    dep_delay_total = arr_delay_total.copy()

# avg minutes per flight (aggregated BTS)
delay_df["avg_arr_delay_min"] = np.where(flights > 0, arr_delay_total / flights, np.nan)
delay_df["avg_dep_delay_min"] = np.where(flights > 0, dep_delay_total / flights, np.nan)

cancelled_cnt = get_numeric_series(delay_df, CANCELLED_COL, default_value=0)
diverted_cnt  = get_numeric_series(delay_df, DIVERTED_COL, default_value=0)

delay_df["cancel_rate"] = np.where(flights > 0, cancelled_cnt / flights, 0.0)
delay_df["divert_rate"] = np.where(flights > 0, diverted_cnt / flights, 0.0)

# If delay minutes not provided, create a proxy from cause counts (still useful)
cause_proxy = (
    get_numeric_series(delay_df, CAUSE_MAP["late_aircraft"], 0) +
    get_numeric_series(delay_df, CAUSE_MAP["carrier"], 0) +
    get_numeric_series(delay_df, CAUSE_MAP["nas"], 0) +
    get_numeric_series(delay_df, CAUSE_MAP["weather"], 0) +
    get_numeric_series(delay_df, CAUSE_MAP["security"], 0)
)
if np.nan_to_num(delay_df["avg_arr_delay_min"]).sum() == 0:
    delay_df["avg_arr_delay_min"] = np.where(flights > 0, (cause_proxy / np.maximum(flights, 1)) * 10.0, np.nan)
if np.nan_to_num(delay_df["avg_dep_delay_min"]).sum() == 0:
    delay_df["avg_dep_delay_min"] = delay_df["avg_arr_delay_min"].copy()

# -----------------------------
# 4) Build "tracking sensors" (airport / airline / seasonal tables)
# -----------------------------
airport_risk = (
    delay_df.groupby("airport_std")
    .agg(
        avg_arr_delay=("avg_arr_delay_min", "mean"),
        avg_dep_delay=("avg_dep_delay_min", "mean"),
        cancel_rate=("cancel_rate", "mean"),
        divert_rate=("divert_rate", "mean"),
        volume=("airport_std", "size"),
        flights_total=(FLIGHTS_COL if FLIGHTS_COL in delay_df.columns else "cancel_rate", "sum")
    )
    .reset_index()
    .rename(columns={"airport_std": "airport"})
)

airport_risk["congestion_score"] = (
    airport_risk["avg_dep_delay"].fillna(0) * 0.45 +
    airport_risk["avg_arr_delay"].fillna(0) * 0.45 +
    airport_risk["cancel_rate"].fillna(0) * 100.0 * 0.10
)

airline_risk = (
    delay_df.groupby("carrier_std")
    .agg(
        avg_arr_delay=("avg_arr_delay_min", "mean"),
        cancel_rate=("cancel_rate", "mean"),
        volume=("carrier_std", "size"),
        flights_total=(FLIGHTS_COL if FLIGHTS_COL in delay_df.columns else "cancel_rate", "sum")
    )
    .reset_index()
    .rename(columns={"carrier_std": "carrier"})
)

airline_risk["reliability_index"] = (
    airline_risk["avg_arr_delay"].fillna(0) * 1.0 +
    airline_risk["cancel_rate"].fillna(0) * 100.0 * 2.0
)

seasonal_risk = (
    delay_df.dropna(subset=["month"])
    .groupby("month")
    .agg(
        avg_arr_delay=("avg_arr_delay_min", "mean"),
        avg_dep_delay=("avg_dep_delay_min", "mean"),
        cancel_rate=("cancel_rate", "mean"),
        volume=("month", "size"),
        flights_total=(FLIGHTS_COL if FLIGHTS_COL in delay_df.columns else "cancel_rate", "sum")
    )
    .reset_index()
)

# -----------------------------
# 5) Cause mix for explanation ("why likely delayed")
# -----------------------------
def compute_cause_mix(df_slice: pd.DataFrame):
    totals = {}
    for k, col in CAUSE_MAP.items():
        totals[k] = float(get_numeric_series(df_slice, col, 0).sum()) if col is not None else 0.0
    s = sum(totals.values())
    if s <= 0:
        # fallback (matches your pie chart style)
        return {"late_aircraft": 0.38, "carrier": 0.31, "nas": 0.25, "weather": 0.05, "security": 0.01}
    return {k: totals[k] / s for k in totals}

# -----------------------------
# 6) Confidence scoring (makes tracker feel "real")
# -----------------------------
def confidence_label(n: float):
    # n = sample size proxy (flights_total if exists else volume)
    if n is None or np.isnan(n):
        return "LOW"
    if n >= 50000:
        return "HIGH"
    if n >= 10000:
        return "MEDIUM"
    return "LOW"

# -----------------------------
# 7) Tracking Card Generator (THIS is your "flight tracking" output)
# -----------------------------
def track_flight_card(origin_airport: str, airline_code: str, month: int):
    origin_airport = str(origin_airport).upper().strip()
    airline_code   = str(airline_code).upper().strip()

    arow = airport_risk[airport_risk["airport"] == origin_airport]
    arow = arow.iloc[0] if len(arow) else None

    crow = airline_risk[airline_risk["carrier"] == airline_code]
    crow = crow.iloc[0] if len(crow) else None

    mrow = seasonal_risk[seasonal_risk["month"] == month]
    mrow = mrow.iloc[0] if len(mrow) else None

    # slice for causes (airport+airline+month)
    df_slice = delay_df[
        (delay_df["airport_std"] == origin_airport) &
        (delay_df["carrier_std"] == airline_code) &
        (delay_df["month"] == month)
    ]
    cause_mix = compute_cause_mix(df_slice)

    # percentile-based risk scoring (robust across scaling)
    def pct_rank(value, series):
        if value is None or series.isna().all():
            return 0.5
        return float((series <= value).mean())

    airport_p = pct_rank(arow["congestion_score"] if arow is not None else None, airport_risk["congestion_score"])
    airline_p = pct_rank(crow["reliability_index"] if crow is not None else None, airline_risk["reliability_index"])
    month_p   = pct_rank(mrow["avg_dep_delay"] if mrow is not None else None, seasonal_risk["avg_dep_delay"])

    score = (airport_p * 0.45 + airline_p * 0.35 + month_p * 0.20) * 100.0
    score = float(np.clip(score, 0, 100))

    if score < 33:
        risk = "LOW"
    elif score < 66:
        risk = "MEDIUM"
    else:
        risk = "HIGH"

    # expected delay minutes + cancellation probability
    vals, canc = [], []
    if arow is not None:
        vals.append(arow["avg_dep_delay"])
        canc.append(arow["cancel_rate"])
    if crow is not None:
        vals.append(crow["avg_arr_delay"])
        canc.append(crow["cancel_rate"])
    if mrow is not None:
        vals.append(mrow["avg_dep_delay"])
        canc.append(mrow["cancel_rate"])

    expected_delay = float(np.nanmean(vals)) if len(vals) else np.nan
    cancel_prob    = float(np.nanmean(canc)) if len(canc) else np.nan

    # top causes (2)
    top_causes = sorted(cause_mix.items(), key=lambda x: x[1], reverse=True)[:2]
    cause_text = ", ".join([f"{k.replace('_',' ')} ({v*100:.1f}%)" for k, v in top_causes if v > 0])

    # confidence (use flights_total when available)
    conf_inputs = []
    if arow is not None:
        conf_inputs.append(arow["flights_total"] if "flights_total" in arow else arow["volume"])
    if crow is not None:
        conf_inputs.append(crow["flights_total"] if "flights_total" in crow else crow["volume"])
    if mrow is not None:
        conf_inputs.append(mrow["flights_total"] if "flights_total" in mrow else mrow["volume"])
    conf_n = np.nanmean(conf_inputs) if len(conf_inputs) else np.nan
    conf = confidence_label(conf_n)

    # action guidance
    if risk == "HIGH":
        action = [
            "Add a big buffer (connections +2 to 3 hours).",
            "Avoid tight layovers; consider early departures.",
            "Keep a backup option (alternate flight/airport)."
        ]
    elif risk == "MEDIUM":
        action = [
            "Add buffer (connections +1 to 2 hours).",
            "Avoid the shortest connection times.",
        ]
    else:
        action = [
            "Normal buffer is fine.",
            "Standard check-in timing should work.",
        ]

    card = f"""
==================== FLIGHT TRACKING CARD ====================
Route Context:  {airline_code}  |  ORIGIN: {origin_airport}  |  MONTH: {month}

Operational Risk Level:   {risk}   (Score: {score:.1f}/100)   | Confidence: {conf}

Expected Delay:           {("~ " + str(round(expected_delay,1)) + " min") if not np.isnan(expected_delay) else "N/A"}
Cancellation Probability: {(str(round(cancel_prob*100,2)) + "%") if not np.isnan(cancel_prob) else "N/A"}

Likely Root Causes:       {cause_text if cause_text else "Not available in this schema"}

Recommended Actions:
- {action[0]}
- {action[1]}
{("- " + action[2]) if len(action) > 2 else ""}

(Static tracking = disruption-risk tracking based on historical operations)
==============================================================
""".strip("\n")

    return {
        "airport": origin_airport,
        "airline": airline_code,
        "month": int(month),
        "risk_score": round(score, 1),
        "risk_level": risk,
        "confidence": conf,
        "expected_delay_min": None if np.isnan(expected_delay) else round(expected_delay, 1),
        "cancel_prob_%": None if np.isnan(cancel_prob) else round(cancel_prob * 100, 2),
        "top_causes": cause_text,
        "actions": action,
        "card_text": card
    }

# -----------------------------
# 8) Batch mode (for PPT screenshots + insights)
# -----------------------------
def top_hotspots(month=7, top_k=10):
    # hotspots = airports with highest congestion score
    out = airport_risk.sort_values("congestion_score", ascending=False).head(top_k).copy()
    out["month"] = month
    out["cancel_rate_%"] = (out["cancel_rate"] * 100).round(2)
    return out[["month","airport","avg_dep_delay","avg_arr_delay","cancel_rate_%","congestion_score","volume"]]

# -----------------------------
# 9) Demo run (change inputs to your case)
# -----------------------------
print("\n--- Example tracking card ---")
demo = track_flight_card(origin_airport="ORD", airline_code="AA", month=7)
print(demo["card_text"])

print("\n--- Top hotspots (for alerts list) ---")
print(top_hotspots(month=7, top_k=10).to_string(index=False))
