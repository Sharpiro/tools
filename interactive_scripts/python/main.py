import hashlib
import inspect
import binascii
import numpy
import math

irreduciblePolynomial = 0x11b

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


def binary(number, maxPadding=8, endianness="be", separator=8):
    if number > 0:
        binaryString = bin(number)[2:]
        paddedBinary = ("0"*maxPadding)[len(binaryString):] + binaryString
    else:
        mask = int("1"*maxPadding, 2)
        binaryString = bin(number & mask)[2:]
        paddedBinary = binaryString
    byteGroups = (paddedBinary[i:i+separator] for i in range(0, len(paddedBinary), separator))
    if endianness == "le":
        byteGroups = reversed(list(byteGroups))
    separatedBinary = "-".join(byteGroups)
    return separatedBinary


def binList(byteIterable, maxPadding=8):
    bits = list()
    for byte in byteIterable:
        binaryData = bin(byte)[2:]
        paddedBinary = ("0"*maxPadding)[len(binaryData):] + binaryData
        bits.append(paddedBinary)
    print("-".join(bits))


def fromBinList(binaryString, split=8):
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


def mortgage(ratePercent, mortgagePeriodYears, presentValue):
    rate = ratePercent / 100 / 12
    numberOfPeriods = mortgagePeriodYears * 12
    monthlyPayment = numpy.pmt(rate, numberOfPeriods, presentValue)
    return monthlyPayment, monthlyPayment * numberOfPeriods, 13
