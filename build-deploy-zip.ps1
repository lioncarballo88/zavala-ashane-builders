# ============================================================
# Zavala Ashane Builders - deploy ZIP builder
# Creates a clean ZIP for upload to GoDaddy (cPanel public_html).
# Excludes: _source/ (client originals), .git/, docs, tooling, Netlify config.
#
# Usage:  powershell -ExecutionPolicy Bypass -File .\build-deploy-zip.ps1
# ============================================================
$ErrorActionPreference = "Stop"

$proj = Split-Path -Parent $MyInvocation.MyCommand.Path
$out  = Join-Path $proj "zavala-ashane-deploy.zip"

$excludeNames = @("_source", ".git", "README.md", "DEPLOY.md", "PENDIENTES.md", "build-deploy-zip.ps1", "netlify.toml", ".gitignore")

$items = Get-ChildItem -Path $proj -Force | Where-Object {
    $excludeNames -notcontains $_.Name -and $_.Extension -ne ".zip"
}

if (Test-Path $out) { Remove-Item $out -Force }

# Build the ZIP with the .NET API so entry names always use forward slashes.
# NOTE: Compress-Archive on Windows PowerShell 5.1 writes backslashes in
# entry names, which breaks extraction on Netlify/cPanel. Do not use it here.
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($out, [System.IO.Compression.ZipArchiveMode]::Create)
foreach ($item in $items) {
    if ($item.PSIsContainer) {
        $files = Get-ChildItem -Path $item.FullName -Recurse -File -Force
        foreach ($f in $files) {
            $rel = $f.FullName.Substring($proj.Length + 1).Replace('\', '/')
            [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $f.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal)
        }
    } else {
        [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $item.FullName, $item.Name, [System.IO.Compression.CompressionLevel]::Optimal)
    }
}
$zip.Dispose()

$kb = [math]::Round((Get-Item $out).Length / 1KB, 1)
Write-Host ""
Write-Host "Deploy ZIP created: $out ($kb KB)"
Write-Host ""
Write-Host "Contents:"
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($out)
$zip.Entries | ForEach-Object { Write-Host ("  " + $_.FullName) }
$zip.Dispose()
Write-Host ""
Write-Host "Next: upload this ZIP to public_html in cPanel File Manager and extract it (see DEPLOY.md)."
