@echo off

xcopy "." "%userprofile%\pathcopy\" /Y

REM file
REG ADD HKEY_CURRENT_USER\Software\Classes\*\shell\pathcopy /d "Copy Path" /f
REG ADD HKEY_CURRENT_USER\Software\Classes\*\shell\pathcopy /v Icon /d "%userprofile%\pathcopy\icon.ico" /f
REG ADD HKEY_CURRENT_USER\Software\Classes\*\shell\pathcopy\command /d "powershell %userprofile%\pathcopy\run-get-path.ps1 \"%%V\"" /f

REM REM directory
REM REG ADD HKEY_CURRENT_USER\Software\Classes\Directory\shell\pathcopy /d "Copy Path" /f
REM REG ADD HKEY_CURRENT_USER\Software\Classes\Directory\shell\pathcopy /v Icon /d "%userprofile%\pathcopy\icon.ico" /f
REM REG ADD HKEY_CURRENT_USER\Software\Classes\Directory\shell\pathcopy\command /d "%userprofile%\pathcopy\PathCopy.exe \"%%V\"" /f

REM REM background folder
REM REG ADD HKEY_CURRENT_USER\Software\Classes\Directory\Background\shell\pathcopy /d "Copy Path" /f
REM REG ADD HKEY_CURRENT_USER\Software\Classes\Directory\Background\shell\pathcopy /v Icon /d "%userprofile%\pathcopy\icon.ico" /f
REM REG ADD HKEY_CURRENT_USER\Software\Classes\Directory\Background\shell\pathcopy\command /d "%userprofile%\pathcopy\PathCopy.exe \"%%V" /f
