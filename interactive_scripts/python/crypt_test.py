from main import xor_crypt

TEST_KEY = b"\xd8<\xa5\x17\xbb\xb1\xa4\xf2\x7f\xaa\xb8\xe2?\x8f\xc10"

DEFAULT_RAND_SIZE = 32
DEFAULT_CHECKSUM_SIZE = 32


def test_crypt():
    data = b"hello, world 123-+ 987 gg"
    encrypted = xor_crypt(TEST_KEY, data)
    decrypted = xor_crypt(TEST_KEY, encrypted)
    assert len(
        encrypted
    ) == 8 + 1 + DEFAULT_RAND_SIZE + 1 + DEFAULT_CHECKSUM_SIZE + len(data)
    assert decrypted == data


def test_crypt_rand():
    data = b"\xc0f1>pQtC\xfe\x01\xb8$\x0b7<\x88\xc3\x805s\xa4\x1d\x9e"
    rand = b"\xca\x8e\xd5\xb3k\x93w\xc2Bk\x0c\x94\x98\xa8`\x8a"
    encrypted = xor_crypt(TEST_KEY, data, rand)
    decrypted = xor_crypt(TEST_KEY, encrypted)
    assert len(encrypted) == 8 + 1 + len(rand) + 1 + DEFAULT_CHECKSUM_SIZE + len(data)
    assert decrypted == data
