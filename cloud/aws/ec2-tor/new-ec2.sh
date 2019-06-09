# vars
ubuntu_18_04_lts=ami-024a64a6685d05041
instance_type=t2.micro

# create ec2 key pair

# create ec2 security group

# create ec2 instance
# aws ec2 run-instances --image-id ami-abcd1234 --count 1 --instance-type m3.medium \
# --key-name my-key-pair --subnet-id subnet-abcd1234 --security-group-ids sg-abcd1234 \
# --user-data file://my_script.txt

aws ec2 run-instances --image-id $ubuntu_18_04_lts --count 1 --instance-type $instance_type --key-name keyPair_test_1 --security-group-ids sg-05bf41b28beb292a7
