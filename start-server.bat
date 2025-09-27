@echo off
echo Starting server...
cd /d %~dp0public
npx http-server -p 3000 -c-1
pause
