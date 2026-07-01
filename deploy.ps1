# deploy.ps1 — bump version, bundle, package, commit, push
# Usage: .\deploy.ps1 "optional commit message"

param([string]$Message = "Deploy")

$configPath = "$PSScriptRoot\config\package-solution.json"
$config = Get-Content $configPath -Raw | ConvertFrom-Json

$ver = $config.solution.version
$parts = $ver -split '\.'
$parts[2] = [string]([int]$parts[2] + 1)
$newVer = $parts -join '.'

Write-Host "Bumping version $ver -> $newVer" -ForegroundColor Cyan

$raw = Get-Content $configPath -Raw
$raw = $raw -replace [regex]::Escape($ver), $newVer
Set-Content $configPath $raw -Encoding utf8

# Sync VERSION constant in TimBitApp.tsx so the badge always matches
$appPath = "$PSScriptRoot\src\webparts\timBit\components\TimBitApp.tsx"
$appRaw = Get-Content $appPath -Raw
$appRaw = $appRaw -replace "(?m)^const VERSION = '[^']*';", "const VERSION = '$newVer';"
Set-Content $appPath $appRaw -Encoding utf8

$gulp = "$PSScriptRoot\node_modules\.bin\gulp.cmd"

Write-Host "Bundling..." -ForegroundColor Cyan
& $gulp bundle --ship
if ($LASTEXITCODE -ne 0) { Write-Host "Bundle failed — aborting." -ForegroundColor Red; exit 1 }

Write-Host "Packaging..." -ForegroundColor Cyan
& $gulp package-solution --ship
if ($LASTEXITCODE -ne 0) { Write-Host "Package failed — aborting." -ForegroundColor Red; exit 1 }

Write-Host "Committing and pushing..." -ForegroundColor Cyan
git add -A
git commit -m "$Message (v$newVer)"
git push

Write-Host ""
Write-Host "Done. Upload sharepoint/solution/timbit-spfx.sppkg to the App Catalog." -ForegroundColor Green
Write-Host "Then: Ctrl+Shift+Delete -> Clear cache -> Ctrl+Shift+R" -ForegroundColor Green
