# Linux

## Environment Variables And Aliases

### Current User

#### Aliases

```bash
vim ~/.bashrc
```

```bash
alias py=python3
```

### All Users

#### Add to path for all users

Open `/etc/environment` and add new directory to ```PATH```:

```bash
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/opt/node-v10.13.0-linux-x
64/bin"
```

#### Allow new directory to be used by super users

Open `/etc/sudoers` and add new directory to ```secure_path```:

```bash
secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin:/opt/node-v10.13.0-li
nux-x64/bin"
```

## Disk commands

### List information

```bash
sudo fdisk -l

df

lsblk
```

### Create Windows ISO in Linux

```bash
# format filesystem NTFS

# install WoeUSB
sudo dnf install WoeUSB

# copy ISO to USB
sudo woeusb \
    --target-filesystem NTFS \
    --device Win10_1809Oct_English_x64.iso /dev/sdc
```

## ffmpeg

```bash
# clip a 10 minute video starting at the 30 minute mark
# timestamp format: HH:MM:SS.xxx
ffmpeg -i "input.mp4" -ss 00:30:00.0 -t 00:10:00.0 "output.mp4"
```

## Luks

### dump master key

```bash
sudo cryptsetup luksDump --dump-master-key /dev/nvme0n1p2
```

## 7 Zip

* Installation
  * ```sudo apt install p7zip-full```
* Usage
  * ```7z```
  * ```x```: extract
  * ```l```: list archive
  * ```-otemp```: set output directory to 'temp'

## Tor

### Get Tor Running

* [Must setup shared library path in order for executable to see the shared objects in its own directory](https://stackoverflow.com/a/21173918/5344498):

```bash
LD_LIBRARY_PATH=/path/to/Tor
export LD_LIBRARY_PATH
./tor
```

### Get Onion Service Running

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

## Misc

### iPhone detection fix

 ```bash
 sudo usbmuxd -u -U usbmux
```

* <https://ubuntuforums.org/showthread.php?t=2376741>

### Print Current Directory

```bash
pwd
```

### Search Text

```bash
echo data this is ata my text data | grep ata
```

```bash
grep ata test.txt
```

### Get Count of Search Text

```bash
echo data this is ata my text data | grep -o ata | wc -l
```

```bash
grep -o ata test.txt| wc -l
```

### Links

#### Symbolic Links

```bash
# ln -s source target
sudo ln -s /usr/lib64/libssl.so.1.1.1 /usr/lib64/libssl.so.1.0.0
```

### Ignore case in terminal

Add the following to ```~/.inputrc``` for current user or ```/etc/inputrc``` for all users:

```bash
set completion-ignore-case On
```
