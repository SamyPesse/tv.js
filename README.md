tv.js : Apple TV for Torrent Streaming
====

[![Screen](https://raw.github.com/SamyPesse/movies/master/screens/2.png)](https://raw.github.com/SamyPesse/movies/master/screens/2b.png)
[![Code Now](https://friendco.de/widgets/image/codenow?url=https%3A%2F%2Fgithub.com%2FSamyPesse%2Ftv.js.git)](https://friendco.de/widgets/url/codenow?url=https%3A%2F%2Fgithub.com%2FSamyPesse%2Ftv.js.git)

A Smart TV application to stream movies using BitTorrent. (Yes it actually streams them in order even though it's BitTorrent)

Tv.js used iTunes' API to find movies, isoHunt to search torrents and BitTorrent to downloading/stream movies.

It runs as a server which can run on a Raspberry Pi and the UI can be controlled from a smartphone (no need of keyboard or mouse).

Tv.js is the result of a 24h personal hackathon (7th of July 2013) by Aaron O'Mullan (@AaronO) and me (@SamyPesse).

It's designed to run on a TV screen (through HDMI), but works just as well on a laptop. (it's entirely usable with keyboard controls alone)

You can see a video of it working here on Youtube: [https://www.youtube.com/watch?v=j71NCZnLffg](https://www.youtube.com/watch?v=j71NCZnLffg)

Downloading copyrighted material through torrents may be illegal in your country.

[![Screen](https://raw.github.com/SamyPesse/movies/master/screens/1.png)](https://raw.github.com/SamyPesse/movies/master/screens/1b.png)

[![Screen](https://raw.github.com/SamyPesse/movies/master/screens/3.png)](https://raw.github.com/SamyPesse/movies/master/screens/3b.png)

[![Screen](https://raw.github.com/SamyPesse/movies/master/screens/4.png)](https://raw.github.com/SamyPesse/movies/master/screens/4b.png)

[![Screen](https://raw.github.com/SamyPesse/movies/master/screens/5.png)](https://raw.github.com/SamyPesse/movies/master/screens/5b.png)





## How to use it on your computer ?

To build and run the app, you'll need :

    node
    make
    ffmpeg
	homebrew


To build and run the all :

    make install
    make

And go to [http://localhost:8888](http://localhost:8888) on your browser

Or simply run the server without rebuilding the client with :

    make run


## How to install it on your TV ?

This application has been built and designed to run on a TV screen using a Raspberry Pi.
Follow [this tutorial](https://github.com/SamyPesse/tv.js/blob/master/raspberrypi/README.md) to install TV.js on your Raspberry Pi

## How to install ffmpeg ?

tv.js needs ffmpeg to convert the videos to ogv, make sure you have ffmpeg installed with the necessary codecs.

#### Mac OS X :

	ruby <(curl -fsSk https://raw.github.com/mxcl/homebrew/go)

    brew install ffmpeg --with-fdk-aac --with-ffplay --with-freetype --with-frei0r --with-libass --with-libvo-aacenc --with-libvorbis --with-libvpx --with-opencore-amr --with-openjpeg --with-opus --with-rtmpdump --with-schroedinger --with-speex --with-theora --with-tools


## Todo
    - Use IMBD or another API with a bigger movie collection than Itunes'
    - Cache converted videos
    - Improve overall stability
    - Improve torrent picking algorithm (by seeds/leechers, size, votes, video format ...)
    - Package using NodeWebkit for Windows/Mac/Linux/Raspberry PI
    - Correct boot on Raspberry Pi
    - Add other awesome stuff!


## Disclaimer

There are obvious legal issues, with downloading copyrighted material you do not have a license for. We do not endorse such use cases and take no responsibility for the use people make of it.
