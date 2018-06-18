Write-Output "starting python interactive with seed script in '$PSScriptRoot'"
$profile = (Get-ChildItem Env:userprofile).value
$pipenvActivationScript = "${profile}/.virtualenvs/python-CTYFHKLi/Scripts/activate.ps1"
& $pipenvActivationScript
python -i $PSScriptRoot/main.py