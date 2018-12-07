param (
    [string]$path
)

# $temp = "$((Get-ChildItem env:userprofile).Value)\get-path.ps1"
Import-module "$psscriptroot\get-path.ps1"

Write-Output "input: $path"
$fullPath = get-path -path $path
Set-Clipboard $fullPath
Write-Output "output: $fullPath"

