#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Variables
LOCAL_FUNCTIONS_PATH="./supabase/functions"  # Path to your local functions directory

# Ensure required environment variables are set
if [ -z "$SERVER_IP" ] || [ -z "$CONTAINER_ID" ]; then
  echo "Environment variables SERVER_IP and CONTAINER_ID must be set."
  exit 1
fi

REMOTE_FUNCTIONS_PATH="/data/coolify/services/$CONTAINER_ID/volumes/functions" # Remote path

# Logging function
log() {
  echo "$(date +'%Y-%m-%d %H:%M:%S') - $1"
}

# Check if the local functions path exists
if [ ! -d "$LOCAL_FUNCTIONS_PATH" ]; then
  log "Local functions path does not exist: $LOCAL_FUNCTIONS_PATH"
  exit 1
fi

# Test if the remote server is reachable
log "Checking connectivity to server $SERVER_IP..."
if ! ping -c 1 "$SERVER_IP" &>/dev/null; then
  log "Server $SERVER_IP is not reachable. Exiting..."
  exit 1
fi

# Ensure the remote base directory exists
log "Ensuring the remote base directory exists: $REMOTE_FUNCTIONS_PATH"
ssh root@"$SERVER_IP" "mkdir -p $REMOTE_FUNCTIONS_PATH" || {
  log "Failed to create remote base directory: $REMOTE_FUNCTIONS_PATH"
  exit 1
}

# Copy the entire directory structure and ensure missing folders are created
log "Copying all function folders and contents to the server..."
rsync -avz "$LOCAL_FUNCTIONS_PATH/" root@"$SERVER_IP":"$REMOTE_FUNCTIONS_PATH" || {
  log "Failed to sync functions. Exiting..."
  exit 1
}

log "Deployment complete! All function folders and contents are in $REMOTE_FUNCTIONS_PATH."
