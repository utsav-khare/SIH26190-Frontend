@echo off
cd /d "%~dp0"
start "Digilegal Vault Dev Server" cmd /k "npm run dev > dev_log.txt 2>&1"