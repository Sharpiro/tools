function get-path([string]$path) {
    if ($path.Length -lt 2 ) {
        return " "
    }
    if ($path.StartsWith("\\")) {
        return $path
    }
    $key = [Microsoft.Win32.Registry]::CurrentUser.OpenSubKey("network\" + $path[0])
    if ($null -eq $key) {return $path}
    $remotePath = $key.GetValue("remotepath")
    $extension = $path.Remove(0, 2);
    return $remotePath + $extension
}
