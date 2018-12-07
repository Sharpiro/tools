@echo off

REM file
REG DELETE HKCU\Software\Classes\*\shell\pathcopy /f

REM directory
REG DELETE HKCU\Software\Classes\Directory\shell\pathcopy /f

REM background folder
REG DELETE HKCU\Software\Classes\Directory\Background\shell\pathcopy /f

REG DELETE HKCU\Software\Classes\Drive\shell\pathcopy /f

rmdir "%userprofile%\pathcopy" /Q /S
