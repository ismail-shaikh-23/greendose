.PHONY: up down restart pull logs build

DOCKER_COMPOSE = -f docker-compose.yml -f ./docker/dev.yml

up:
	docker-compose $(DOCKER_COMPOSE) up --build -d

down:
	docker-compose $(DOCKER_COMPOSE) down

pull:
	git pull

restart:
	$(MAKE) down
	$(MAKE) up

build:
	 docker-compose ${DOCKER_COMPOSE} build

logs:
	docker-compose $(DOCKER_COMPOSE) logs -f
