import platform
import sys
import hashlib
import binascii
import math
import secrets
import base64
import os
import datetime
import time
from typing import Any, Callable, Literal
import uuid
import json

base64 = base64
secrets = secrets

format_mode: Literal["hex", "decimal"] | None = None

irreduciblePolynomial = 0x11B
pwd = (lambda: os.getcwd())()


def add_bin(x: int, y: int):
    carry = 0
    z = 0
    for i in range(9):
        two_power = 1 << i
        x_i = (x & two_power) >> i
        y_i = (y & two_power) >> i
        sum_i_carry = x_i ^ y_i ^ carry
        if sum_i_carry == 1:
            z = z ^ two_power
        carry = (x_i & y_i) | (x_i & carry) | (y_i & carry)
    return z


def double_and_add(n: int, x: int):
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


def rs1024_polymod(values: list[int]):
    GEN = [
        0xE0E040,
        0x1C1C080,
        0x3838100,
        0x7070200,
        0xE0E0009,
        0x1C0C2412,
        0x38086C24,
        0x3090FC48,
        0x21B1F890,
        0x3F3F120,
    ]
    chk = 1
    for v in values:
        b = chk >> 20
        chk = (chk & 0xFFFFF) << 10 ^ v
        for i in range(10):
            chk ^= GEN[i] if ((b >> i) & 1) else 0
    return chk


def rs1024_verify_checksum(cs: list[str], data: list[int]):
    return rs1024_polymod([ord(x) for x in cs] + data) == 1


def rs1024_create_checksum(cs: list[str], data: list[int]):
    values = [ord(x) for x in cs] + data
    polymod = rs1024_polymod(values + [0, 0, 0]) ^ 1
    return [(polymod >> 10 * (2 - i)) & 1023 for i in range(3)]


def be(big_endian_string: str):
    """
    Converts a string of big endian bits to a number
    """
    return int(big_endian_string.replace("-", ""), 2)


def le(little_endian_string: str):
    """
    Converts a string of little endian bits to a number
    """
    bit_list = little_endian_string.split("-")
    if len(bit_list) > 1:
        bit_list = bit_list[::-1]
        bits = "".join(bit_list)
        number = int(bits, 2)
        return number
    bit_list = list(
        little_endian_string[i - 8 : i]
        for i in range(8, len(little_endian_string) + 1, 8)
    )
    bit_list = bit_list[::-1]
    bits = "".join(bit_list)
    number = int(bits, 2)
    return number


def binary(number: int, endian="be", sep=8, size=0):
    """
    Converts a number to a string of bits.
    """

    def get_max_bits(number: int):
        min_bits = 0 if number == 0 else math.floor(math.log2(number)) + 1
        min_bits_ceil = 8 if min_bits % 8 == 0 else (min_bits + 8) - (min_bits % 8)
        max_bits = min_bits_ceil if size == 0 else size
        max_bits = max_bits if max_bits >= min_bits else min_bits
        max_bits_ceil = (
            max_bits if max_bits % 8 == 0 else (max_bits + 8) - (max_bits % 8)
        )
        return (max_bits, max_bits_ceil)

    # create padded binary in big endian
    if number >= 0:
        max_bits, max_bits_ceil = get_max_bits(number)
        binaryString = bin(number)[2:]
        paddedBinary = ("0" * max_bits_ceil)[len(binaryString) :] + binaryString
    else:
        max_bits, max_bits_ceil = get_max_bits((-number << 1) - 1)
        mask = 2**max_bits_ceil - 1
        paddedBinary = bin(number & mask)[2:]
    if endian == "be" and max_bits_ceil == max_bits and sep <= 0:
        return paddedBinary

    # trim bits and arrange endianness
    byteGroups = list((paddedBinary[i : i + 8] for i in range(0, len(paddedBinary), 8)))
    sig_bits = (
        max_bits if len(byteGroups) <= 1 else max_bits % ((len(byteGroups) - 1) * 8)
    )
    byteGroups[0] = byteGroups[0][-sig_bits:]
    byteGroups = byteGroups if endian == "be" else byteGroups[::-1]
    trimmed_binary = "".join(byteGroups)
    if sep <= 0:
        return trimmed_binary

    # create binary string with separator
    iterator = (
        enumerate(trimmed_binary[::-1]) if endian == "be" else enumerate(trimmed_binary)
    )
    separated_binary = "".join(
        f"-{v}" if i != 0 and i % sep == 0 else v for i, v in iterator
    )
    separated_binary = separated_binary[::-1] if endian == "be" else separated_binary

    return separated_binary


def binexpr(num: int, expr_list: list[int]):
    bin_str = binary(num, sep=0)
    assert isinstance(bin_str, str)
    parts: list[str] = []
    for expr_index in expr_list:
        if len(bin_str) == 0 or expr_index > len(bin_str):
            raise Exception(f"reached end of binary string at '{expr_index}'")
        part = bin_str[:expr_index]
        parts.append(part)
        bin_str = bin_str[expr_index:]

    parts_joined = "-".join(parts)
    if len(bin_str):
        parts_joined += "-" + bin_str
        pass
    return parts_joined


