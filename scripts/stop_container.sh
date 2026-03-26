#!/bin/bash

cd /home/ubuntu/app

echo "Stopping running containers..."
docker compose down || true