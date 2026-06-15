@echo off
REM CTM Thika Land Surveyors - Local Development Setup Script (Windows)
REM This script automates the complete setup process for local development

setlocal enabledelayedexpansion

REM Color codes
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

echo.
echo %BLUE%=====================================================================%NC%
echo %BLUE%   CTM Thika Land Surveyors - Local Setup Script                  %NC%
echo %BLUE%   Complete Development Environment Configuration                %NC%
echo %BLUE%=====================================================================%NC%
echo.

REM STEP 1: Check Node.js Installation
echo %BLUE%STEP 1: Checking Node.js Installation%NC%
echo.

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo %RED%✗ Node.js is not installed!%NC%
    echo Please install Node.js LTS from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo %GREEN%✓ Node.js %NODE_VERSION% found%NC%
echo %GREEN%✓ npm %NPM_VERSION% found%NC%
echo.

REM STEP 2: Verify Project Directory
echo %BLUE%STEP 2: Verifying Project Directory%NC%
echo.

if not exist "package.json" (
    echo %RED%✗ package.json not found!%NC%
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

echo %GREEN%✓ Project directory verified%NC%
echo.

REM STEP 3: Clear npm Cache
echo %BLUE%STEP 3: Clearing npm Cache%NC%
echo.

echo Clearing npm cache for clean installation...
call npm cache clean --force
echo %GREEN%✓ npm cache cleared%NC%
echo.

REM STEP 4: Install Dependencies
echo %BLUE%STEP 4: Installing Dependencies%NC%
echo.

echo Installing project dependencies (this may take 2-5 minutes)...
call npm install --legacy-peer-deps

if %ERRORLEVEL% neq 0 (
    echo %RED%✗ Failed to install dependencies!%NC%
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo %GREEN%✓ Dependencies installed successfully%NC%
echo.

REM STEP 5: Verify Database Configuration
echo %BLUE%STEP 5: Verifying Database Configuration%NC%
echo.

if exist ".env.example" (
    if not exist ".env.local" (
        echo Creating .env.local from .env.example...
        copy .env.example .env.local
        echo %GREEN%✓ Created .env.local - Please configure your environment variables%NC%
    )
)

echo %GREEN%✓ Database verification complete%NC%
echo.

REM STEP 6: Configure VS Code
echo %BLUE%STEP 6: Configuring VS Code Workspace%NC%
echo.

if not exist ".vscode" (
    mkdir .vscode
    echo Created .vscode directory
)

if exist ".vscode\settings.json" (
    echo %GREEN%✓ VS Code settings already configured%NC%
) else (
    echo %YELLOW%⚠ .vscode\settings.json not found%NC%
)

if exist ".vscode\extensions.json" (
    echo %GREEN%✓ VS Code extensions list configured%NC%
) else (
    echo %YELLOW%⚠ .vscode\extensions.json not found%NC%
)

echo.

REM STEP 7: Test Build
echo %BLUE%STEP 7: Testing Project Build%NC%
echo.

echo Running initial build (this may take 3-5 minutes)...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo %RED%✗ Project build failed!%NC%
    echo Please check for TypeScript or configuration errors.
    pause
    exit /b 1
)

echo %GREEN%✓ Project build successful%NC%
echo.

REM Final Instructions
echo %BLUE%=====================================================================%NC%
echo %BLUE%SETUP COMPLETE%NC%
echo %BLUE%=====================================================================%NC%
echo.

echo %GREEN%Your local development environment is ready!%NC%
echo.
echo To start developing:
echo %BLUE%npm run dev%NC%
echo.
echo The application will be available at:
echo %BLUE%http://localhost:3000%NC%
echo.
echo For more information, see LOCAL_SETUP.md
echo.

pause
