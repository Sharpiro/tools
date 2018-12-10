#r "nuget: Newtonsoft.Json, 11.0.2"

#load "./load/objects.csx"
// #load "./load/sheet.csx"
#load "./load/io.csx"
#load "./load/FormatTextAsNumberConverter.csx"
#load "../../shared/Blake2Scripted.csx"

using System.Collections.Generic;
using System.Globalization;
using System.Reflection;
using System.Security.Cryptography;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

static void print(object obj) => WriteLine(obj);
static public byte[] readBuffer => json<byte[]>(ReadLine());
static byte[] buffer(int size) => size >= 0 ? new byte[size] : readBuffer;
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
    if (encoding == "base64")
    {
        return Convert.FromBase64String(data);
    }
    throw new Exception("invalid encoding");
}

static byte[] random(int size = 32)
{
    var buffer = new byte[size];
    RNGCryptoServiceProvider.Create().GetBytes(buffer);
    return buffer;
}

static object json(string jsonText) => JsonConvert.DeserializeObject(jsonText);
static T json<T>(string jsonText) => JsonConvert.DeserializeObject<T>(jsonText);
static string json<T>(T json) => JsonConvert.SerializeObject(json);
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

static byte[] swap(byte[] buffer) => buffer.Select(b => (byte)~b).ToArray();
static void swap(string fileName) => File.WriteAllBytes($"{fileName}.swapped", swap(File.ReadAllBytes(fileName)));
static IEnumerable<string[]> csv(string filePath) => ReadAllLinesSafe(filePath).Select(l => l.Split(','));

static List<Dictionary<string, string>> csvToMaps(string filePath)
{
    var rawData = csv(filePath);
    var headers = rawData.First();
    var allMaps = new List<Dictionary<string, string>>();
    foreach (var data in rawData.Skip(1))
    {
        var map = new Dictionary<string, string>();
        for (var i = 0; i < headers.Length; i++)
        {
            map[headers[i]] = data[i];
        }
        allMaps.Add(map);
    }
    return allMaps;
}

static string csvToJson(string filePath)
{
    var csvMaps = csvToMaps(filePath);
    var settings = new JsonSerializerSettings
    {
        Converters = { new FormatTextAsNumberConverter() },
        Formatting = Formatting.Indented
    };
    var json = JsonConvert.SerializeObject(csvMaps, settings);
    return json;
}

public string commands
{
    get
    {
        var startsWith = "Submission#0:";
        var blacklist = new HashSet<string>{
            // "ReadSafe",
            // "ReadSafeTemp",
            "ComputeStringHash",
            "ToString",
            "Equals",
            "GetHashCode",
            "GetType",
            "Finalize",
            "MemberwiseClone"
        };
        var blacklistParts = new[]{
            "get_",
            "set_",
            "<",
            ">",
        };

        var assembly = Assembly.GetExecutingAssembly();
        var names = (from type in assembly.GetTypes()
                     from method in type.GetMethods(
                       BindingFlags.Public | BindingFlags.NonPublic |
                       BindingFlags.Instance | BindingFlags.Static)
                     select type.FullName + ":" + method.Name).Distinct().ToArray();
        var filtered = names
            .Where(n => n.StartsWith(startsWith))
            .Select(n => n.Substring(startsWith.Length))
            .Where(n => !blacklist.Contains(n))
            .Where(n => !blacklistParts.Any(bp => n.Contains(bp))).ToArray()
            .OrderBy(n => n);

        var json = JsonConvert.SerializeObject(filtered);
        return $"commands: [{string.Join(", ", filtered)}]";
    }
}

WriteLine(commands);
