#! /bin/bash

./gitian-build.py --setup --docker
# ./gitian-build.py --setup

# ./gitian-build.py --detach-sign --no-commit -o l -b $NAME $VERSION
export NAME=Sharpiro
export VERSION=0.20.0
./gitian-build.py --docker --detach-sign --no-commit -o l -b $NAME $VERSION
