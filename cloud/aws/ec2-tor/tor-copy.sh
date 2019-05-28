server=ubuntu@ec2-54-144-36-107.compute-1.amazonaws.com
archive_name=archive.tar

if [ ! -d secrets ]; then
    echo "error: could not find secrets directory"
    exit 1  
fi

tar -czf $archive_name -C secrets .

scp -i keyPair_test_1.pem $archive_name $server:~/$archive_name

remote_script=`cat <<EOF
sudo systemctl stop tor
&&
sudo mv ~/$archive_name /var/lib/tor/website/$archive_name
&&
sudo tar -xf /var/lib/tor/website/$archive_name -C /var/lib/tor/website
&&
sudo rm /var/lib/tor/website/$archive_name
&&
sudo chown -R debian-tor:debian-tor /var/lib/tor/website
&&
sudo chmod -R 600 /var/lib/tor/website/hostname
&&
sudo chmod -R 600 /var/lib/tor/website/hs_ed25519_public_key
&&
sudo chmod -R 600 /var/lib/tor/website/hs_ed25519_secret_key
&&
sudo systemctl start tor
EOF
`
ssh -i keyPair_test_1.pem $server $remote_script


rm $archive_name
