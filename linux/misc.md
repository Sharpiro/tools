# Misc

## 7 Zip

* Installation
  * ```sudo apt install p7zip-full```
* Usage
  * ```7z```
  * ```x```: extract
  * ```l```: list archive
  * ```-otemp```: set output directory to 'temp'

## iPhone detection fix

 ```bash
 sudo usbmuxd -u -U usbmux
```

* <https://ubuntuforums.org/showthread.php?t=2376741>

## Print Current Directory

```bash
pwd
```

## Search Text

```bash
echo data this is ata my text data | grep ata
```

```bash
grep ata test.txt
```

## Get Count of Search Text

```bash
echo data this is ata my text data | grep -o ata | wc -l
```

```bash
grep -o ata test.txt| wc -l
```

## Links

### Symbolic Links

```bash
# ln -s source target
sudo ln -s /usr/lib64/libssl.so.1.1.1 /usr/lib64/libssl.so.1.0.0
```
