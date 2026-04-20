#!/bin/bash

# WiraLalu Resume Script
# Scales all Cloud Run services back to 1 instance for zero-latency.

SERVICES=("wiralalu-agent" "wiralalu-orchestrator" "wiralalu-dashboard")
REGION="asia-southeast1"

echo "▶️ Resuming WiraLalu services for maximum performance..."

for SERVICE in "${SERVICES[@]}"
do
  echo "--- Scaling $SERVICE to 1 ---"
  gcloud run services update $SERVICE --min-instances 1 --region $REGION --quiet
done

echo "✅ All services resumed. Ready for demo/judging!"
