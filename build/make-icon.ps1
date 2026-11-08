Add-Type -AssemblyName System.Drawing

$sourcePath = Join-Path $PSScriptRoot '..\public\icon-512.png'
$outputPath = Join-Path $PSScriptRoot 'icon.ico'
$sizes = @(16, 24, 32, 48, 64, 128, 256)

$source = [System.Drawing.Image]::FromFile((Resolve-Path $sourcePath))
$images = New-Object System.Collections.ArrayList

foreach ($size in $sizes) {
  $bitmap = New-Object System.Drawing.Bitmap($size, $size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.DrawImage($source, 0, 0, $size, $size)
  $stream = New-Object System.IO.MemoryStream
  $bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
  [void]$images.Add(@{ Size = $size; Bytes = $stream.ToArray() })
  $stream.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

$source.Dispose()

$output = New-Object System.IO.MemoryStream
$writer = New-Object System.IO.BinaryWriter($output)
$writer.Write([UInt16]0)
$writer.Write([UInt16]1)
$writer.Write([UInt16]$images.Count)

$offset = 6 + (16 * $images.Count)
foreach ($image in $images) {
  $size = $image.Size
  if ($size -ge 256) { $dimension = 0 } else { $dimension = $size }
  $writer.Write([byte]$dimension)
  $writer.Write([byte]$dimension)
  $writer.Write([byte]0)
  $writer.Write([byte]0)
  $writer.Write([UInt16]1)
  $writer.Write([UInt16]32)
  $writer.Write([UInt32]$image.Bytes.Length)
  $writer.Write([UInt32]$offset)
  $offset += $image.Bytes.Length
}

foreach ($image in $images) {
  $writer.Write($image.Bytes)
}

$writer.Flush()
[System.IO.File]::WriteAllBytes($outputPath, $output.ToArray())
$writer.Dispose()
$output.Dispose()

Get-Item $outputPath | Select-Object FullName, Length
