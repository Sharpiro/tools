import math
from main import binary, bits
# x = -255
# # x = 152405818018898732
# # bits = 64
# bits = math.floor(math.log2(-x)) + 1
# print(bits)
# mask = 2**bits-1

# print(binary(x, bits, "be", bits))
# print(binary(x, bits, "be", bits))

# print(x)

# x_no_sign = x & mask
# print(bin(x_no_sign))

# print(bin((x_no_sign ^ mask) + 1))
# print(bin((~x_no_sign) + 1))
# print(bin((~x_no_sign & mask) + 1))


# print(-((x_no_sign ^ mask) + 1))
# print(-((~x_no_sign & mask) + 1))

# print(binary(-129))
# print(len(binary(-129)))

# x = -25687
# x = -256
# res = binary(x, size=1)
# print(res)
# print(len(res))

# n = 16
# padding = 10 - (n*8) % 10

# # (size, value)
# id = (15, binary(99, size=15, sep=0))
# iteration_exponent = (0, binary(25, size=0, sep=0))
# group_index = (4, binary(15, size=4, sep=0))
# group_threshold =(4, binary(15, size=4, sep=0))
# group_count =(4, binary(15, size=4, sep=0))
# member_index = (4, binary(15, size=4, sep=0))
# member_threshold = (4, binary(15, size=4, sep=0))
# padded_share_value = (padding + (8 * n), "0"*(padding + (8 * n)))
# checksum = (25, binary(25, size=30, sep=0))


# word1 = 1000
# word2 = 12
# print(list(word1.to_bytes(2, "big")))
# print(binary(word1, size=15))

# print(list(word2.to_bytes(2, "big")))
# print(binary(word2, size=15))

# total_bits = (id[0] + iteration_exponent[0] + group_index[0] + group_threshold[0] + group_count[0] +
#               member_index[0] + member_threshold[0] + padded_share_value + checksum[0])
# print(total_bits)
# total_bits = (id[1] + iteration_exponent[1] + group_index[1] + group_threshold[1] + group_count[1] + 
#     member_index[1] + member_threshold[1] + padded_share_value[1] + checksum[1])
# print(len(total_bits))
# print(total_bits)

# print(len(padded_share_value))
# print(padded_share_value)
# print(id[1])

# print(binary(99, size=15, sep=8))
# print(binary(0, size=5, sep=8))
# print(binary(0, size=4, sep=8))
# print(binary(1 - 1, size=4, sep=8))
# print(binary(1 - 1, size=4, sep=8))
# print(binary(0, size=4, sep=8))
# print(binary(3 - 1, size=4, sep=8))

# print(iteration_exponent)
# 55210138423
x = binary(55, "be")
print(x)
# print(len(x))

# number = -129
# print(math.floor(math.log2((-number)* 2 - 1)) + 1)
# print(math.floor(math.log2((-number << 1) - 1)) + 1)


# data = [1,2,3,4,5,6,7,8,9,10]
# print(data[-5:])
