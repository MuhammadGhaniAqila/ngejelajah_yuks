@echo off
title Jelajahin WebsiteOnly Launcher
echo [1/3] Menyalakan PostgreSQL 17 di D:\PostgreSQL...
"D:\PostgreSQL\pgsql\bin\pg_ctl.exe" -D "D:\PostgreSQL\data" -l "D:\PostgreSQL\pg.log" status >nul 2>&1
if errorlevel 1 (
    "D:\PostgreSQL\pgsql\bin\pg_ctl.exe" -D "D:\PostgreSQL\data" -l "D:\PostgreSQL\pg.log" start
) else (
    echo PostgreSQL sudah berjalan.
)

echo [2/3] Menyalakan Laravel API ^& Filament Admin di http://127.0.0.1:8000 ...
start "Jelajahin Laravel Backend" cmd /k "cd /d D:\PROJEK PSAS KIK,MK\websiteonly\backend && php artisan serve --host=127.0.0.1 --port=8000"

echo [3/3] Menyalakan Next.js Frontend di http://localhost:3000 ...
start "Jelajahin Next.js Frontend" cmd /k "cd /d D:\PROJEK PSAS KIK,MK\websiteonly\frontend && npm run dev"

echo.
echo Semua server Jelajahin dinyalakan!
echo - Landing Page       : http://localhost:3000/
echo - Beranda (Home)     : http://localhost:3000/home
echo - Panel Operator     : http://127.0.0.1:8000/admin
echo - REST API           : http://127.0.0.1:8000/api/wahana
pause
