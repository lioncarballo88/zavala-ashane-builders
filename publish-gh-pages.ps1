# ============================================================
# Zavala Ashane Builders - publish to GitHub Pages
#
# Builds the public bundle and force-pushes it to the `gh-pages`
# branch, which GitHub Pages serves (Settings -> Pages ->
# Deploy from a branch -> gh-pages / root).
#
# Only the site files are published: docs, tooling, _source/,
# .htaccess and Netlify config stay on `main` unpublished.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\publish-gh-pages.ps1
#   powershell -ExecutionPolicy Bypass -File .\publish-gh-pages.ps1 -CustomDomain
#
# -CustomDomain publishes the CNAME file as well. Use it only once
# the domain's DNS already points at GitHub (see DEPLOY.md, Route D);
# publishing CNAME earlier makes the *.github.io URL redirect to a
# broken domain.
# ============================================================
param([switch]$CustomDomain)

$ErrorActionPreference = "Stop"

$proj   = Split-Path -Parent $MyInvocation.MyCommand.Path
$site   = Join-Path $proj "_site"
$remote = "https://github.com/lioncarballo88/zavala-ashane-builders.git"
$branch = "gh-pages"

$files = @(
    "index.html", "about.html", "our-impact.html",
    "3824-mystic-circle.html", "3814-treasure-island-drive.html",
    "robots.txt", "sitemap.xml", ".nojekyll"
)

if (Test-Path $site) { Remove-Item $site -Recurse -Force }
New-Item -ItemType Directory -Path $site | Out-Null

foreach ($f in $files) { Copy-Item (Join-Path $proj $f) (Join-Path $site $f) -Force }
Copy-Item (Join-Path $proj "assets") (Join-Path $site "assets") -Recurse -Force

# Friendly 404: GitHub Pages serves 404.html for unknown paths.
Copy-Item (Join-Path $proj "index.html") (Join-Path $site "404.html") -Force

if ($CustomDomain) {
    Copy-Item (Join-Path $proj "CNAME") (Join-Path $site "CNAME") -Force
}

$tmp = Join-Path $env:TEMP "zab-gh-pages"
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
New-Item -ItemType Directory -Path $tmp | Out-Null
Get-ChildItem $site -Force | ForEach-Object {
    Copy-Item $_.FullName (Join-Path $tmp $_.Name) -Recurse -Force
}

Push-Location $tmp
try {
    git init -q -b $branch
    git add -A
    git -c user.name="Cesar Zavala" -c user.email="lioncarballo@gmail.com" commit -q -m "Publish site"
    git remote add origin $remote
    git push --force origin $branch
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "Published. Pages rebuild takes ~1 minute:"
if ($CustomDomain) { Write-Host "  https://zavalaashanebuilders.com" }
Write-Host "  https://lioncarballo88.github.io/zavala-ashane-builders/"
