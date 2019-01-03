using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace base91
{
    class Program
    {
        static void Main(string[] args)
        {
            var bytes = new byte[64];
            RNGCryptoServiceProvider.Create().GetBytes(bytes);
            Console.WriteLine(string.Join("", bytes.Select(b => b.ToString("x2"))));
            var encoded = Base91Encoder.Encode(bytes);
            Console.WriteLine(Encoding.UTF8.GetString(encoded));
            Console.WriteLine(encoded.Length);
            var decoded = Base91Encoder.Decode(encoded);
            Console.WriteLine(Encoding.UTF8.GetString(decoded));
            Console.WriteLine(decoded.Length);
        }
    }

    public class Base91Encoder
    {
        public static String ts = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~\"";
        public static byte[] ENCODING_TABLE = Encoding.UTF8.GetBytes(ts);
        private static sbyte[] DECODING_TABLE = InitializeDecodingTable();
        private static int BASE = ENCODING_TABLE.Length;
        private static float AVERAGE_ENCODING_RATIO = 1.2297f;

        private static sbyte[] InitializeDecodingTable()
        {
            var decodingTable = new sbyte[256];
            for (int i = 0; i < 256; ++i)
                decodingTable[i] = -1;

            for (int i = 0; i < BASE; ++i)
                decodingTable[ENCODING_TABLE[i]] = (sbyte)i;

            return decodingTable;
        }

        public static byte[] Encode(byte[] data)
        {

            var estimatedSize = (int)Math.Ceiling(data.Length * AVERAGE_ENCODING_RATIO);
            var output = new List<byte>(estimatedSize);

            int ebq = 0;
            int en = 0;
            for (int i = 0; i < data.Length; ++i)
            {
                ebq |= (data[i] & 255) << en;
                en += 8;
                if (en > 13)
                {
                    int ev = ebq & 8191;

                    if (ev > 88)
                    {
                        ebq >>= 13;
                        en -= 13;
                    }
                    else
                    {
                        ev = ebq & 16383;
                        ebq >>= 14;
                        en -= 14;
                    }
                    output.Add(ENCODING_TABLE[ev % BASE]);
                    output.Add(ENCODING_TABLE[ev / BASE]);
                }
            }

            if (en > 0)
            {
                output.Add(ENCODING_TABLE[ebq % BASE]);
                if (en > 7 || ebq > 90)
                {
                    output.Add(ENCODING_TABLE[ebq / BASE]);
                }
            }

            return output.ToArray();
        }

        public static byte[] Decode(byte[] data)
        {

            // if (data.length == 0)
            // return new byte[] {};

            int dbq = 0;
            int dn = 0;
            int dv = -1;

            var temp = (double)data.Length / AVERAGE_ENCODING_RATIO;
            var estimatedSize = (int)Math.Round(data.Length / AVERAGE_ENCODING_RATIO);
            var output = new List<byte>(estimatedSize);

            for (int i = 0; i < data.Length; ++i)
            {
                if (DECODING_TABLE[data[i]] == -1)
                    continue;
                if (dv == -1)
                    dv = DECODING_TABLE[data[i]];
                else
                {
                    dv += DECODING_TABLE[data[i]] * BASE;
                    dbq |= dv << dn;
                    dn += (dv & 8191) > 88 ? 13 : 14;
                    do
                    {
                        output.Add((byte)dbq);
                        dbq >>= 8;
                        dn -= 8;
                    } while (dn > 7);
                    dv = -1;
                }
            }

            if (dv != -1)
            {
                output.Add((byte)(dbq | dv << dn));
            }

            return output.ToArray();
        }
    }
}
