# Linux

## General

* Everything is a file

## Root Directories

* bin (binaries)
  * os binaries and programs like `cat` and `ls`
* boot
  * os boot loader
* cdrom
  * legacy mount point for cd-rom
* dev (devices)
  * hardware devices
    * discs
    * webcams
    * keyboards
    * etc
  * first hard drive partition
    * /dev/sda1
* etc (etcetera)
  * system-wide configurations
* home
  * personal docs
  * can be installed on different drives which allows for easier re-install
* libs (libraries)
  * where libraries of functions are stored for use by binaries
  * lib
  * lib32
  * lib64
* media
  * where os managed mounted devices
  * leave this to the OS to manage
* mnt (mount)
  * where you should mount things manually
* opt (optional)
  * where manually installed software from vendors resides
  * where you can install software you've created yourself
* proc (processes)
  * information about processes
  * cpu info
    * cat /proc/cpuinfo
* root
  * root user's home folder
  * does not reside in `home` directory like other users
* run
  * tempfs file system
    * all in ram
    * gone on reboot
* sbin
  * binaries for root user
* snap (snap packages)
  * self-contained applications
* srv (services)
  * files served to http/ftp
* sys (system)
  * way to interact with kernel
  * also not physically written to disc like `run`
* tmp (temporary)
  * files are temporarily stored during application session
* usr (user)
  * non-essential software
  * most software installed from source ends up in local folders
* var (variable)
  * files and directories expected to grow in size
  * logs

## Environment Variables And Aliases

### Current User

#### Add Aliases (current user)

```bash
vim ~/.bashrc

# add alias
alias py=python3
```

#### Add to path (current user)

Open `~/.profile` and add new directory to ```PATH```:

```bash
export PATH="$HOME/.cargo/bin:$PATH"
```

#### Add Script or Program

Copy program to ```/usr/bin```

### All Users

#### Add Aliases (all users)

Copy ```.sh``` script to ```/etc/profile.d```

ex: ```test.sh```:

```bash
sudo vim /etc/profile.d/test.sh

# add alias
alias py=python3
```

#### Add to path (all users)

Copy ```.sh``` script to ```/etc/profile.d```

```bash
export PATH="$HOME/.cargo/bin:$PATH"
```

## Keyboard Mapping

### Terminal

```sh
# special characters section
 stty --help | less

# change "interrupt" to ctrl-k
stty intr \^k

# clear line with escape
bind '"\e":"\C-k \C-u"'

# clear screen with ctrl-r
bind '"\C-r":"\C-k \C-uclear\n"'

# alt-shift-w to execute command w/o disturbing current line
bind -x '"\eW":"who"'
```

#### Persistent Terminal Bindings

add to `~/.inputrc`

```sh
"\C-r":"\C-k \C-uclear\n"
"\e":"\C-k \C-u"
```

### Global

```sh
# create new symbols file
sudo vim /usr/share/X11/xkb/symbols/custom

# OR update default symbols file
sudo vim /usr/share/X11/xkb/symbols/us
```

```sh
# paste in the following
xkb_symbols "custom" {

 name[Group1] = "Custom";
 include "us(basic)"

        key <RALT> {        [     Home,     Home            ]       };
        key <RCTL> {        [     End,      End             ]       };
};

```

```sh
# load new symbol configuration
setxkbmap custom
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

### basic

```bash
ffmpeg -i input.mp4 output.avi
```

### itunes mp3

```bash
ffmpeg -i input.mp3 -aq 0 -vn output.mp3
ffmpeg -i input.mp3 -b:a 128 -vn output.mp3 -b:a 128=audio bitrate
```

### plyback speed

```bash
ffmpeg -i videoplayback.m4a -af "atempo=1.5" -vn videoplayback-fast.mp3
```

### clip

```bash
# clip a 10 minute video starting at the 30 minute mark
# timestamp format: HH:MM:SS.xxx
ffmpeg -i "input.mp4" -ss 00:30:00.0 -t 00:10:00.0 "output.mp4"
```

### fade in/out

```bash
# clip w/ fade in/out
ffmpeg -i input.mp4 -ss 00:00:00.0 -t 00:00:10.0 -y -vf fade=in:0:60,fade=out:240:30 -af afade=in:st=0:d=1,afade=out:st=5:d=5 slide_fade_in.mp4
```

### flags

| flag          | usage             | description
| ------------- |------------------ |-------------
| -aq           | -aq               | audio quality(lower better, fixes common iTunes length bug)
| -vn           | -vn               | disable video(fixes 'invalid pixel' bug even on some audio files in rare cases)
| -s            | -s 640x480        | resolution
| -af           | -af "atempo=1.5"  | audio format for changing playback speed

## Luks

### dump master key

```bash
sudo cryptsetup luksDump --dump-master-key /dev/nvme0n1p2
```

## SSH

### SFTP via Nautilus

```sh
ssh-add /home/user/path-to-your-key/key_name
sftp://funky@ip.to.your.server:7000
```

## 7 Zip

* Installation
  * ```sudo apt install p7zip-full```
* Usage
  * ```7z```
  * ```x```: extract
  * ```l```: list archive
  * ```-otemp```: set output directory to 'temp'

## Links / Shortcuts

### Symbolic Links

```bash
# ln -s source target
sudo ln -s /usr/lib64/libssl.so.1.1.1 /usr/lib64/libssl.so.1.0.0
```

## Ignore case in terminal

Add the following to ```~/.inputrc``` for current user or ```/etc/inputrc``` for all users:

```bash
set completion-ignore-case On
```

## Git Credential libsecret

```sh
git config --global credential.helper /usr/libexec/git-core/git-credential-libsecret
```

## OpenSSL

* gen private key only
  * openssl genpkey -algorithm RSA -out key.pem
* gen private/public key .pem files
  * openssl req -x509 -newkey rsa:4096 -keyout test-private-key.pem -out test-public-key.pem -nodes -subj '/CN=localhost'
* gen pkcs12 .pfx file
  * openssl pkcs12 -export -out test-pkcs12.pfx -inkey test-private-key.pem -in test-public-key.pem -passout pass:

## Misc

### iPhone detection fix

 ```bash
 sudo usbmuxd -u -U usbmux
```

* <https://ubuntuforums.org/showthread.php?t=2376741>

#### Allow new directory to be used by super users

Open `/etc/sudoers` and add new directory to ```secure_path```:

```bash
secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin:/opt/node-v10.13.0-li
nux-x64/bin"
```

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

### Customize Bookmarks

```bash
# default bookmarks
vim ~/.config/user-dirs.dirs
```

```bash
# custom bookmarks
vim ~/.config/gtk-3.0/bookmarks
```

> Don't know how to remove "Starred" yet...
