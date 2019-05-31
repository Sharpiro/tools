#!/bin/bash

server=$1
archive_name=archive.tar

if [ -z "$server" ];then
    echo "error: must provide dns server name"
    exit 1
fi

if [ ! -d secrets ]; then
    echo "error: could not find secrets directory"
    exit 1  
fi

tar -czf $archive_name -C secrets .

scp -i keyPair_test_1.pem $archive_name $server:~/$archive_name

torrc=`cat <<EOF
HiddenServiceDir /var/lib/tor/website/
HiddenServicePort 80 127.0.0.1:80
HiddenServiceVersion 3
EOF
`

remote_script=`cat <<EOF
sudo rm -r /var/lib/tor
sudo rm -r /etc/tor
sudo mkdir -p /var/lib/tor/website
sudo mkdir -p /etc/tor
echo "$torrc" | sudo tee /etc/tor/torrc >> /dev/null
sudo mv ~/$archive_name /var/lib/tor/website/$archive_name
sudo tar -xf /var/lib/tor/website/$archive_name -C /var/lib/tor/website
sudo rm /var/lib/tor/website/$archive_name
sudo apt install -y tor nginx
sudo chown -R debian-tor:debian-tor /var/lib/tor
sudo chmod -R 700 /var/lib/tor
EOF
`
ssh -i keyPair_test_1.pem $server "$remote_script"

rm $archive_name
