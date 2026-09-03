# เรนเดอร์รูปพรีวิวตอนแชร์ลิงก์ (Open Graph) เป็นไฟล์ PNG นิ่ง
#
# ทำไมไม่สร้างตอน request ด้วย ImageResponse:
# satori ที่อยู่เบื้องหลังต้องโหลดฟอนต์เองและรองรับ CSS ไม่ครบ
# ถ้าเรนเดอร์ไม่ได้จะพังเงียบๆ กลายเป็นไม่มีรูปพรีวิวเลย
# ไฟล์นิ่งตรวจสอบด้วยตาได้ก่อน deploy จึงชัวร์กว่าสำหรับรูปที่ไม่เคยเปลี่ยน
#
# รัน: powershell -File docs/icon-preview/render-og.ps1

Add-Type -AssemblyName System.Drawing

$repoRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$outPath = Join-Path $repoRoot 'public\og.png'

function Get-Color { param([string]$hex) [System.Drawing.ColorTranslator]::FromHtml($hex) }

# หาฟอนต์ที่รองรับภาษาไทย ถ้าไม่เจอตัวแรกก็ไล่ตัวถัดไป
function Get-ThaiFontFamily {
    $installed = (New-Object System.Drawing.Text.InstalledFontCollection).Families | ForEach-Object { $_.Name }
    foreach ($name in @('Leelawadee UI', 'Leelawadee', 'Tahoma', 'Microsoft Sans Serif')) {
        if ($installed -contains $name) { return $name }
    }
    return 'Arial'
}

$fontName = Get-ThaiFontFamily
Write-Output "using font: $fontName"

$W = 1200
$H = 630

$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# พื้นหลัง
$bg = New-Object System.Drawing.SolidBrush((Get-Color '#FFF6F0'))
$g.FillRectangle($bg, 0, 0, $W, $H)
$bg.Dispose()

# ---------- ลูกแก้ว ----------
$bx = 96.0
$by = 125.0
$bs = 380.0

$glass = Get-Color '#BA8DE0'

$b = New-Object System.Drawing.SolidBrush($glass)
$g.FillEllipse($b, $bx + $bs * 0.12, $by + $bs * 0.09, $bs * 0.76, $bs * 0.76)
$b.Dispose()

# แถบไฮไลต์
$hlPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$hlPath.AddEllipse($bx + $bs * 0.20, $by + $bs * 0.20, $bs * 0.20, $bs * 0.32)
$m = New-Object System.Drawing.Drawing2D.Matrix
$m.RotateAt(-30, (New-Object System.Drawing.PointF(($bx + $bs * 0.30), ($by + $bs * 0.36))))
$hlPath.Transform($m)
$hl = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(87, 255, 255, 255))
$g.FillPath($hl, $hlPath)
$hl.Dispose(); $hlPath.Dispose()

# จันทร์เสี้ยว
$white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.FillEllipse($white, $bx + $bs * 0.30, $by + $bs * 0.26, $bs * 0.36, $bs * 0.36)
$white.Dispose()

$b = New-Object System.Drawing.SolidBrush($glass)
$g.FillEllipse($b, $bx + $bs * 0.40, $by + $bs * 0.22, $bs * 0.34, $bs * 0.34)
$b.Dispose()

# จุดดาวในลูกแก้ว
$dot = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
foreach ($d in @(@(0.24, 0.56), @(0.64, 0.30), @(0.57, 0.66), @(0.34, 0.21))) {
    $g.FillEllipse($dot, $bx + $bs * $d[0], $by + $bs * $d[1], $bs * 0.034, $bs * 0.034)
}
$dot.Dispose()

# ฐาน
$navy = New-Object System.Drawing.SolidBrush((Get-Color '#2E3566'))
$basePath = New-Object System.Drawing.Drawing2D.GraphicsPath
$baseX = $bx + $bs * 0.25
$baseY = $by + $bs * 0.78
$baseW = $bs * 0.50
$baseH = $bs * 0.16
$basePath.AddArc($baseX, $baseY, $baseH, $baseH, 90, 180)
$basePath.AddArc($baseX + $baseW - $baseH, $baseY, $baseH, $baseH, 270, 180)
$basePath.CloseFigure()
$g.FillPath($navy, $basePath)
$navy.Dispose(); $basePath.Dispose()

