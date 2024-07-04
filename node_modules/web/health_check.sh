#!/bin/sh

getContainerHealth () {
  docker inspect --format "{{json .State.Health.Status }}" $1
}

waitContainer () {
  while STATUS=$(getContainerHealth $1); [ $STATUS != "\"healthy\"" ]; do
    if [ $STATUS = "\"unhealthy\"" ]; then
      echo "Failed!"
      exit -1
    fi
    printf .
    lf=$'\n'
    sleep 1
  done
  printf "$lf"
}

echo "hi"
waitContainer
# Function to check if the service is healthy
# check_service_health() {
#     # Perform your check here, e.g., with curl or another command
#     if curl -sSf http://localhost:3000; then
#         echo "Service is healthy. Exiting."
#         exit 0  # Exit the script with success status
#     else
#         echo "Service is not healthy yet."
#     fi
# }

# echo "hi"
# # Loop to check service health every few seconds
# while true; do
#     check_service_health
#     sleep 5  # Adjust sleep interval as needed
# done