SHELL = bash
NODE = $(shell which node)
NPM = $(shell which npm)
YAPP = node_modules/yapp/bin/yapp.js

.PHONY: all

all: build run

build:
	$(YAPP) -d public/main build
	$(YAPP) -d public/remote build

install:
ifeq ($(NPM),)
	@echo -e "npm not found.\nInstall it from https://npmjs.org/"
	@exit 1
else
	$(NPM) install .
endif

run:
	$(NODE) bin/run.js
