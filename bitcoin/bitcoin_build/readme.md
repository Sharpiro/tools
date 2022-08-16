<!-- cspell:ignore Gitian -->

# bitcoin

## gitian building

### setup container

```sh
# --user gitianuser
podman create -it --hostname debian --name bitcoin_vm ubuntu bash
podman start -a bitcoin_vm

podman build -t bitcoin_gitian .
podman run -h debian --rm -it bitcoin_gitian
podman build -t bitcoin_gitian . && podman run --security-opt seccomp=/usr/share/containers/seccomp.json --privileged=true -h debian --rm -it bitcoin_gitian


# sudo -i podman build -t bitcoin_gitian . && sudo -i podman run --privileged=true -h debian --rm -it bitcoin_gitian
sudo podman build -t bitcoin_gitian . && sudo podman run -h debian --privileged=true --rm -it bitcoin_gitian
# apt-get update
# ubuntu-archive-keyring
# export DEBIAN_FRONTEND=noninteractive
# apt-get install -y git ruby apt-cacher-ng qemu-utils debootstrap lxc python-cheetah ubuntu-archive-keyring parted kpartx bridge-utils make curl firewalld
```

## links

* [Failed to find gateway addresses when run make-clean-vm](https://github.com/devrandom/gitian-builder/issues/175)
* [Shortcomings of Rootless Podman](https://github.com/containers/libpod/blob/master/rootless.md)
* [loop device in a linux container?](https://serverfault.com/q/701384/553540)
