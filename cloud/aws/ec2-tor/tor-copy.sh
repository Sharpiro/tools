server=$1
archive_name=archive.tar

if [ -s $server ]; then
    echo "error: must provide server name"
    exit 1  
fi

if [ ! -d secrets ]; then
    echo "error: could not find 'secrets' directory"
    exit 1  
fi

if [ ! -f secrets/hostname ]; then
    echo "error: could not find 'secrets/hostname'"
    exit 1  
fi

if [ ! -f secrets/hs_ed25519_public_key ]; then
    echo "error: could not find 'secrets/hs_ed25519_public_key'"
    exit 1  
fi

if [ ! -f secrets/hs_ed25519_secret_key ]; then
    echo "error: could not find 'secrets/hs_ed25519_secret_key'"
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
sudo apt update
sudo apt install -y tor nginx
echo "$torrc" | sudo tee /etc/tor/torrc >> /dev/null
sudo mkdir -p /var/lib/tor/website
sudo mv ~/$archive_name /var/lib/tor/website/$archive_name
sudo tar -xf /var/lib/tor/website/$archive_name -C /var/lib/tor/website
sudo rm /var/lib/tor/website/$archive_name
sudo chown -R debian-tor:debian-tor /var/lib/tor
sudo chmod -R 700 /var/lib/tor
sed 's/# server_tokens off;/server_tokens off;/' /etc/nginx/nginx.conf | sudo tee /etc/nginx/nginx.conf >> /dev/null
sudo systemctl restart tor
sudo systemctl restart nginx
EOF
`
ssh -i keyPair_test_1.pem $server "$remote_script"

rm $archive_name
