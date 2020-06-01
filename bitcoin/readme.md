<!-- cspell:ignore Gitian -->

# bitcoin

## full node

### gitian building

#### setup container

```sh
# --user gitianuser
podman create -it --hostname debian --name bitcoin_vm ubuntu bash
podman start -a bitcoin_vm


podman run --rm -it bitcoin_gitian
podman build -t bitcoin_gitian . && podman run -h debian --rm -it bitcoin_gitian
# apt-get update
# ubuntu-archive-keyring
# export DEBIAN_FRONTEND=noninteractive
# apt-get install -y git ruby apt-cacher-ng qemu-utils debootstrap lxc python-cheetah ubuntu-archive-keyring parted kpartx bridge-utils make curl firewalld
```
