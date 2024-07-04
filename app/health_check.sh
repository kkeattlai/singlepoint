#!/bin/bash

# Function to check if the service is healthy
check_service_health() {
    # Perform your check here, e.g., with curl or another command
    if curl -sSf http://localhost:3000; then
        echo "Service is healthy. Exiting."
        exit 0  # Exit the script with success status
    else
        echo "Service is not healthy yet."
    fi
}

# Loop to check service health every few seconds
while true; do
    check_service_health
    sleep 5  # Adjust sleep interval as needed
done