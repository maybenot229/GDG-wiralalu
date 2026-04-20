#!/bin/bash

# WiraLalu Pause Script
# Scales all Cloud Run services to 0 instances to save costs.

SERVICES=("wiralalu-agent" "wiralalu-orchestrator" "wiralalu-dashboard")
REGION="asia-southeast1"

echo "⏸️ Pausing WiraLalu services to save costs..."

for SERVICE in "${SERVICES[@]}"
do
  echo "--- Scaling $SERVICE to 0 ---"
  gcloud run services update $SERVICE --min-instances 0 --region $REGION --quiet
done

echo "✅ All services paused. They will now scale to zero when not in use."
