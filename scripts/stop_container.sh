#!/bin/bash

cd /home/ubuntu/app

echo "Stopping running containers..."
docker compose -f docker-compose-cicd.yml down || true