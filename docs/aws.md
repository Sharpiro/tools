# AWS

## Elastic Cloud Compute (EC2)

* an instance is an OS with specific hardware installed
* an instance is created from an imaged
* storage
  * use Elastic Block Storage (EBS) for file systems
  * use Simple Storage Service (S3) for independent files

### Pricing

* storage
  * EBS
    $.10 / GB / month
  * auto-scaling groups
    * free
  * load balancer
    * $0.025 / hour
* dedicated hosts
  * most expensive
  * rent the entire server
* on-demand
  * cheaper than dedicated
  * most flexible
* reserved instances
  * cheaper than on-demand
  * long-term contracts
* spot instances
  * cheapest
  * worst performance
  * uses "spare" aws resources

## Elastic Block Storage (EC2)

## Simple Storage Service (S3)

* can be used with any type of file
* `bucket` is the root resource and foundational structure in S3
* objects are stored in a bucket
* trigger events when an item is added/modified/deleted

### Pricing

* amount of data
* number of requests
* amount of data transferred

## Relational Database Service (RDS)

* "managed"  b/c aws takes care of
  * backups
  * updates
  * infrastructure
* RDS database options
  * my sql
  * postgre sql
  * MS sql server
  * maria db
  * oracle db
  * amazon aurora
* still need to decide which EC2 it will run on, you just won't manage that instance  `<!-- todo: need to confirm -->`

## Route53

* the solution for DNS needs

## Elastic Beanstalk (EB)

* application deployment

## no-sql databases

* dynamo-db
  * document and key-value storage
  * unlimited elastic storage
  * no hardware choices
  * pay for what you use
  * core structure is a table
  * first 25 GB free
  * reading is cheaper than writing
  * high performance queries
* redshift
  * data warehousing solution
  * can take in data from RDS, dynamo-db, s3 buckets
  * based on `cluster`
  * a cluster is a group of `nodes`
  * nodes have types, similar to EC2
  * for processing of large data

## Security Groups (SG)

* IP-based communication rules for a single or a group of service instances
* examples
  * control who can ssh into ec2 instances
  * allow access b/w ec2 instances
  * allow access to databases
  * accept http requests

## Virtual Private Cloud (VPC)

* secure resources into groups that follow access rules and share a logical space
* security groups secure single instances
* VPCs secure groups of instances
* configure routing tables
* use NAT gateways for outbound traffic
* internal ip address allocation
* contains 1 or more subnets
* subnets
  * 1 subnet for public access
  * 1 subnet for private access
  * further increase security of aws instances
* routing tables
  * control what goes where
* network ACL
  * control who can come and go

## CloudWatch

* the solution for your monitoring needs
* monitoring
* acting on alerts
* setup alarms to monitor various metrics and then perform an action
  * sms message
  * trigger an auto-scale action
* cloudwatch can monitor EC2 instances

## CloudFront

* content delivery network
* allows you to serve files across the globe with low latency
* distribution
  * original content
  * unique url used for content

## Resource Groups

* group resources by application or other criteria
