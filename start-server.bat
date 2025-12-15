@echo off
REM Change to the directory where this batch file is located
cd /d "%~dp0"
echo ========================================
echo   Prestige Motors Server
echo ========================================
echo.
echo Current directory: %CD%
echo.
if not exist "server.js" (
    echo ERROR: server.js not found in current directory!
    echo Please make sure you're running this from the project folder.
    echo Expected location: C:\Users\Rishabh Thakur\Documents\Buisness
    pause
    exit /b 1
)
echo Starting server...
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
node server.js
pause

