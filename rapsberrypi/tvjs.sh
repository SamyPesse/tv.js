#!/bin/bash

USER=pi

TVJS_REPO=https://github.com/SamyPesse/tv.js.git
TVJS_DIR="/home/${USER}/tv.js"

OUT="/home/${USER}/tvjs.log"

case "$1" in
update)
	echo "updating tv.js from $TVJS_REPO"
	su - $USER
	rm -rf $TVJS_DIR
	mkdir $TVJS_DIR
	git clone $TVJS_REPO $TVJS_DIR
	cd $TVJS_DIR
	rake install > $OUT 2>$OUT &
	rake build > $OUT 2>$OUT &
	;;

start)
	echo "starting tv.js: $TVJS_DIR"
	su - $USER
	cd $TVJS_DIR
	rake run > $OUT 2>$OUT &
	export DISPLAY=:0.0
	chromium --kiosk http://localhost:8888
	;;

stop)
	killall $RAKE
	;;

*)
	echo "usage: $0 (start|stop)"
esac

exit 0