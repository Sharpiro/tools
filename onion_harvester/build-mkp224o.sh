#!/bin/bash

# clean
rm -rf libsodium-1.0.18
rm -rf mkp224o
sudo rm /usr/local/lib/libsodium*
sudo rm /usr/lib/libsodium.so.23

# pre-reqs
sudo apt update
sudo apt install -y build-essential autoconf

# install libsodium
wget https://download.libsodium.org/libsodium/releases/libsodium-1.0.18.tar.gz
tar -xzf libsodium-1.0.18.tar.gz
rm libsodium-1.0.18.tar.gz
cd libsodium-1.0.18
./configure
make clean
make && make check
sudo make install
sudo ln -s /usr/local/lib/libsodium.so.23 /usr/lib/libsodium.so.23
cd ..
rm -rf libsodium-1.0.18

# build mkp224o
git clone https://github.com/cathugger/mkp224o.git
cd mkp224o
./autogen.sh
./configure --enable-amd64-64-24k --enable-intfilter
make clean
make
cd ..
