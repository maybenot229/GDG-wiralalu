#!/bin/bash

# WiraLalu Deployment Script for Cloud Run
# Ensure you are authenticated: gcloud auth login

PROJECT_ID=$(gcloud config get-value project)
REGION="asia-southeast1" # Malaysia-adjacent region

echo "🚀 Deploying WiraLalu to Cloud Run in $REGION..."

# 1. Deploy Intersection Agent
echo "--- Deploying Intersection Agent ---"
cd backend/intersection-agent
gcloud builds submit --tag gcr.io/$PROJECT_ID/wiralalu-agent
gcloud run deploy wiralalu-agent \
  --image gcr.io/$PROJECT_ID/wiralalu-agent \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 1 \
  --set-env-vars GOOGLE_CLOUD_PROJECT=$PROJECT_ID

# 2. Deploy City Orchestrator
echo "--- Deploying City Orchestrator ---"
cd ../city-orchestrator
gcloud builds submit --tag gcr.io/$PROJECT_ID/wiralalu-orchestrator
gcloud run deploy wiralalu-orchestrator \
  --image gcr.io/$PROJECT_ID/wiralalu-orchestrator \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --min-instances 1 \
  --set-env-vars GOOGLE_CLOUD_PROJECT=$PROJECT_ID

echo "✅ Deployment Complete!"
