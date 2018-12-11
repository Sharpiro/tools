param([string] $name, $version, [string] $outDir)

write-output "name: $name"
write-output "version: $version"
write-output "bin: $outDir"
$res = mkdir "$outDir\publish" -force
rm -force -path "$outDir\*.pdb"
rm -force -path "$outDir\publish\*"
compress-archive -force -path "$outDir\*" -destinationpath "$outDir\publish\$name-$version.zip"
Get-FileHash "$outDir\publish\$name-$version.zip" | Format-List | Out-File "$outDir\publish\$name-$version.hash"
