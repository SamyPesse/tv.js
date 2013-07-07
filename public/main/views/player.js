define([
    "Underscore",
    "jQuery",
    "yapp/yapp",
    "vendors/video",
    "utils/updates"
], function(_, $, yapp, $video, Updates) {
    var logging = yapp.Logger.addNamespace("player");

    var STREAM_URL = "/api/stream";

    var toHHMMSS = function (sec_num) {
        sec_num = Math.floor(sec_num);
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        var time    = hours+':'+minutes+':'+seconds;
        return time;
    };


    // List Item View
    var Player = yapp.View.extend({
        className: "player",
        template: "player.html",
        events: {
            
        },
        initialize: function() {
            Player.__super__.initialize.apply(this, arguments);
            this.toolbarTimeout = null;
            this.streamReady = false;
            this.playing = false;
            this.duration = 0;
            this.position = 0;
            this.downloadPercent = 0;
            this.speed = 1;
            this.lock = true;
            this.error = 0;

            Updates.on("streaming:stats", this.setStats, this);
            return this;
        },

        finish: function() {
            this.updateMessages();
            return Player.__super__.finish.apply(this, arguments);
        },

        /* Set play speed */
        setPlaySpeed: function(s, d) {
            if (d != null) s = this.speed + d;
            if (s < 0.25) s = 0.25;
            if (s == this.speed) return this;
            this.speed = s;
            this.video().N.playbackRate = this.speed;
            return this.updateMessages();
        },

        /* Set play progress */
        setPlayCurrentTime: function(p) {
            this.position = p;
            var percent = this.getPlayPercent();
            this.$(".bar .play").css("width", percent+"%");
            this.$(".toolbar .duration").text(toHHMMSS(this.position));
            this.setLock();
        },

        /* Set play progress */
        getPlayPercent: function(p) {
            if (this.duration == 0) return 0;
            return Math.floor((this.position*100)/this.duration);
        },

        /* Set stat */
        setStats: function(stats) {
            if (stats.progress != null) {
                this.downloadPercent = Math.floor(stats.progress*100);
                this.$(".bar .download").css("width", this.downloadPercent+"%");
                this.$(".toolbar .download-percent").text(this.downloadPercent+"%");
                this.setLock();
            }
            if (stats.complete == true) {
                this.$(".toolbar .speed").text("download complete");
            } else if (stats.download_speed != null) {
                this.$(".toolbar .speed").text(stats.download_speed+" KB/s");
            }
            return this;
        },

        /* Get video element */
        video: function() {
            var v = videojs("video");
            return v;
        },

        /* Play the video */
        play: function() {
            this.setPlaySpeed(1);
            return this.setPlaying(true);
        },

        /* Pause the video */
        pause: function() {
            this.setPlaySpeed(1);
            return this.setPlaying(false);
        },

        /* Run streaming */
        runStream: function(movieid) {
            return this.stopStreaming().always(function() {
                return yapp.Requests.getJSON("/api/movie/play/"+movieid);
            });  
        },

        /* Add streaming to video */
        addStream: function() {
            var self = this;
            var $video = this.video();
            //$video.src({ type: "video/mp4", src: "http://video-js.zencoder.com/oceans-clip.mp4" });
            $video.src({ type: "video/ogg", src: STREAM_URL });
            $video.on("durationchange", function () {
                logging.log("duration change");
                self.duration = $video.duration();
            });

            $video.on("timeupdate", function () {
                logging.log("time update");
                self.setPlayCurrentTime($video.currentTime());
            });

            $video.on("error", function (e) {
                logging.error("Error streaming video ", $video, arguments);
            });

            $video.on("play", function () {
                logging.log("Video play ");
                self.playing = true;
                self.toolbarHide(4000);
                self.updateMessages();
            });

            $video.on("pause", function () {
                logging.log("Video pause ");
                self.playing = false;
                self.toolbarShow();
                self.updateMessages();
            });

            $video.ready(function(){
                logging.log("video is ready");
                $video.width($(window).width());
                $video.height($(window).height());
            });

            $(window).resize(function() {
                $video.width($(window).width());
                $video.height($(window).height());
            });
        },

        /* Stop streaming */
        stopStreaming: function() {
            this.pause();
            return yapp.Requests.getJSON("/api/movie/stop");
        },

        /* Play/Pause the video */
        togglePlay: function() {
            if (this.playing) {
                this.pause();
            } else {
                this.play();
            }
        },

        /* Show player toolbar */
        toolbarShow: function() {
            if (this.toolbarTimeout != null) clearTimeout(this.toolbarTimeout);
            this.toolbarTimeout = null;
            this.$(".toolbar").removeClass("hide");
            return this;
        },

        /* Hide player toolbar */
        toolbarHide: function(t) {
            if (this.toolbarTimeout != null) clearTimeout(this.toolbarTimeout);
            this.toolbarTimeout = setTimeout(_.bind(function() {
                this.$(".toolbar").addClass("hide");
            }, this), t || 0);
            return this;
        },

        /* Set lock */
        setLock: function(l) {
            if (l == null) {
                l = this.downloadPercent < _.max([1, this.getPlayPercent()]);
            }
            this.lock = l;
            if (this.lock) {
                this.pause();
            } else if (!this.streamReady) {
                this.streamReady = true;
                this.addStream();
            }
            return this.updateMessages();
        },

        /* Set error */
        setError: function(e) {
            this.error = e;
            return this.updateMessages();
        },

        /* Set playing */
        setPlaying: function(l) {
            if (this.lock && l != false) return this;

            if (l) {
                this.video().play();
            } else {
                this.video().pause();
            }
            return this;
        },

        /* update message */
        updateMessages: function() {
            this.$(".message.wait").toggle(this.error == 0 && this.lock);
            this.$(".message.pause").toggle(this.error == 0 && !this.playing && !this.lock);

            // Error
            this.$(".message.error-src").toggle(this.error == MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED);

            // Speed
            this.$(".message.speed").toggle(this.speed != 1);
            this.$(".message.speed .value").text(this.speed);
            return this;
        },

        /* Show player */
        show: function(movieid) {
            if (movieid != null) this.runStream(movieid);
            this.$el.addClass("active");
        },

        /* Hide player */
        hide: function() {
            this.stopStreaming();
            this.$el.removeClass("active");
        }
    });

    yapp.View.Template.registerComponent("player", Player);

    return Player;
});