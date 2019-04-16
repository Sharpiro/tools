import unittest
from main import binary

class BinaryTests(unittest.TestCase):
    # misc

    def test_zero(self):
        expected="00000000"
        actual = binary(0, "be")
        self.assertEqual(expected, actual)
    
    def test_negative_one(self):
        expected="11111111"
        actual = binary(-1, "be")
        self.assertEqual(expected, actual)

    def test_small(self):
        expected="00110111"
        actual = binary(55, "be")
        self.assertEqual(expected, actual)

    def test_small_neg(self):
        expected="11001001"
        actual = binary(-55, "be")
        self.assertEqual(expected, actual)

    # regular number

    def test_be(self):
        expected="00000001-00000010"
        actual = binary(258, "be")
        self.assertEqual(expected, actual)
    
    def test_le(self):
        expected="00000010-00000001"
        actual = binary(258, "le")
        self.assertEqual(expected, actual)

    def test_be_small_size(self):
        expected="1-00000010"
        actual = binary(258, "be", size=1)
        self.assertEqual(expected, actual)

    def test_le_small_size(self):
        expected="00000010-1"
        actual = binary(258, "le", size=1)
        self.assertEqual(expected, actual)

    def test_be_big_size(self):
        expected="00000000-00000000-00000001-00000010"
        actual = binary(258, "be", size=32)
        self.assertEqual(expected, actual)

    def test_le_big_size(self):
        expected="00000010-00000001-00000000-00000000"
        actual = binary(258, "le", size=32)
        self.assertEqual(expected, actual)

    def test_be_big_size_small_sep(self):
        expected="000-0000-0000-0000-0000-0001-0000-0010"
        actual = binary(258, "be", size=31, sep=4)
        self.assertEqual(expected, actual)

    def test_le_big_size_big_sep(self):
        expected="0000-0010-0000-0001-0000-0000-0000-000"
        actual = binary(258, "le", size=31, sep=4)
        self.assertEqual(expected, actual)

    # negative number

    def test_neg_be(self):
        expected="11111110-11111110"
        actual = binary(-258, "be")
        self.assertEqual(expected, actual)
    
    def test_neg_le(self):
        expected="11111110-11111110"
        actual = binary(-258, "le")
        self.assertEqual(expected, actual)

    def test_neg_be_small_size(self):
        expected="10-11111110"
        actual = binary(-258, "be", size=1)
        self.assertEqual(expected, actual)

    def test_neg_le_small_size(self):
        expected="11111110-10"
        actual = binary(-258, "le", size=1)
        self.assertEqual(expected, actual)

    def test_neg_be_big_size(self):
        expected="11111111-11111111-11111110-11111110"
        actual = binary(-258, "be", size=32)
        self.assertEqual(expected, actual)

    def test_neg_le_big_size(self):
        expected="11111110-11111110-11111111-11111111"
        actual = binary(-258, "le", size=32)
        self.assertEqual(expected, actual)

    def test_neg_be_big_size_small_sep(self):
        expected="111-1111-1111-1111-1111-1110-1111-1110"
        actual = binary(-258, "be", size=31, sep=4)
        self.assertEqual(expected, actual)

    def test_neg_le_big_size_big_sep(self):
        expected="1111-1110-1111-1110-1111-1111-1111-111"
        actual = binary(-258, "le", size=31, sep=4)
        self.assertEqual(expected, actual)

    # large number
    
    def test_large_be(self):
        expected="00001100-11011010-11000111-11011011-00110111"
        actual = binary(55210138423, "be")
        self.assertEqual(expected, actual)
    
    def test_large_le(self):
        expected="00110111-11011011-11000111-11011010-00001100"
        actual = binary(55210138423, "le")
        self.assertEqual(expected, actual)

    def test_large_be_small_size(self):
        expected="1100-11011010-11000111-11011011-00110111"
        actual = binary(55210138423, "be", size=1)
        self.assertEqual(expected, actual)

    def test_large_le_small_size(self):
        expected="00110111-11011011-11000111-11011010-1100"
        actual = binary(55210138423, "le", size=1)
        self.assertEqual(expected, actual)

    def test_large_be_big_size(self):
        expected="00000000-00001100-11011010-11000111-11011011-00110111"
        actual = binary(55210138423, "be", size=48)
        self.assertEqual(expected, actual)

    def test_large_le_big_size(self):
        expected="00110111-11011011-11000111-11011010-00001100-00000000"
        actual = binary(55210138423, "le", size=48)
        self.assertEqual(expected, actual)

    def test_large_be_big_size_small_sep(self):
        expected="000-0000-0000-1100-1101-1010-1100-0111-1101-1011-0011-0111"
        actual = binary(55210138423, "be", size=47, sep=4)
        self.assertEqual(expected, actual)

    def test_large_le_big_size_big_sep(self):
        expected="0011-0111-1101-1011-1100-0111-1101-1010-0000-1100-0000-000"
        actual = binary(55210138423, "le", size=47, sep=4)
        self.assertEqual(expected, actual)

if __name__ == '__main__':
    unittest.main()
