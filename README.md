# Airport LLM

An LLM-powered airport + flight intelligence platform that guides passengers in real time, finds the best flight deals, and predicts future prices.

## Problem Statement
Air travelers struggle to find the best flight prices due to dynamic fare changes and limited intelligent filtering. Existing systems don’t continuously monitor prices or personalize recommendations based on timing, cost, and destination value. We address this with real-time price tracking, best-option suggestions, and forecasting.

## Our Solution (4 Parts)
1) Passenger Support Dashboard  
2) Flight Prices Best Deal Fetching AI Agent  
3) Future Price Prediction (Time Series)  
4) Web Analytics Dashboard

## Key Features
### Passenger-Facing Intelligence
- Hyper-contextual airport assistant (not FAQ): location in airport, flight number, security queue load, weather/delays, immigration rules
- Multilingual + cultural tone adaptation (business/family/elderly etc.)
- Airport map + late alerts + notifications

### Airport Staff Operations Co-Pilot
- SOP / incident manuals / past logs / DGCA-ICAO regulation aware
- Outputs: situation summary, risk level, recommended actions, who to notify
- Refuses unsafe answers + explains why

### Smart Retail & Lounge Recommendations
- Gate/time-based food suggestions
- Lounge usage optimization
- Duty-free targeting without being creepy

### Feedback → Policy Loop
- Clusters passenger feedback into weekly reports
- Policy change suggestions + infrastructure insights

### Pricing Intelligence (ML)
- Best deal fetching agent for flight prices
- Future price prediction using time-series modeling

## Architecture (High Level)
Frontend Dashboards → Backend API → (LLM + Context Retrieval + Safety)  
                         → Price Agent Service  
                         → Forecasting Service  
                         → Database + Notifications  
                         → Web Analytics

## Tech Stack
Large Language Models (LLMs)
Context-aware reasoning, explanations, and intelligent recommendations

Machine Learning Models
Time-series forecasting for future flight price prediction

Datasets
Indian airlines ticket price analysis data,Historical flight price data (Kaggle – USA Flights) + real-time pricing inputs,Airline on time statistics and delayncauses

APIs & Data Pipelines
Live flight data, airport information, and pricing feeds

Dashboards & Visualization
Web-based dashboards for passenger support and analytics insights

## Demo
- Passenger Dashboard:
- Staff Co-Pilot:
- Price Deal Agent:
- Analytics Dashboard:

## Hackathon Notes (Proof of Work)
Project developed during official coding sessions with regular commits, and includes README, prototype/demo, and slides.
