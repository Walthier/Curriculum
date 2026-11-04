@echo off
title Servidor Portfolio - Kevin Martinez
cd /d "%~dp0"
echo Iniciando servidor Vite del Portfolio en el navegador...
call npm.cmd run dev -- --open
pause
