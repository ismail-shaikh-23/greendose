#!/bin/bash

cd /home/ubuntu/app

echo "Pulling latest images..."
docker compose -f docker-compose-cicd.yml pull

echo "Starting containers..."
docker compose -f docker-compose-cicd.yml up -d