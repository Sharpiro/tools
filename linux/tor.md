# Tor

## Get Tor Running

* [Must setup shared library path in order for executable to see the shared objects in its own directory](https://stackoverflow.com/a/21173918/5344498):

```bash
LD_LIBRARY_PATH=/path/to/Tor
export LD_LIBRARY_PATH
./tor
```

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
