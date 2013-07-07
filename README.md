tv.js : Smart TV with P2P streaming in JS
====

![screen](https://raw.github.com/SamyPesse/movies/master/screens/2.png)

Complete TV interface for unlimited watching in streaming movies.
Use iTunes for finding movies informations and BitTorrent for downloading and streaming movies.

It runs a server which can run in a Raspberry Pi and the UI can be controlled by a smartphone (no need of keyboard or mouse).

This application is the result of a 24h personal hackathon (7 july 2013) by Aaron O'Mullan (@AaronO) and me (@SamyPesse).


![screen](https://raw.github.com/SamyPesse/movies/master/screens/1.png)

![screen](https://raw.github.com/SamyPesse/movies/master/screens/3.png)

![screen](https://raw.github.com/SamyPesse/movies/master/screens/5.png)


## How to use it on your computer ?

For building and running the app, you'll need :
    
    node
    rake
    ffmpeg


For installing dependencies, build and run the all :

    rake install
    rake

And go to localhost:8888 on your browser

Ou can run only without rebuilding the client with :

    rake run


## How to install it on your TV ?

This application has been built and designed to run on a TV screen using a Raspberry Pi.

### Software Stack:

    Raspbian OS – a Debian distro specially made for the rPi
    NodeJs
    tv.js
    ffmpeg
    Chromium Browser

### Steps :

#### 1. Install Raspbian & NodeJS

Follow [this tutorial](http://blog.rueedlinger.ch/2013/03/raspberry-pi-and-nodejs-basic-setup/) to install Raspbian and Node Js on your Raspberry Pi

#### 2. Install Chromium

    sudo apt-get install chromium-browser
    sudo apt-get install ttf-mscorefonts-installer

#### 3. Install tv.js

    export DISPLAY=:0.0
    git clone https://github.com/SamyPesse/tv.js.git && cd tv.js
    rake install

#### 4. Build and run tv.js

    rake build
    rake run
    chromium --kiosk http://localhost:8888


## How to install ffmpeg ?

tv.js needs ffmpeg for converting videos into ogv, be sure to have ffmpeg installed with the good codec for converting into ogv.

#### On mac :

    brew install ffmpeg --with-fdk-aac --with-ffplay --with-freetype --with-frei0r --with-libass --with-libvo-aacenc --with-libvorbis --with-libvpx --with-opencore-amr --with-openjpeg --with-opus --with-rtmpdump --with-schroedinger --with-speex --with-theora --with-tools


