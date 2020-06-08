echo '%sudo ALL=(ALL) NOPASSWD:ALL' | sudo tee -a /etc/sudoers >> /dev/null

git clone https://github.com/bitcoin/bitcoin.git
cp bitcoin/contrib/gitian-build.py .

# reboot required?
./gitian-build.py --setup

export NAME=Sharpiro
export VERSION=0.20.0
# ./gitian-build.py -j 5 -m 5000 --detach-sign --no-commit -o l -b $NAME $VERSION
./gitian-build.py --detach-sign --no-commit -o l -b $NAME $VERSION
