@echo off
title Actualizar y Publicar Portfolio en GitHub
cd /d "%~dp0"

echo ========================================================
echo   PUBLICADOR AUTOMATICO A GITHUB - KEVIN MARTINEZ
echo ========================================================
echo.

set /p msg="Ingresa una descripcion del cambio (presiona Enter para 'Actualizar portfolio'): "
if "%msg%"=="" set msg=Actualizar portfolio

echo.
echo [1/4] Guardando cambios en Git (rama main)...
git add -A
git commit -m "%msg%"
git push origin main

echo.
echo [2/4] Compilando version de produccion con Vite...
call npm.cmd run build

echo.
echo [3/4] Desplegando a GitHub Pages (rama gh-pages)...
cd dist
echo. > .nojekyll
copy ..\favicon.svg .\favicon.svg >nul 2>&1
git init >nul 2>&1
git checkout -b gh-pages >nul 2>&1
git add -A >nul 2>&1
git commit -m "Publicacion: %msg%" >nul 2>&1
git remote add origin https://github.com/Walthier/PortFolio.git >nul 2>&1
git push -u origin gh-pages --force
cd ..

echo.
echo [4/4] Limpiando carpeta temporal dist...
rmdir /s /q dist

echo.
echo ========================================================
echo   EXITO: Tu portfolio esta actualizado en GitHub y en vivo!
echo   Web en vivo: https://walthier.github.io/PortFolio/
echo   Repositorio: https://github.com/Walthier/PortFolio
echo ========================================================
echo.
pause
