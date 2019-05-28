#!/bin/bash

# install apps
sudo apt update
sudo apt install -y tor nginx

# configure tor
torrc=`cat <<EOF
HiddenServiceDir /var/lib/tor/website/
HiddenServicePort 80 127.0.0.1:80
HiddenServiceVersion 3
EOF
`
echo "$torrc" | sudo tee /etc/tor/torrc >> /dev/null

# restart services
sudo systemctl restart tor
sudo systemctl restart nginx