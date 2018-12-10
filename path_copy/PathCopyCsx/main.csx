#! "net461" // required for omnisharp
#r "System" // required for dotnet-script
#load "Clippy.csx"
using System;
using System.IO;
using System.Runtime.CompilerServices;
using Microsoft.Win32;

private static string UNCPath(string path)
{
    if (path.StartsWith(@"\\")) return path;
    var key = Registry.CurrentUser.OpenSubKey("Network\\" + path[0]);
    if (key == null) return path;
    var remotePath = key.GetValue("RemotePath") as string;
    var extension = path.Remove(0, 2);
    return remotePath + extension;
}

try
{
    if (Args.Count < 1 || Args[0] == null || Args[0].Length < 2) return;

    var result = UNCPath(Args[0]);
    Clippy.PushStringToClipboard(result);
}
catch (Exception ex)
{
    var logFilePath = $"{GetScriptFolder()}\\debug.log";
    File.AppendAllText(logFilePath, $"{Args[0]}\r\n{ex.ToString()}");
}

public static string GetScriptPath([CallerFilePath] string path = null) => path;
public static string GetScriptFolder([CallerFilePath] string path = null) => Path.GetDirectoryName(path);