$shine = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(71, 255, 255, 255))
$g.FillEllipse($shine, $bx + $bs * 0.33, $by + $bs * 0.875, $bs * 0.20, $bs * 0.032)
$shine.Dispose()

# ---------- ประกายรอบลูกแก้ว ----------
function Fill-Diamond {
    param([System.Drawing.Graphics]$g, [System.Drawing.Brush]$brush,
          [single]$cx, [single]$cy, [single]$size, [single]$radius)

    $half = $size / 2
    $d = [Math]::Max($radius * 2, 0.1)
    $p = New-Object System.Drawing.Drawing2D.GraphicsPath
    $p.AddArc($cx - $half, $cy - $half, $d, $d, 180, 90)
    $p.AddArc($cx + $half - $d, $cy - $half, $d, $d, 270, 90)
    $p.AddArc($cx + $half - $d, $cy + $half - $d, $d, $d, 0, 90)
    $p.AddArc($cx - $half, $cy + $half - $d, $d, $d, 90, 90)
    $p.CloseFigure()
    $m = New-Object System.Drawing.Drawing2D.Matrix
    $m.RotateAt(45, (New-Object System.Drawing.PointF($cx, $cy)))
    $p.Transform($m)
    $g.FillPath($brush, $p)
    $p.Dispose()
}

$orange = New-Object System.Drawing.SolidBrush((Get-Color '#F2612C'))
Fill-Diamond -g $g -brush $orange -cx ($bx + $bs * 0.105) -cy ($by + $bs * 0.195) -size ($bs * 0.13) -radius ($bs * 0.023)
$orange.Dispose()

$pink = New-Object System.Drawing.SolidBrush((Get-Color '#F0367A'))
Fill-Diamond -g $g -brush $pink -cx ($bx + $bs * 0.905) -cy ($by + $bs * 0.735) -size ($bs * 0.11) -radius ($bs * 0.02)
$pink.Dispose()

# ---------- ข้อความ ----------
$textX = 570

$ink = New-Object System.Drawing.SolidBrush((Get-Color '#4A3B52'))
$inkSoft = New-Object System.Drawing.SolidBrush((Get-Color '#8D7F97'))

$titleFont = New-Object System.Drawing.Font($fontName, 66, [System.Drawing.FontStyle]::Bold)
$subFont = New-Object System.Drawing.Font($fontName, 30)
$featFont = New-Object System.Drawing.Font($fontName, 19)

$g.DrawString('มูทูเดย์', $titleFont, $ink, $textX, 178)
$g.DrawString('ดูดวงประจำวัน', $subFont, $ink, ($textX + 6), 292)

# เส้นคั่นไล่สีเดียวกับปุ่มในเว็บ
$barRect = New-Object System.Drawing.RectangleF(($textX + 8), 356, 220, 9)
$bar = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $barRect, (Get-Color '#FF9EC4'), (Get-Color '#A98FEE'), 0.0)
$barPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$barPath.AddArc($barRect.X, $barRect.Y, 9, 9, 90, 180)
$barPath.AddArc($barRect.X + 211, $barRect.Y, 9, 9, 270, 180)
$barPath.CloseFigure()
$g.FillPath($bar, $barPath)
$bar.Dispose(); $barPath.Dispose()

$g.DrawString('สีมงคล · ราศี · ดวงจีน · สมพงศ์', $featFont, $inkSoft, ($textX + 6), 396)
$g.DrawString('เซียมซี · ไพ่ทาโรต์ · ไพ่พรหมญาณ', $featFont, $inkSoft, ($textX + 6), 432)

$titleFont.Dispose(); $subFont.Dispose(); $featFont.Dispose()
$ink.Dispose(); $inkSoft.Dispose()
$g.Dispose()

$publicDir = Split-Path $outPath -Parent
if (-not (Test-Path $publicDir)) { New-Item -ItemType Directory -Force $publicDir | Out-Null }

$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "saved $outPath"
