#r "ref/Blake2Sharp.dll"
#load "Blake2Scripted.csx"


using System.Security.Cryptography;
using Blake2Sharp;

var hasher = Blake2Scripted.Create();
WriteLine(string.Join(string.Empty, hasher.ComputeHash(new byte[] { 1, 2, 3 }).Select(b => b.ToString("x2"))));
WriteLine(string.Join(string.Empty, hasher.ComputeHash(new byte[] { 1, 2, 3 }).Select(b => b.ToString("x2"))));