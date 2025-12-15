# Prestige Motors Server Startup Script
Set-Location -Path $PSScriptRoot
Write-Host "Starting Prestige Motors Server..." -ForegroundColor Green
Write-Host ""
node server.js

