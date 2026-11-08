Add-Type -AssemblyName System.Drawing

# Génère les icônes et écrans de démarrage Android à partir des visuels web.
# Usage : powershell -ExecutionPolicy Bypass -File build/make-android-assets.ps1

$root = Split-Path $PSScriptRoot -Parent
$iconPath = Join-Path $root 'public\icon-512.png'
$maskablePath = Join-Path $root 'public\maskable-512.png'
$resRoot = Join-Path $root 'android\app\src\main\res'

if (-not (Test-Path $resRoot)) {
  throw "Projet Android introuvable : lance d'abord npx cap add android."
}

$icon = [System.Drawing.Image]::FromFile((Resolve-Path $iconPath))
$maskable = [System.Drawing.Image]::FromFile((Resolve-Path $maskablePath))

function Save-ResizedImage {
  param(
    [System.Drawing.Image]$Image,
    [int]$Width,
    [int]$Height,
    [string]$Path,
    [switch]$Round
  )

  $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.Clear([System.Drawing.Color]::Transparent)

  if ($Round) {
    $clipPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $clipPath.AddEllipse(0, 0, $Width, $Height)
    $graphics.SetClip($clipPath)
    $clipPath.Dispose()
  }

  $graphics.DrawImage($Image, 0, 0, $Width, $Height)
  $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
}

# Icône classique (API 24-25) et icône ronde.
$legacySizes = @{
  'mipmap-mdpi' = 48
  'mipmap-hdpi' = 72
  'mipmap-xhdpi' = 96
  'mipmap-xxhdpi' = 144
  'mipmap-xxxhdpi' = 192
}

# Calque avant des icônes adaptatives (API 26+), 108 dp.
$foregroundSizes = @{
  'mipmap-mdpi' = 108
  'mipmap-hdpi' = 162
  'mipmap-xhdpi' = 216
  'mipmap-xxhdpi' = 324
  'mipmap-xxxhdpi' = 432
}

foreach ($entry in $legacySizes.GetEnumerator()) {
  $dir = Join-Path $resRoot $entry.Key
  Save-ResizedImage -Image $maskable -Width $entry.Value -Height $entry.Value -Path (Join-Path $dir 'ic_launcher.png')
  Save-ResizedImage -Image $maskable -Width $entry.Value -Height $entry.Value -Path (Join-Path $dir 'ic_launcher_round.png') -Round
}

foreach ($entry in $foregroundSizes.GetEnumerator()) {
  $dir = Join-Path $resRoot $entry.Key
  Save-ResizedImage -Image $maskable -Width $entry.Value -Height $entry.Value -Path (Join-Path $dir 'ic_launcher_foreground.png')
}

# Écrans de démarrage : dégradé de marque + « V » blanc, aux dimensions d'origine.
$brandStart = [System.Drawing.Color]::FromArgb(99, 102, 241)
$brandEnd = [System.Drawing.Color]::FromArgb(67, 56, 202)
$white = [System.Drawing.Color]::White

Get-ChildItem $resRoot -Recurse -Filter 'splash.png' | ForEach-Object {
  $old = [System.Drawing.Image]::FromFile($_.FullName)
  $width = $old.Width
  $height = $old.Height
  $old.Dispose()

  $bitmap = New-Object System.Drawing.Bitmap($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  $rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $brandStart, $brandEnd, 45.0)
  $graphics.FillRectangle($brush, $rect)

  $mark = [Math]::Min($width, $height) * 0.32
  $penWidth = $mark * (7.5 / 64.0)
  $pen = New-Object System.Drawing.Pen($white, $penWidth)
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

  $left = ($width - $mark) / 2.0
  $top = ($height - $mark) / 2.0
  $points = @(
    (New-Object System.Drawing.PointF(($left + $mark * 18 / 64), ($top + $mark * 19 / 64))),
    (New-Object System.Drawing.PointF(($left + $mark * 32 / 64), ($top + $mark * 46 / 64))),
    (New-Object System.Drawing.PointF(($left + $mark * 46 / 64), ($top + $mark * 19 / 64)))
  )
  $graphics.DrawLines($pen, $points)

  $bitmap.Save($_.FullName, [System.Drawing.Imaging.ImageFormat]::Png)
  $pen.Dispose()
  $brush.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

$icon.Dispose()
$maskable.Dispose()

Write-Output "Icônes et écrans de démarrage Android générés dans android/app/src/main/res."
