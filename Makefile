SHELL = bash

NODE = $(shell which node)
NPM = $(shell which npm)
YAPP = $(shell npm list | grep yapp)

.PHONY: all

all: build run

build:
ifeq ($(NPM),)
	@echo -e "npm not found.\nInstall it from https://npmjs.org/"
	@exit 1
else
ifeq ($(YAPP),)
	@echo -e "yapp is not installed. Run 'make install' to install all dependencies."
else
	@-npm build
endif
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
