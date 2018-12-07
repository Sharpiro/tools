@echo off

xcopy ".\PathCopy.exe" "%userprofile%\pathcopy\" /Y
xcopy ".\icon.ico" "%userprofile%\pathcopy\" /Y

REM file
REG ADD HKCU\Software\Classes\*\shell\pathcopy /d "Copy Path" /f
REG ADD HKCU\Software\Classes\*\shell\pathcopy /v Icon /d "%userprofile%\pathcopy\icon.ico" /f
REG ADD HKCU\Software\Classes\*\shell\pathcopy\command /d "%userprofile%\pathcopy\PathCopy.exe \"%%V\"" /f

REM directory
REG ADD HKCU\Software\Classes\Directory\shell\pathcopy /d "Copy Path" /f
REG ADD HKCU\Software\Classes\Directory\shell\pathcopy /v Icon /d "%userprofile%\pathcopy\icon.ico" /f
REG ADD HKCU\Software\Classes\Directory\shell\pathcopy\command /d "%userprofile%\pathcopy\PathCopy.exe \"%%V\"" /f

REM background folder
REG ADD HKCU\Software\Classes\Directory\Background\shell\pathcopy /d "Copy Path" /f
REG ADD HKCU\Software\Classes\Directory\Background\shell\pathcopy /v Icon /d "%userprofile%\pathcopy\icon.ico" /f
REG ADD HKCU\Software\Classes\Directory\Background\shell\pathcopy\command /d "%userprofile%\pathcopy\PathCopy.exe \"%%V" /f

REM drive
REG ADD HKCU\Software\Classes\Drive\shell\pathcopy /d "Copy Path" /f
REG ADD HKCU\Software\Classes\Drive\shell\pathcopy /v Icon /d "%userprofile%\pathcopy\icon.ico" /f
REG ADD HKCU\Software\Classes\Drive\shell\pathcopy\command /d "%userprofile%\pathcopy\PathCopy.exe \"%%V" /f
