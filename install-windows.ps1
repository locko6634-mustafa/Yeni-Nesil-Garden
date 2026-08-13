$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "Yesil Nesil The Garden - kurulum basliyor" -ForegroundColor Green
Write-Host ""

function Get-NodeVersion {
  $versionText = node -v
  $parts = $versionText.TrimStart("v").Split(".")
  return [pscustomobject]@{
    Text = $versionText
    Major = [int]$parts[0]
    Minor = [int]$parts[1]
    Patch = [int]$parts[2]
  }
}

try {
  $nodeVersion = Get-NodeVersion
} catch {
  Write-Host "Node.js bulunamadi." -ForegroundColor Red
  Write-Host "Lutfen Node.js 22.13.0 veya uzeri kurun: https://nodejs.org/"
  exit 1
}

if (
  $nodeVersion.Major -lt 22 -or
  ($nodeVersion.Major -eq 22 -and $nodeVersion.Minor -lt 13)
) {
  Write-Host "Node.js surumu eski. Gerekli surum: 22.13.0 veya uzeri." -ForegroundColor Red
  Write-Host "Mevcut surum: $($nodeVersion.Text)"
  exit 1
}

Write-Host "Node.js bulundu: $($nodeVersion.Text)" -ForegroundColor Green

try {
  pnpm -v | Out-Null
} catch {
  Write-Host "pnpm bulunamadi. Corepack ile aktif ediliyor..." -ForegroundColor Yellow
  corepack enable
  corepack prepare pnpm@latest --activate
}

Write-Host "Bagimliliklar kuruluyor..." -ForegroundColor Cyan
pnpm install

Write-Host "Build kontrolu yapiliyor..." -ForegroundColor Cyan
pnpm run build

Write-Host ""
Write-Host "Kurulum tamamlandi." -ForegroundColor Green
Write-Host "Siteyi lokal acmak icin bu klasorde calistirin:"
Write-Host "pnpm run dev" -ForegroundColor Cyan
Write-Host ""