def hexa():
    pass


def bits(n: int):
    """
    Returns an array of the binary digits of n, starting
    from the least significant bit.

    bits(151) -> 1, 1, 1, 0, 1, 0, 0, 1 // 8 bits
    """

    def get(n: int):
        while n < -1 or n > 0:
            yield n & 1
            n >>= 1

    return list(get(n))


def binlist(byteIterable: list[int], maxPadding=8):
    """
    Converts a byte array to a string of bits
    """
    bits: list[str] = list()
    for byte in byteIterable:
        binaryData = bin(byte)[2:]
        paddedBinary = ("0" * maxPadding)[len(binaryData) :] + binaryData
        bits.append(paddedBinary)
    print("-".join(bits))


def fromBinList(binaryString: str, split=8):
    """
    Converts a string of bits into an array of numbers
    """
    bitGroups = list(
        (binaryString[i : i + split] for i in range(0, len(binaryString), split))
    )
    numberGroups = (str(int(x, 2)) for x in bitGroups)
    print("-".join(bitGroups))
    print("-".join(numberGroups))


def gfMul(a: int, b: int):
    z = 0
    while a > 0:
        if a & 1 == 1:
            z ^= b
        a >>= 1
        b <<= 1
        if b & 0x100 != 0:
            b ^= irreduciblePolynomial
    return z


def buffer(data="", encoding="hex"):
    if encoding == "hex":
        return bytearray.fromhex(data)
    if encoding == "utf8":
        return bytearray(data, encoding)
    if encoding == "base64":
        return bytearray(binascii.a2b_base64(data))
    return bytearray()


def sha1(buffer: bytes):
    hasher = hashlib.sha1()
    hasher.update(buffer)
    res = hasher.digest()
    return res


def sha256(buffer: bytes):
    hasher = hashlib.sha256()
    hasher.update(buffer)
    res = hasher.digest()
    return res


def ripemd(data: str):
    dataArray = bytearray.fromhex(data)
    res = hashlib.new("ripemd", dataArray).hexdigest()
    return res


def hash160(data: str):
    dataArray = bytearray.fromhex(data)
    shaRes = hashlib.new("sha256", dataArray).digest()
    ripRes = hashlib.new("ripemd", shaRes).hexdigest()
    return ripRes


def fast(start: int, end: int):
    return (end - start) % 24


def timestamp():
    """
    ISO 8601 format
    """
    utc_offset_sec = time.altzone if time.localtime().tm_isdst else time.timezone
    utc_offset = datetime.timedelta(seconds=-utc_offset_sec)
    return (
        datetime.datetime.now()
        .replace(microsecond=0, tzinfo=datetime.timezone(offset=utc_offset))
        .isoformat()
    )


def utc(epoch_seconds: int | None = None, ms: int | None = None):
    if epoch_seconds is not None:
        date = datetime.datetime.fromtimestamp(epoch_seconds, datetime.timezone.utc)
    else:
        date = datetime.datetime.now(datetime.timezone.utc)
    if ms is not None:
        date = date.replace(microsecond=ms)
    return date.isoformat()[:-6] + "Z"


def guid():
    return str(uuid.uuid4())


def seconds(time_str: str):
    split_time = time_str.split(":")
    if len(split_time) != 3:
        raise Exception("bad time input")
    total_seconds = (
        int(split_time[0]) * 60 * 60 + int(split_time[1]) * 60 + int(split_time[2])
    )
    return total_seconds


def clip(start: str, stop: str):
    startSeconds = seconds(start)
    stopSeconds = seconds(stop)
    durationSeconds = stopSeconds - startSeconds
    print("start:", startSeconds)
    print("stop:", stopSeconds)
    print("duration:", durationSeconds)
    return {"start": startSeconds, "stop": stopSeconds, "duration": durationSeconds}


def fmt(num: int):
    return format(num, "_")


def hex_bytes(bytes_input: list[int], encoding="S", hex_display="\\x", delimiter=""):
    """
    Convert bytes to a hex string\n
    S = Single byte\n
    l = 16 bit little endian\n
    b = 16 bit big endian
    """
    display_bytes = [
        (f"0x%0{2}x" % i).replace("0x", hex_display) for i in bytes(bytes_input)
    ]
    if encoding == "l":
        display_bytes = [f"{i}{delimiter}{hex_display}00" for i in display_bytes]
    if encoding == "b":
        display_bytes = [f"{hex_display}00{delimiter}{i}" for i in display_bytes]
    display_string = delimiter.join(display_bytes)
    print(display_string)


def open_json(filepath: str):
    text = open(filepath).read()
    jsonObj = json.loads(text)
    return jsonObj


