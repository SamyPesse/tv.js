#!/bin/bash

USER=pi
RAKE=rake

TVJS_REPO=https://github.com/SamyPesse/tv.js.git
TVJS_DIR="/home/${USER}/tv.js"

OUT="/home/${USER}/tvjs.log"

case "$1" in
update)
	echo "updating tv.js from $TVJS_REPO"
	rm -rf $TVJS_DIR
	mkdir $TVJS_DIR
	git clone $TVJS_REPO $TVJS_DIR
	sudo -u $USER cd $TVJS_DIR
	sudo -u $USER $RAKE install > $OUT 2>$OUT &
	sudo -u $USER $RAKE build > $OUT 2>$OUT &

start)
	echo "starting tv.js: $TVJS_DIR"
	unclutter -display :0 -noevents -grab
	sudo -u $USER cd $TVJS_DIR
	sudo -u $USER $RAKE run > $OUT 2>$OUT &
	;;

stop)
	killall $RAKE
	;;

*)
	echo "usage: $0 (start|stop)"
esac

exit 0