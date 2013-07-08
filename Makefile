SHELL = bash

NODE = $(shell which node)
NPM = $(shell which npm)
YAPP = $(shell which yapp.js)

.PHONY: all

all: build run

build:
ifeq ($(YAPP),)
	@echo -e "yapp.js not found.\nInstall it from http://friendcode.github.io/yapp.js/"
	@exit 1
else
	@-yapp.js -d public/main build
	@-yapp.js -d public/remote build
endif

install:
ifeq ($(NPM),)
	@echo -e "npm not found.\nInstall it from https://npmjs.org/"
	@exit 1
else
	@npm install .
	@sudo -H npm install -g "git://github.com/FriendCode/yapp.js.git#master"
endif

run:
ifeq ($(NODE),)
	@echo -e "node not found.\nInstall it from http://nodejs.org"
	@exit 1
else
	@node bin/run.js
endif
