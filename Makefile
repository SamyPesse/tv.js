SHELL = bash

NODE = $(shell which node)
NPM = $(shell which npm)
YAPP = $(shell which yapp.js)
UNAME_S = $(shell uname -s)

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
ifeq ($(UNAME_S),Darwin)
	@npm install -g "git+https://github.com/FriendCode/yapp.js.git#master"
else
	@sudo -H npm install -g "git+https://github.com/FriendCode/yapp.js.git#master"
endif
endif

run:
ifeq ($(NODE),)
	@echo -e "node not found.\nInstall it from http://nodejs.org"
	@exit 1
else
	@node bin/run.js
endif
