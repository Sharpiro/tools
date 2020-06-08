#! /bin/bash

gitian-builder/bin/make-base-vm --lxc --arch amd64 --suite bionic # For releases after and including 0.17.0

# test -f  /data/gitian-builder/base-precise-amd64 || bin/make-base-vm --lxc --arch amd64 --suite bionic
