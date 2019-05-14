# Unicode

## Overview

<https://kishuagarwal.github.io/unicode.html>

Unicode is a mapping from characters to numbers in the form of "code points".  Unicode defines several encoding schemes such as UTF-8 and UTF-16.

## Byte Order Mark (BOM)

| Bytes       | Encoding Form         |
|-------------|-----------------------|
| 00 00 FE FF | UTF-32, big-endian    |
| FF FE 00 00 | UTF-32, little-endian |
| FE FF       | UTF-16, big-endian    |
| FF FE       | UTF-16, little-endian |
| EF BB BF    | UTF-8                 |

## UTF-8

* Most commonly used Unicode encoding scheme.
* 1-4 bytes

| Bits      | Meaning                                                     |
|-----------|-------------------------------------------------------------|
| 0xxx xxxx | A single-byte US-ASCII code (from the first 127 characters) |
| 110x xxxx | One more byte follows                                       |
| 1110 xxxx | Two more bytes follow                                       |
| 1111 0xxx | Three more bytes follow                                     |
| 10xx xxxx | A continuation of one of the multi-byte characters          |

## UTF-16

* 2 or 4 bytes
