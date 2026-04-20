#!/bin/bash

# WiraLalu Resume Script
# 1. Scales Cloud Run to 1
# 2. Restores Pub/Sub endpoints

REGION="asia-southeast1"
PROJECT_ID=$(gcloud config get-value project)

echo "▶️ Resuming WiraLalu services..."

# Restore Agent
gcloud run services update wiralalu-agent --min-instances 1 --region $REGION --quiet
AGENT_URL=$(gcloud run services describe wiralalu-agent --region $REGION --format='value(status.url)')
gcloud pubsub subscriptions update wiralalu-agent-sub --push-endpoint="$AGENT_URL/decide" --quiet

# Restore Orchestrator
gcloud run services update wiralalu-orchestrator --min-instances 1 --region $REGION --quiet
ORCH_URL=$(gcloud run services describe wiralalu-orchestrator --region $REGION --format='value(status.url)')
gcloud pubsub subscriptions update wiralalu-orchestrator-sub --push-endpoint="$ORCH_URL/orchestrate" --quiet

# Restore Dashboard
gcloud run services update wiralalu-dashboard --min-instances 1 --region $REGION --quiet

echo "✅ All services resumed and Pub/Sub restored!"