def get_screen_info(res_x: int, res_y: int, diag_inches: int):
    print("size:", diag_inches)
    res_diag = (res_x**2 + res_y**2) ** 0.5
    res = f"{res_x}x{res_y}"
    print("resolution:", f"{res_x}x{res_y}")
    aspect_x, aspect_y = [
        [int(res_x / i), int(res_y / i)]
        for i in reversed(range(2, res_y))
        if res_x % i == 0 and res_y % i == 0
    ][0]
    aspect_ratio = f"{aspect_x}x{aspect_y}"
    print("aspect ratio:", f"{aspect_x}x{aspect_y}")
    pixels = fmt(res_x * res_y)
    print("pixels:", fmt(res_x * res_y))
    ppi = math.ceil(res_diag / diag_inches)
    print("ppi:", math.ceil(res_diag / diag_inches))
    return {
        "size": diag_inches,
        "res": res,
        "aspect_ratio": aspect_ratio,
        "pixels": pixels,
        "ppi": ppi,
    }


def toggle_hex():
    global format_mode
    formatter = get_ipython().display_formatter.formatters["text/plain"]  # type: ignore # noqa: F821
    if format_mode == "hex":
        format_mode = "decimal"
        formatter.for_type(int, lambda n, p, cycle: p.text(f"{n:_}"))  # type: ignore
    else:
        format_mode = "hex"
        formatter.for_type(int, lambda n, p, cycle: p.text(f"0x{n:02_x}"))  # type: ignore


def xor_crypt(key: bytes, data: bytes, rand: bytes | None = None):
    XOR_CRYPT_MAGIC = b"\x0cs@\x0c\x94em\x1f"
    XOR_CRYPT_MAGIC_LEN = len(XOR_CRYPT_MAGIC)

    rand = rand if rand is not None else secrets.token_bytes(32)
    decrypt = data[:XOR_CRYPT_MAGIC_LEN] == XOR_CRYPT_MAGIC
    sum_expected: bytes | None = None
    if decrypt:
        rand_len = data[XOR_CRYPT_MAGIC_LEN]
        rand_start = XOR_CRYPT_MAGIC_LEN + 1
        rand = data[rand_start : rand_start + rand_len]
        sum_len = data[rand_start + rand_len]
        sum_start = rand_start + rand_len + 1
        sum_expected = data[sum_start : sum_start + sum_len]
        data = data[sum_start + sum_len :]
    data_mut = bytearray(data)
    for i in range(0, len(data_mut)):
        for k in key:
            rand_b = rand[i % len(rand)] if len(rand) else 0
            rk = (k + rand_b) % 0x100
            data_mut[i] = data_mut[i] ^ rk

    sum_actual: bytes
    if decrypt:
        sum_actual = sha256(bytes(data_mut))
        if sum_actual != sum_expected:
            sum_expected_hex = None if sum_expected is None else sum_expected.hex()
            raise Exception(
                f"invalid sum, expected '{sum_expected_hex}', actual '{sum_actual.hex()}'"
            )
        return bytes(data_mut)

    sum_actual = sha256(data)
    return (
        XOR_CRYPT_MAGIC
        + bytes([len(rand)])
        + rand
        + bytes([len(sum_actual)])
        + sum_actual
        + data_mut
    )


def read(name: bytes):
    with open(name, "rb") as f:
        return f.read()


def write(name: str, data: bytes):
    with open(name, "wb") as f:
        return f.write(data)


def args(*args: Any):
    print(args)


def clear_screen():
    if platform.system() == "Windows":
        os.system("cls")
    else:
        os.system("clear")


def repeat(
    func: Callable[[], None | Any],
    interval: int = 1,
    rand: bool = False,
    verbose: bool = False,
    inline: bool = False,
    clear: bool = True,
):
    if clear:
        clear_screen()
    if rand:
        interval += 1
    if verbose:
        print("verbose: interval", interval)
        print("verbose: rand", rand)
    try:
        while True:
            result = func()
            if result is not None:
                if inline:
                    print(f" {result}", end="\r")
                else:
                    print(result)
            computed_interval = secrets.randbelow(interval + 1) if rand else interval
            if verbose:
                print(
                    "verbose: interval", datetime.timedelta(seconds=computed_interval)
                )
            time.sleep(computed_interval)
    except Exception:
        pass
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":

    def ipython_global_exception_handler(
        shell: Any, etype: Any, evalue: Any, tb: Any, tb_offset: Any = None
    ):
        print(f"ERROR: {evalue}")

    def python_global_exception_handler(exctype: Any, value: Any, traceback: Any):
        print(f"ERROR: {value}")

    sys.excepthook = python_global_exception_handler
    if "get_ipython" in globals():
        ip = get_ipython()  # type: ignore # noqa: F821
        ip.set_custom_exc((Exception,), ipython_global_exception_handler)  # type: ignore
        toggle_hex()
