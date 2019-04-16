import hashlib
import inspect
import binascii
import math
import secrets

irreduciblePolynomial = 0x11b

def add_bin(x, y):
    carry = 0
    z = 0
    for i in range(9):
        two_power = 1 << i
        x_i = (x & two_power) >> i
        y_i = (y & two_power) >> i
        sum_i_carry = x_i ^ y_i ^ carry
        if (sum_i_carry == 1):
            z = z ^ two_power
        carry = (x_i & y_i) | (x_i & carry) | (y_i & carry)
    return z

def double_and_add(n, x):
    """
    Returns the result of n * x, computed using
    the double and add algorithm.
    """
    result = 0
    addend = x

    print("result", "addend")
    print(result, addend)
    for bit in bits(n):
        if bit == 1:
            result += addend
        addend <<= 1
        print(result, addend)

    return result

def random(length):
    return list(secrets.token_bytes(length))

def rs1024_polymod(values):
  GEN = [0xe0e040, 0x1c1c080, 0x3838100, 0x7070200, 0xe0e0009, 0x1c0c2412, 0x38086c24, 0x3090fc48, 0x21b1f890, 0x3f3f120]
  chk = 1
  for v in values:
    b = (chk >> 20)
    chk = (chk & 0xfffff) << 10 ^ v
    for i in range(10):
      chk ^= GEN[i] if ((b >> i) & 1) else 0
  return chk

def rs1024_verify_checksum(cs, data):
  return rs1024_polymod([ord(x) for x in cs] + data) == 1

def rs1024_create_checksum(cs, data):
    values = [ord(x) for x in cs] + data
    polymod = rs1024_polymod(values + [0,0,0]) ^ 1
    return [(polymod >> 10 * (2 - i)) & 1023 for i in range(3)]


def sharesize(secretSizeBytes):
    return secretSizeBytes*8+16+16+10


def binary(number, endianness="be", sep=8, size=0):
    """
        Converts a number to a string of bits.
    """
    sep = sep if sep != 0 else 9000
    if number >= 0:
        min_bits = 0 if number == 0 else math.floor(math.log2(number)) + 1
        min_bits_rounded =  8 if min_bits % 8 == 0 else (min_bits + 8) - (min_bits % 8)

        determined_size = size if size > min_bits else min_bits_rounded
        rounded_size = determined_size if determined_size % 8 == 0 else (determined_size + 8) - (determined_size % 8)

        binaryString = bin(number)[2:]
        paddedBinary = ("0"*rounded_size)[len(binaryString):] + binaryString
    else:
        min_bits = math.floor(math.log2((-number)* 2 - 1)) + 1
        min_bits_rounded =  min_bits if min_bits % 8 == 0 else min_bits + 8 - (min_bits % 8)

        determined_size = size if size > min_bits else min_bits_rounded
        rounded_size = determined_size if determined_size % 8 == 0 else (determined_size + 8) - (determined_size % 8)

        mask = int("1"*rounded_size, 2)
        binaryString = bin(number & mask)[2:]
        paddedBinary = binaryString

    determined_size = size if size > 0 else min_bits_rounded
    determined_size = determined_size if determined_size >= min_bits else min_bits
    byteGroups = list((paddedBinary[i:i+8] for i in range(0, len(paddedBinary), 8)))
    sig_bits = determined_size if len(byteGroups) <= 1 else determined_size % ((len(byteGroups) - 1)  * 8)
    byteGroups[0]= byteGroups[0][-sig_bits:]
    byteGroups = byteGroups if endianness == "be" else reversed(byteGroups)

    trimmed_binary = "".join(byteGroups)
    sep_binary = ""
    for i, v in enumerate(trimmed_binary[::-1]) if endianness == "be" else enumerate(trimmed_binary):
        if i != 0 and i % sep == 0:
            sep_binary += "-"
        sep_binary += v

    final = sep_binary[::-1] if endianness == "be" else sep_binary
    return final

def bits(n):
    """
    Returns an array of the binary digits of n, starting
    from the least significant bit.

    bits(151) -> 1, 1, 1, 0, 1, 0, 0, 1 // 8 bits
    """
    def temp(n):
        while n:
            yield n & 1
            n >>= 1

    return list(temp(n))


def binList(byteIterable, maxPadding=8):
    """
        Converts a byte array to a string of bits
    """
    bits = list()
    for byte in byteIterable:
        binaryData = bin(byte)[2:]
        paddedBinary = ("0"*maxPadding)[len(binaryData):] + binaryData
        bits.append(paddedBinary)
    print("-".join(bits))


def fromBinList(binaryString, split=8):
    """
        Converts a string of bits into an array of numbers
    """
    bitGroups = list((binaryString[i:i+split]
                      for i in range(0, len(binaryString), split)))
    numberGroups = (str(int(x, 2)) for x in bitGroups)
    print("-".join(bitGroups))
    print("-".join(numberGroups))


def gfMul(a, b):
    z = 0
    while a > 0:
        if a & 1 == 1:
            z ^= b
        a >>= 1
        b <<= 1
        if b & 0x100 != 0:
            b ^= irreduciblePolynomial
    return z


def sha(data):
    return sha256(data)


def buffer(data="", encoding="hex"):
    if encoding == "hex":
        return bytearray.fromhex(data)
    if encoding == "utf8":
        return bytearray(data, encoding)
    if encoding == "base64":
        return bytearray(binascii.a2b_base64(data))
    return bytearray()


def sha256(data):
    dataArray = bytearray.fromhex(data)
    hasher = hashlib.sha256()
    hasher.update(dataArray)
    res = hasher.hexdigest()
    return res


def ripemd(data):
    dataArray = bytearray.fromhex(data)
    res = hashlib.new("ripemd", dataArray).hexdigest()
    return res


def hash160(data):
    dataArray = bytearray.fromhex(data)
    shaRes = hashlib.new("sha256", dataArray).digest()
    ripRes = hashlib.new("ripemd", shaRes).hexdigest()
    return ripRes


def fast(start, end):
    return (end - start) % 24


def sig(func):
    return inspect.signature(func)
