@echo off

REM file
REG ADD HKCU\Software\Classes\*\shell\pathcopy /d "Path Copy" /f
REG ADD HKCU\Software\Classes\*\shell\pathcopy /v Icon /d "%cd%\copyicon.ico" /f
REG ADD HKCU\Software\Classes\*\shell\pathcopy\command /d "%cd%\PathCopy.exe \"%%V\"" /f

REM directory
REG ADD HKCU\Software\Classes\Directory\shell\pathcopy /d "Path Copy" /f
REG ADD HKCU\Software\Classes\Directory\shell\pathcopy /v Icon /d "%cd%\copyicon.ico" /f
REG ADD HKCU\Software\Classes\Directory\shell\pathcopy\command /d "%cd%\PathCopy.exe \"%%V\"" /f

REM background folder
REG ADD HKCU\Software\Classes\Directory\Background\shell\pathcopy /d "Path Copy" /f
REG ADD HKCU\Software\Classes\Directory\Background\shell\pathcopy /v Icon /d "%cd%\copyicon.ico" /f
REG ADD HKCU\Software\Classes\Directory\Background\shell\pathcopy\command /d "%cd%\PathCopy.exe \"%%V" /f

REM drive
REG ADD HKCU\Software\Classes\Drive\shell\pathcopy /d "Path Copy" /f
REG ADD HKCU\Software\Classes\Drive\shell\pathcopy /v Icon /d "%cd%\copyicon.ico" /f
REG ADD HKCU\Software\Classes\Drive\shell\pathcopy\command /d "%cd%\PathCopy.exe \"%%V" /f
