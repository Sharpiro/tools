file_name="file.mp3"
scp -i keyPair_test_1.pem /home/sharpiro/Documents/temp/podcast_temp/$file_name ubuntu@ec2-54-144-36-107.compute-1.amazonaws.com:~/$file_name
ssh -i keyPair_test_1.pem ubuntu@ec2-54-144-36-107.compute-1.amazonaws.com "sudo mv ~/$file_name /var/www/html/content/$file_name"
