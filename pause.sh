#!/bin/bash

# WiraLalu Pause Script
# 1. Scales Cloud Run to 0
# 2. Redirects Pub/Sub to dead-end to prevent wake-ups

SERVICES=("wiralalu-agent" "wiralalu-orchestrator" "wiralalu-dashboard")
SUBSCRIPTIONS=("wiralalu-agent-sub" "wiralalu-orchestrator-sub")
REGION="asia-southeast1"

echo "⏸️ Pausing WiraLalu services and silencing Pub/Sub..."

# Scale to 0
for SERVICE in "${SERVICES[@]}"
do
  echo "--- Scaling $SERVICE to 0 ---"
  gcloud run services update $SERVICE --min-instances 0 --region $REGION --quiet
done

# Redirect Pub/Sub
for SUB in "${SUBSCRIPTIONS[@]}"
do
  echo "--- Redirecting $SUB to dead-end ---"
  gcloud pubsub subscriptions update $SUB --push-endpoint="https://dead-end.wiralalu.internal" --quiet
done

echo "✅ All services paused and Pub/Sub silenced."
