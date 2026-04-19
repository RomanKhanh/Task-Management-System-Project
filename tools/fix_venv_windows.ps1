# Requires PowerShell 5+
# Run from repository root after activating your venv:
#   .\venv\Scripts\Activate.ps1
#   powershell -ExecutionPolicy Bypass -File .\tools\fix_venv_windows.ps1

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$clipRepoUrl = "git+https://github.com/openai/CLIP.git"

function Write-Step {
    param([string]$Message)
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Invoke-Python {
    param([string[]]$Args)
    & python @Args
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed: python $($Args -join ' ')"
    }
}

try {
    $scriptPath = if ($PSCommandPath) { $PSCommandPath } else { $MyInvocation.MyCommand.Path }
    if (-not $scriptPath) {
        throw "Could not resolve script path. Run this file directly (not from an anonymous shell block)."
    }

    $repoRoot = Split-Path -Parent (Split-Path -Parent $scriptPath)
    Set-Location $repoRoot

    Write-Step "Validating active virtual environment"
    if (-not $env:VIRTUAL_ENV) {
        throw "No active virtual environment found. Activate your venv first (for example: .\venv\Scripts\Activate.ps1)."
    }

    $pythonCommand = Get-Command python -ErrorAction SilentlyContinue
    if (-not $pythonCommand) {
        throw "python was not found in PATH for the active shell. Activate your venv and retry."
    }

    $venvFromPython = (& python -c "import os, sys; print(os.path.abspath(sys.prefix))").Trim()
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to query python from the current environment. Ensure venv is activated and python is available."
    }

    $activeVenv = [System.IO.Path]::GetFullPath($env:VIRTUAL_ENV)
    if ($venvFromPython -ne $activeVenv) {
        throw "Active shell venv and python interpreter do not match.`nVIRTUAL_ENV: $activeVenv`nPython sys.prefix: $venvFromPython"
    }

    Write-Host "Using venv: $activeVenv" -ForegroundColor Green
    Write-Host "Using python: $((& python -c 'import sys; print(sys.executable)').Trim())" -ForegroundColor Green

    Write-Step "Repairing pip/setuptools toolchain in the venv"
    Invoke-Python -Args @("-m", "ensurepip", "--upgrade")
    Invoke-Python -Args @("-m", "pip", "install", "--upgrade", "pip")
    Invoke-Python -Args @("-m", "pip", "install", "--upgrade", "--force-reinstall", "setuptools", "wheel", "setuptools_scm", "build")

    Write-Step "Verifying pkg_resources import"
    Invoke-Python -Args @("-c", "import pkg_resources; print(pkg_resources.__file__)")

    Write-Step "Retrying CLIP install without build isolation"
    Invoke-Python -Args @("-m", "pip", "install", "--upgrade", "--force-reinstall", "--no-build-isolation", $clipRepoUrl)

    Write-Step "Checking Visual C++ Build Tools availability"
    $cl = Get-Command cl.exe -ErrorAction SilentlyContinue
    if (-not $cl) {
        Write-Warning "cl.exe (MSVC compiler) was not found in PATH."
        Write-Host "If build steps fail, install/update Microsoft C++ Build Tools:" -ForegroundColor Yellow
        Write-Host "  https://visualstudio.microsoft.com/visual-cpp-build-tools/"
        Write-Host "  https://learn.microsoft.com/cpp/build/building-on-the-command-line"
    }
    else {
        Write-Host "Detected compiler: $($cl.Source)" -ForegroundColor Green
    }

    Write-Host "`nRepair completed successfully. Re-run .\webui-user.bat or python launch.py." -ForegroundColor Green
}
catch {
    Write-Error $_.Exception.Message
    Write-Host ""
    Write-Host "If repair continues to fail, recreate the venv with Python 3.10.x:" -ForegroundColor Yellow
    Write-Host "  deactivate"
    Write-Host "  Remove-Item -Recurse -Force .\venv"
    Write-Host "  py -3.10 -m venv .\venv"
    Write-Host "  .\venv\Scripts\Activate.ps1"
    Write-Host "  python -m pip install --upgrade pip setuptools wheel"
    Write-Host "  .\webui-user.bat"
    exit 1
}
