#! "netcoreapp2.0"
#r "ref/Blake2Sharp.dll"
#load "Blake2Scripted.csx"

using System.Security.Cryptography;
using Blake2Sharp;

// private HashAlgorithm _hasher = SHA256.Create();
// private HashAlgorithm _hasher = Blake2.Create();
private HashAlgorithm _hasher = Blake2Scripted.Create();

const string directory = @"C:\Users\sharpiro\Documents\OneDrive\Pictures";
var allFilePaths = Directory.GetFiles(directory, "*", SearchOption.AllDirectories);
var fileGroups = new Dictionary<string, List<string>>();

var timer = new Stopwatch();
timer.Start();

WriteLine($"comparing {allFilePaths.Length} files");
foreach (var filePath in allFilePaths)
{
    var buffer = File.ReadAllBytes(filePath);
    var hashHex = GetHash(buffer);
    var exists = fileGroups.TryGetValue(hashHex, out List<string> fileGroup);
    if (!exists)
    {
        fileGroup = new List<string>();
        fileGroups.Add(hashHex, fileGroup);
    }
    fileGroup.Add(filePath);
}
var dupes = fileGroups.Where(kvp => kvp.Value.Count > 1).Select(kvp => new { Hash = kvp.Key, Files = kvp.Value }).ToList();
//var deletableDupes = dupes.Select(d => d.Files.First(f => !f.Contains("18-16-05"))).ToList();
//foreach (var dupe in deletableDupes)
//{
//    File.Delete(dupe);
//}
timer.Stop();
WriteLine($"{dupes.Count} files duped");
WriteLine($"{dupes.SelectMany(d => d.Files).Count()} total dupes");
WriteLine($"{timer.Elapsed.TotalSeconds} seconds elapsed");
WriteLine("done");

string GetHash(byte[] buffer)
{
    var hash = _hasher.ComputeHash(buffer);
    var hashHex = string.Join(string.Empty, hash.Select(i => i.ToString("x2")));
    return hashHex;
}
