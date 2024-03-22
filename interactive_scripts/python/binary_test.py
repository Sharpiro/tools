from pytest import raises
from main import binary, binexpr


def test_zero():
    expected = "00000000"
    actual = binary(0, "be")
    assert expected == actual


def test_one():
    expected = "00000001"
    actual = binary(1, "be")
    assert expected == actual


def test_negative_one():
    expected = "11111111"
    actual = binary(-1, "be")
    assert expected == actual


def test_negative_two():
    expected = "11111110"
    actual = binary(-2, "be")
    assert expected == actual


def test_small():
    expected = "00110111"
    actual = binary(55, "be")
    assert expected == actual


def test_small_neg():
    expected = "11001001"
    actual = binary(-55, "be")
    assert expected == actual


def test_zero_sep():
    expected = "100000010"
    actual = binary(258, "be", size=1, sep=0)
    assert expected == actual


def test_one_sep():
    expected = "0-0-0-0-0-0-0-1-0-0-0-0-0-0-1-0"
    actual = binary(258, "be", sep=1)
    assert expected == actual


def test_be():
    expected = "00000001-00000010"
    actual = binary(258, "be")
    assert expected == actual


def test_le():
    expected = "00000010-00000001"
    actual = binary(258, "le")
    assert expected == actual


def test_be_small_size():
    expected = "1-00000010"
    actual = binary(258, "be", size=1)
    assert expected == actual


def test_le_small_size():
    expected = "00000010-1"
    actual = binary(258, "le", size=1)
    assert expected == actual


def test_be_big_size():
    expected = "00000000-00000000-00000001-00000010"
    actual = binary(258, "be", size=32)
    assert expected == actual


def test_be_no_separator():
    expected = "11100011000010100011101111001100"
    actual = binary(0xE30A3BCC, sep=0)
    assert expected == actual


def test_le_big_size():
    expected = "00000010-00000001-00000000-00000000"
    actual = binary(258, "le", size=32)
    assert expected == actual


def test_be_big_size_small_sep():
    expected = "000-0000-0000-0000-0000-0001-0000-0010"
    actual = binary(258, "be", size=31, sep=4)
    assert expected == actual


def test_le_big_size_big_sep():
    expected = "0000-0010-0000-0001-0000-0000-0000-000"
    actual = binary(258, "le", size=31, sep=4)
    assert expected == actual


def test_neg_be():
    expected = "11111110-11111110"
    actual = binary(-258, "be")
    assert expected == actual


def test_neg_le():
    expected = "11111110-11111110"
    actual = binary(-258, "le")
    assert expected == actual


def test_neg_be_small_size():
    expected = "10-11111110"
    actual = binary(-258, "be", size=1)
    assert expected == actual


def test_neg_le_small_size():
    expected = "11111110-10"
    actual = binary(-258, "le", size=1)
    assert expected == actual


def test_neg_be_big_size():
    expected = "11111111-11111111-11111110-11111110"
    actual = binary(-258, "be", size=32)
    assert expected == actual


def test_neg_le_big_size():
    expected = "11111110-11111110-11111111-11111111"
    actual = binary(-258, "le", size=32)
    assert expected == actual


def test_neg_be_big_size_small_sep():
    expected = "111-1111-1111-1111-1111-1110-1111-1110"
    actual = binary(-258, "be", size=31, sep=4)
    assert expected == actual


def test_neg_le_big_size_big_sep():
    expected = "1111-1110-1111-1110-1111-1111-1111-111"
    actual = binary(-258, "le", size=31, sep=4)
    assert expected == actual


def test_large_be():
    expected = "00001100-11011010-11000111-11011011-00110111"
    actual = binary(55210138423, "be")
    assert expected == actual


def test_large_le():
    expected = "00110111-11011011-11000111-11011010-00001100"
    actual = binary(55210138423, "le")
    assert expected == actual


def test_large_be_small_size():
    expected = "1100-11011010-11000111-11011011-00110111"
    actual = binary(55210138423, "be", size=1)
    assert expected == actual


def test_large_le_small_size():
    expected = "00110111-11011011-11000111-11011010-1100"
    actual = binary(55210138423, "le", size=1)
    assert expected == actual


def test_large_be_big_size():
    expected = "00000000-00001100-11011010-11000111-11011011-00110111"
    actual = binary(55210138423, "be", size=48)
    assert expected == actual


def test_large_le_big_size():
    expected = "00110111-11011011-11000111-11011010-00001100-00000000"
    actual = binary(55210138423, "le", size=48)
    assert expected == actual


def test_large_be_big_size_small_sep():
    expected = "000-0000-0000-1100-1101-1010-1100-0111-1101-1011-0011-0111"
    actual = binary(55210138423, "be", size=47, sep=4)
    assert expected == actual


def test_large_le_big_size_big_sep():
    expected = "0011-0111-1101-1011-1100-0111-1101-1010-0000-1100-0000-000"
    actual = binary(55210138423, "le", size=47, sep=4)
    assert expected == actual


# @todo: seems wrong, prob need to delete anyway
# def test_unkown():
#     binary(0x2B3D_1EAB, "be", sep=10, fmt="h", size=1)


class TestBinExpr:
    def test_bin_expr(self):
        expected = "1110 001 1000 0 1010 0011 1011 11001100"
        actual = binexpr(0xE30A3BCC, [4, 3, 4, 1, 4, 4, 4, 8])
        assert expected == actual

    def test_bin_expr_extra_expression(self):
        with raises(Exception) as e:
            binexpr(0xE30A3BCC, [4, 3, 4, 1, 4, 4, 4, 8, 1])
        assert "reached end of binary string at '1'" in str(e.value)

    def test_bin_expr_invalid_expression(self):
        with raises(Exception) as e:
            binexpr(0xE30A3BCC, [4, 3, 4, 1, 4, 4, 4, 9])
        assert "reached end of binary string at '9'" in str(e.value)
