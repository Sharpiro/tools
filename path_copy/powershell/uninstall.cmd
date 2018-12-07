@echo off

REM file
REG DELETE HKEY_CURRENT_USER\Software\Classes\*\shell\pathcopy /f

REM REM directory
REM REG DELETE HKEY_CURRENT_USER\Software\Classes\Directory\shell\pathcopy /f

REM REM background folder
REM REG DELETE ADD HKEY_CURRENT_USER\Software\Classes\Directory\Background\shell\pathcopy /f

rmdir "%userprofile%\pathcopy" /Q /S

