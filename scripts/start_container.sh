#!/bin/bash

cd /home/ubuntu/app

echo "Pulling latest images..."
docker compose pull

echo "Starting containers..."
docker compose up -d