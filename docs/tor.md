# Tor

## How Tor Works

### Onion Address Authentication

#### Authentication Steps

* user enters onion address (OA) into address bar
* user connects to OA
* user verifies ownership of OA
  * receive server certificate
  * verify hash of public key equals OA
    * now we know the certificate is accurate
    * if it doesn't equal, it's a possible MITM attack
  * verify OA knows corresponding private key
    * rsa (prime numbers)
      * send PKI encrypted symmetric private key to server
      * if he can decrypt sym key, then he is owner
    * elliptic (discrete logarithm)
      * request server to sign nonce and verify it
      * if signature and data are valid, then he is owner

#### Steps to Fake Certificate Validation

* find another public key/cert that hashes to OA
  * hard problem because of the "random oracle" assumption
  * any valid pre-image would have to be a valid public key size
* find corresponding private key from fraudulent public key
  * hard problem because of PKI assumptions

#### How Tor removes DNS and CA

* What if a router or DNS are compromised and return a response from a malicious service?
  * normie-web
    * requirements
      * DNS
      * CA
      * certificate
      * signature
    * fraudulent service will be unable to create signature using TLS certificate signed by CA
    * DNS is required to map a name address to an IP address
    * CA is required to map a name or IP address to a public key
  * tor
    * requirements
      * certificate
      * signature
    * client hashes cert public key to verify it matches onion address
    * server proves ownership of private key via signature
    * DNS is unnecessary because name address = public key, thus no name mapping service required
    * CA is unnecessary because name address = public key, thus no public key mapping service required

### Hidden Service (HS) Directories (HSDIR) Version 3

This process explains how one can access a HS from directory information without any directory knowing the onion address.  Because the HSDIRS don't know the onion addresses, the hosting of HS descriptors does not expose the hidden services themselves, essentially forming a type of zero-knowledge.

* client obtains identity public key of HS (onion address)
* client obtains blinded public key of HS
  * blinded public key is derived from the identity public key (onion address) for a given time period
  * the blinded public key is intended to be rotated after a short amount of time (day(s))
* download the HS descriptor from the HSDIR using the blinded key as an index
* get introduction points(IP)
  * obtained by decrypting the HS descriptor body
  * decrypted by `subcredential`, derived from the identity public key of the service (onion address)
* request IP rendezvous to HS
  * requires authentication key also found in decrypted HS descriptor body for a given IP
* HS can now selectively respond as it chooses
  * could require client auth to prove knowledge of a pre-shared client private key

### Version 3 Impersonation Improvements

* Some keys can be stored offline to avoid unintended key exposure
* identity key can be stored offline
* identity key can generate blinded and descriptor keys in advance
* the blinded signing key must also be kept private
  * the blinded signing key can be used to derive the identity key
* the sub-credential can be stored on the HS host

### Death By a Thousand Keys

* identity key pair(master/long-term)
  * random
  * private
    * should be stored offline
  * public
    * encoded to onion address
* blinded key pair
  * derived from identity key
  * private
    * should be stored offline
  * public
    * used as index lookup in HSDIRS
* descriptor key pair
  * generated randomly `// todo: probably`
  * private
    * must be stored online
  * public
    * signed by blinded key
    * included in the un-encrypted section of HS descriptors as a cert
      * proves it was signed by the blinded private key, and thus the identity private key
* credential
  * hash("credential" | public-identity-key)
* subcredential (descriptor encryption key)
  * used to encrypt and decrypt HS descriptors
  * can be safely stored on HS host (rend-spec-v3#2.1)
  * hash("subcredential" | credential | blinded-public-key)
* more...

## Get Tor Running

* [Must setup shared library path in order for executable to see the shared objects in its own directory](https://stackoverflow.com/a/21173918/5344498):

```bash
LD_LIBRARY_PATH=/path/to/Tor
export LD_LIBRARY_PATH
./tor
```

## Building Tor
<!-- cspell:disable -->
```sh
# add debug flag
export CFLAG='-ggdb'
sh autogen.sh && ./configure && make
/src/app/tor
```
<!-- cspell:enable-->

## Get Onion Service Running

* run Tor browser once to populate default settings
* Add the following to your ```torrc```:

```bash
HiddenServiceDir /path/to/onion_service
HiddenServiceVersion 3
HiddenServicePort 80 127.0.0.1:8080
```

* Setup required folder permissions (docs say this is optional, but for me it was required)

```bash
chmod 700 /path/to/onion_service
```

* Run Tor

```bash
./tor -f /path/to/torrc
```
