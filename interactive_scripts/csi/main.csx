#load "./load/objects.csx"
#load "./load/sheet.csx"
#load "./load/io.csx"
#load "../../shared/Blake2Scripted.csx"

using System.Security.Cryptography;

static byte[] buffer(int size) => new byte[size];
static byte[] buffer(string data = "", string encoding = "hex")
{
    if (string.IsNullOrEmpty(data)) return new byte[0];
    if (encoding == "hex")
    {
        if (data.Length % 2 != 0) throw new Exception("invalid hex string");
        var byteList = new List<string>();
        for (var i = 2; i <= data.Length; i++)
        {
            if (i % 2 == 0)
            {
                byteList.Add(data.Substring(i - 2, 2));
            }
        }
        return byteList.Select(t => Convert.ToByte(t, 16)).ToArray();
    }
    if (encoding == "utf8")
    {
        return Encoding.UTF8.GetBytes(data);
    }
    throw new Exception("invalid encoding");
}

static byte[] random(int size = 32)
{
    var buffer = new byte[size];
    RNGCryptoServiceProvider.Create().GetBytes(buffer);
    return buffer;
}

static string hex(byte[] buffer) => string.Join(string.Empty, buffer.Select(b => b.ToString("x2")));
static byte[] sha128(byte[] buffer) => SHA1.Create().ComputeHash(buffer);
static byte[] sha256(byte[] buffer) => SHA256.Create().ComputeHash(buffer);
static byte[] sha(byte[] buffer) => sha256(buffer);
static byte[] blake2(byte[] buffer) => Blake2Scripted.Create().ComputeHash(buffer);
// static byte[] ripemd(byte[] buffer) => RIPEMD160.Create().ComputeHash(buffer);
// static byte[] hash160(byte[] buffer) => ripemd(sha256(buffer));
static byte[] hmac256(byte[] key, byte[] message) => new HMACSHA256(key).ComputeHash(message);
static byte[] hmac512(byte[] key, byte[] message) => new HMACSHA512(key).ComputeHash(message);
static double fast(double start, double end) => (end - start).Mod(24);

// extensions
static double Mod(this double x, double m) => (x % m + m) % m;
static string ToHex(this byte[] buffer) => hex(buffer);