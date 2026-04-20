# WiraLalu: Agentic Traffic Orchestration for Malaysia 2030

**Track:** Green Horizon (Smart Cities & Mobility)  
**Submission:** Project 2030: MyAI Future Hackathon  
**Live Demo:** (https://wiralalu-dashboard-125182274182.asia-southeast1.run.app/)

## 🚀 The Vision
WiraLalu transforms Malaysia's traffic management from a "sensor-response" model into an **Agentic AI Orchestrator**. Built to handle the unique "Urban DNA" of Malaysian cities—such as high motorcycle volumes and frequent flash floods—WiraLalu ensures traffic flows intelligently, prioritizing public transport and emergency services autonomously.

## 🧠 Agentic Architecture
Unlike traditional algorithms, WiraLalu uses a tiered multi-agent system:
- **Intersection Agents (Gemini Flash):** High-speed agents at every light. They follow a `Perceive -> Reason -> Negotiate -> Act` loop.
- **City Orchestrator (Gemini Pro):** A high-reasoning brain that resolves cross-intersection conflicts and handles city-wide crises (e.g., flash floods).
- **Counterfactual Reasoning:** Every decision includes a `rejectedAlternative` field, providing transparency into the agent's thought process.

## 🛠️ Technical Stack
- **LLMs:** Gemini 1.5 Flash (Edge) & Gemini 1.5 Pro (Orchestration)
- **Framework:** Firebase Genkit for agentic workflows
- **Knowledge:** Vertex AI Search (RAG) grounded in JPS Flood data & GTFS schedules
- **Compute:** Google Cloud Run
- **Frontend:** React + TypeScript (Premium Glassmorphism Dashboard)

## 📦 Setup & Installation

### Prerequisites
- Node.js v20+
- Python 3.10+
- Google Cloud Project with Vertex AI enabled

### Backend Setup
1. Navigate to `backend/intersection-agent` or `backend/city-orchestrator`.
2. Run `npm install`.
3. Set environment variables:
   ```bash
   export GOOGLE_GENAI_API_KEY="your-key"
   export GOOGLE_CLOUD_PROJECT="your-project-id"
   ```
4. Start with `npm start`.

### Frontend Setup
1. Navigate to `frontend/dashboard`.
2. Run `npm install`.
3. Start with `npm start`.

## 📢 AI Disclosure
**WiraLalu was developed with the assistance of Antigravity (Google DeepMind's agentic coding assistant).** 
- AI was used for: System architecture design, boilerplate generation for Genkit flows, and premium CSS styling. 
- All reasoning logic and agentic loops were engineered to align with the Malaysia Madani framework and National Industrial Master Plan 2030.

---
*Built for Malaysia. By TEAM liuqi.*
