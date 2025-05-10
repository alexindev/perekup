.PHONY: build run dev load migrate_up migrate_down

# Загружаем переменные из .env файла
include .env
export $(shell sed 's/=.*//' .env)

build:
	go build -o cmd/bin/app cmd/app/main.go

run: build
	./cmd/bin/app

dev:
	go run cmd/app/main.go

load:
	go run cmd/loader/main.go

migrate_up:
	migrate -path migrations/ -database "${DATABASE_URL}" -verbose up

migrate_down:
	migrate -path migrations/ -database "${DATABASE_URL}" -verbose down

.DEFAULT_GOAL := dev
