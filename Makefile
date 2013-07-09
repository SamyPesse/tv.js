SHELL = bash

NODE = $(shell which node)
NPM = $(shell which npm)
YAPP = $(shell which yapp.js)

.PHONY: all

all: build run

build:
ifeq ($(NPM),)
	@echo -e "npm not found.\nInstall it from https://npmjs.org/"
	@exit 1
else
	@-npm build
endif

install:
ifeq ($(NPM),)
	@echo -e "npm not found.\nInstall it from https://npmjs.org/"
	@exit 1
else
	@npm install .
endif

run:
ifeq ($(NODE),)
	@echo -e "node not found.\nInstall it from http://nodejs.org"
	@exit 1
else
	@node bin/run.js
endif
