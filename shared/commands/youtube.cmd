@echo off
set startDir=%cd%
cd %~dp0..\..\youtube_downloader
FOR /F "delims=" %%i IN ('pipenv --venv') DO set virtualEnv=%%i
cd %startDir%
set activatePath=%virtualEnv%/Scripts/activate.bat
call %activatePath%
python %~dp0..\..\youtube_downloader/main.py %*
