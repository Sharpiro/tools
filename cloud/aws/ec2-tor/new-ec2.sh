# vars
ubuntu_18_04_lts=ami-0a313d6098716f372

# create ec2 key pair

# create ec2 security group

# create ec2 instance
# aws ec2 run-instances --image-id ami-abcd1234 --count 1 --instance-type m3.medium \
# --key-name my-key-pair --subnet-id subnet-abcd1234 --security-group-ids sg-abcd1234 \
# --user-data file://my_script.txt

# default security group seems to be very unrestrictive...

aws ec2 run-instances --image-id $ubuntu_18_04_lts --count 1 --instance-type t2.micro --key-name keyPair_test_1 --security-group-ids sg-05bf41b28beb292a7 --user-data file://tor-install.sh
