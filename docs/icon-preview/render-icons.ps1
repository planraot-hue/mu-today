# เรนเดอร์ไอคอนเป็นไฟล์ PNG จริง ด้วย GDI+ ของ .NET
#
# สคริปต์นี้ทำสำเนาค่าสีและสัดส่วนจาก src/lib/app-icon.tsx ไว้เอง
# ถ้าแก้ลายในไฟล์นั้น ต้องแก้ในนี้ให้ตรงกันด้วย ไม่งั้นตัวอย่างจะไม่ตรงกับของจริง
#
# รัน: powershell -File docs/icon-preview/render-icons.ps1

Add-Type -AssemblyName System.Drawing

$outDir = $PSScriptRoot
$smooth = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

function Get-Color { param([string]$hex) [System.Drawing.ColorTranslator]::FromHtml($hex) }

function New-RoundedDiamondPath {
    param([single]$cx, [single]$cy, [single]$size, [single]$radius)

    # สี่เหลี่ยมมุมมนหมุน 45 องศา กลายเป็นข้าวหลามตัดมุมมน
    $half = $size / 2
    $left = $cx - $half
    $top = $cy - $half
    $d = [Math]::Max($radius * 2, 0.1)

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc($left, $top, $d, $d, 180, 90)
    $path.AddArc($left + $size - $d, $top, $d, $d, 270, 90)
    $path.AddArc($left + $size - $d, $top + $size - $d, $d, $d, 0, 90)
    $path.AddArc($left, $top + $size - $d, $d, $d, 90, 90)
    $path.CloseFigure()

    $matrix = New-Object System.Drawing.Drawing2D.Matrix
    $matrix.RotateAt(45, (New-Object System.Drawing.PointF($cx, $cy)))
    $path.Transform($matrix)

    return $path
}

function Fill-RotatedCapsule {
    param(
        [System.Drawing.Graphics]$g,
        [System.Drawing.Brush]$brush,
        [single]$cx, [single]$cy,
        [single]$w, [single]$h,
        [single]$angle
    )

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $w
    $path.AddArc($cx - $w / 2, $cy - $h / 2, $d, $d, 180, 180)
    $path.AddArc($cx - $w / 2, $cy + $h / 2 - $d, $d, $d, 0, 180)
    $path.CloseFigure()

    $matrix = New-Object System.Drawing.Drawing2D.Matrix
    $matrix.RotateAt($angle, (New-Object System.Drawing.PointF($cx, $cy)))
    $path.Transform($matrix)

    $g.FillPath($brush, $path)
    $path.Dispose()
}

function Fill-RotatedEllipse {
    param(
        [System.Drawing.Graphics]$g,
        [System.Drawing.Brush]$brush,
        [single]$cx, [single]$cy,
        [single]$w, [single]$h,
        [single]$angle
    )

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse($cx - $w / 2, $cy - $h / 2, $w, $h)

    $matrix = New-Object System.Drawing.Drawing2D.Matrix
    $matrix.RotateAt($angle, (New-Object System.Drawing.PointF($cx, $cy)))
    $path.Transform($matrix)

    $g.FillPath($brush, $path)
    $path.Dispose()
}

# ---------- ลายลูกแก้วมีจันทร์เสี้ยว ----------
function Draw-Crystal {
    param(
        [System.Drawing.Graphics]$g,
        [single]$x, [single]$y, [single]$s,
        [bool]$detail
    )

    $cream = Get-Color '#FFF6F0'
    $glass = Get-Color '#BA8DE0'

    $b = New-Object System.Drawing.SolidBrush($cream)
    $g.FillRectangle($b, $x, $y, $s, $s)
    $b.Dispose()

    if ($detail) {
        $ball = @{ l = 0.12; t = 0.09; sz = 0.76 }
        $disc = @{ l = 0.30; t = 0.26; sz = 0.36 }
        $bite = @{ l = 0.40; t = 0.22; sz = 0.34 }
        $hl = @{ l = 0.20; t = 0.20; w = 0.20; h = 0.32 }
    }
    else {
        $ball = @{ l = 0.08; t = 0.08; sz = 0.84 }
        $disc = @{ l = 0.25; t = 0.23; sz = 0.44 }
        $bite = @{ l = 0.40; t = 0.17; sz = 0.40 }
        $hl = @{ l = 0.18; t = 0.20; w = 0.18; h = 0.30 }
    }

    # ลูกแก้ว
    $b = New-Object System.Drawing.SolidBrush($glass)
    $g.FillEllipse($b, $x + $s * $ball.l, $y + $s * $ball.t, $s * $ball.sz, $s * $ball.sz)
    $b.Dispose()

    # แถบไฮไลต์
    $hlBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(87, 255, 255, 255))
    Fill-RotatedEllipse -g $g -brush $hlBrush `
        -cx ($x + $s * ($hl.l + $hl.w / 2)) -cy ($y + $s * ($hl.t + $hl.h / 2)) `
        -w ($s * $hl.w) -h ($s * $hl.h) -angle -30
    $hlBrush.Dispose()

    # จันทร์เสี้ยว
    $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillEllipse($white, $x + $s * $disc.l, $y + $s * $disc.t, $s * $disc.sz, $s * $disc.sz)
    $white.Dispose()

    $b = New-Object System.Drawing.SolidBrush($glass)
    $g.FillEllipse($b, $x + $s * $bite.l, $y + $s * $bite.t, $s * $bite.sz, $s * $bite.sz)
    $b.Dispose()

    if (-not $detail) { return }

    # จุดดาวในลูกแก้ว
    $dot = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    foreach ($d in @(@(0.24, 0.56), @(0.64, 0.30), @(0.57, 0.66), @(0.34, 0.21))) {
        $g.FillEllipse($dot, $x + $s * $d[0], $y + $s * $d[1], $s * 0.034, $s * 0.034)
    }
    $dot.Dispose()

    # ฐาน
    $navy = New-Object System.Drawing.SolidBrush((Get-Color '#2E3566'))
    Fill-RotatedCapsule -g $g -brush $navy `
        -cx ($x + $s * 0.50) -cy ($y + $s * 0.86) -w ($s * 0.16) -h ($s * 0.50) -angle 90
    $navy.Dispose()

    $shine = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(71, 255, 255, 255))
    Fill-RotatedCapsule -g $g -brush $shine `
        -cx ($x + $s * 0.43) -cy ($y + $s * 0.893) -w ($s * 0.026) -h ($s * 0.20) -angle 90
    $shine.Dispose()

    # ประกายสี่แฉก
    $orange = New-Object System.Drawing.SolidBrush((Get-Color '#F2612C'))
    $p = New-RoundedDiamondPath -cx ($x + $s * 0.105) -cy ($y + $s * 0.195) -size ($s * 0.13) -radius ($s * 0.13 * 0.18)
    $g.FillPath($orange, $p); $p.Dispose(); $orange.Dispose()

    $pink = New-Object System.Drawing.SolidBrush((Get-Color '#F0367A'))
    $p = New-RoundedDiamondPath -cx ($x + $s * 0.905) -cy ($y + $s * 0.735) -size ($s * 0.11) -radius ($s * 0.11 * 0.18)
    $g.FillPath($pink, $p); $p.Dispose(); $pink.Dispose()

    # ขีดสีทอง
    $gold = New-Object System.Drawing.SolidBrush((Get-Color '#F3C64B'))
    Fill-RotatedCapsule -g $g -brush $gold -cx ($x + $s * 0.195) -cy ($y + $s * 0.09) -w ($s * 0.03) -h ($s * 0.12) -angle 20
    Fill-RotatedCapsule -g $g -brush $gold -cx ($x + $s * 0.915) -cy ($y + $s * 0.365) -w ($s * 0.03) -h ($s * 0.11) -angle -38
    Fill-RotatedCapsule -g $g -brush $gold -cx ($x + $s * 0.065) -cy ($y + $s * 0.705) -w ($s * 0.03) -h ($s * 0.11) -angle 38
    $gold.Dispose()
}

# ---------- ลายสำรอง ----------
function Draw-Icon {
    param(
        [System.Drawing.Graphics]$g,
        [string]$style,
        [single]$x, [single]$y, [single]$s,
        [bool]$detail = $true
    )

    $rect = New-Object System.Drawing.RectangleF($x, $y, $s, $s)

    if ($style -eq 'crystal') {
        Draw-Crystal -g $g -x $x -y $y -s $s -detail $detail
    }
    elseif ($style -eq 'ball') {
        $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, (Get-Color '#FF9EC4'), (Get-Color '#A98FEE'), 45.0)
        $g.FillRectangle($bg, $rect); $bg.Dispose()

        $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 255, 255, 255))
        $g.FillEllipse($white, $x + $s * 0.19, $y + $s * 0.19, $s * 0.62, $s * 0.62); $white.Dispose()

        $coreRect = New-Object System.Drawing.RectangleF(($x + $s * 0.27), ($y + $s * 0.27), ($s * 0.46), ($s * 0.46))
        $core = New-Object System.Drawing.Drawing2D.LinearGradientBrush($coreRect, (Get-Color '#A98FEE'), (Get-Color '#6FB3E8'), 45.0)
        $g.FillEllipse($core, $coreRect); $core.Dispose()

        $shine = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 255, 255, 255))
        $g.FillEllipse($shine, $x + $s * 0.27, $y + $s * 0.25, $s * 0.13, $s * 0.13); $shine.Dispose()
    }
    elseif ($style -eq 'moon') {
        $bgColor = Get-Color '#6B5BD6'
        $bg = New-Object System.Drawing.SolidBrush($bgColor)
        $g.FillRectangle($bg, $rect); $bg.Dispose()

        $cream = New-Object System.Drawing.SolidBrush((Get-Color '#FFF0C4'))
        $g.FillEllipse($cream, $x + $s * 0.17, $y + $s * 0.20, $s * 0.60, $s * 0.60); $cream.Dispose()

        $bite = New-Object System.Drawing.SolidBrush($bgColor)
        $g.FillEllipse($bite, $x + $s * 0.34, $y + $s * 0.13, $s * 0.60, $s * 0.60); $bite.Dispose()

        $starSize = $s * 0.15
        $p = New-RoundedDiamondPath -cx ($x + $s - $s * 0.13 - $starSize / 2) -cy ($y + $s - $s * 0.17 - $starSize / 2) -size $starSize -radius ($starSize * 0.22)
        $gold = New-Object System.Drawing.SolidBrush((Get-Color '#FFD98A'))
        $g.FillPath($gold, $p); $gold.Dispose(); $p.Dispose()
    }
    else {
        $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, (Get-Color '#FFD98A'), (Get-Color '#FF8FB1'), 45.0)
        $g.FillRectangle($bg, $rect); $bg.Dispose()

        $gemSize = $s * 0.46
        $p = New-RoundedDiamondPath -cx ($x + $s * 0.45) -cy ($y + $s * 0.45) -size $gemSize -radius ($gemSize * 0.16)
        $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $g.FillPath($white, $p); $white.Dispose(); $p.Dispose()

        $sparkSize = $s * 0.19
        $p = New-RoundedDiamondPath -cx ($x + $s - $s * 0.13 - $sparkSize / 2) -cy ($y + $s * 0.13 + $sparkSize / 2) -size $sparkSize -radius ($sparkSize * 0.20)
        $soft = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(235, 255, 255, 255))
        $g.FillPath($soft, $p); $soft.Dispose(); $p.Dispose()
    }
}

# ---------- ไฟล์เดี่ยวขนาด 256 ----------
foreach ($style in @('crystal', 'ball', 'moon', 'star')) {
    $bmp = New-Object System.Drawing.Bitmap(256, 256)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = $smooth
    Draw-Icon -g $g -style $style -x 0 -y 0 -s 256 -detail $true
    $g.Dispose()
    $bmp.Save((Join-Path $outDir "icon-$style-256.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Output "saved icon-$style-256.png"
}

# ---------- แผ่นเปรียบเทียบ ----------
$W = 900
$H = 700
$sheet = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($sheet)
$g.SmoothingMode = $smooth
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

$creamBrush = New-Object System.Drawing.SolidBrush((Get-Color '#FFF8F2'))
$g.FillRectangle($creamBrush, 0, 0, $W, $H)
$creamBrush.Dispose()

$titleFont = New-Object System.Drawing.Font('Segoe UI', 19, [System.Drawing.FontStyle]::Bold)
$labelFont = New-Object System.Drawing.Font('Consolas', 11)
$ink = New-Object System.Drawing.SolidBrush((Get-Color '#4A3B52'))
$inkSoft = New-Object System.Drawing.SolidBrush((Get-Color '#8D7F97'))

$names = @('CRYSTAL  <- current', 'BALL', 'MOON', 'STAR')
$styles = @('crystal', 'ball', 'moon', 'star')

# แถวบน: ขนาดใหญ่ทั้งสี่แบบ
for ($i = 0; $i -lt 4; $i++) {
    $colX = 40 + $i * 215
    $g.DrawString($names[$i], $labelFont, $ink, $colX, 28)
    Draw-Icon -g $g -style $styles[$i] -x $colX -y 52 -s 180 -detail $true
}

$g.DrawString('180 px  full detail', $labelFont, $inkSoft, 40, 244)

# แถวกลาง: ขนาดจริงบนพื้นสว่าง
$rowY = 300
$g.DrawString('real sizes  64 / 32 / 16  on light', $labelFont, $inkSoft, 40, ($rowY - 24))
for ($i = 0; $i -lt 4; $i++) {
    $colX = 40 + $i * 215
    $chip = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillRectangle($chip, $colX, $rowY, 180, 100)
    $chip.Dispose()

    $small = ($styles[$i] -eq 'crystal')
    Draw-Icon -g $g -style $styles[$i] -x ($colX + 14) -y ($rowY + 18) -s 64 -detail (-not $small)
    Draw-Icon -g $g -style $styles[$i] -x ($colX + 92) -y ($rowY + 34) -s 32 -detail (-not $small)
    Draw-Icon -g $g -style $styles[$i] -x ($colX + 136) -y ($rowY + 42) -s 16 -detail (-not $small)
}

# แถวล่าง: ขนาดจริงบนพื้นมืด
$rowY2 = 440
$g.DrawString('real sizes on dark', $labelFont, $inkSoft, 40, ($rowY2 - 24))
for ($i = 0; $i -lt 4; $i++) {
    $colX = 40 + $i * 215
    $chip = New-Object System.Drawing.SolidBrush((Get-Color '#241E2A'))
    $g.FillRectangle($chip, $colX, $rowY2, 180, 100)
    $chip.Dispose()

    $small = ($styles[$i] -eq 'crystal')
    Draw-Icon -g $g -style $styles[$i] -x ($colX + 14) -y ($rowY2 + 18) -s 64 -detail (-not $small)
    Draw-Icon -g $g -style $styles[$i] -x ($colX + 92) -y ($rowY2 + 34) -s 32 -detail (-not $small)
    Draw-Icon -g $g -style $styles[$i] -x ($colX + 136) -y ($rowY2 + 42) -s 16 -detail (-not $small)
}

# แถวเทียบ crystal เต็ม vs ย่อ
$rowY3 = 580
$g.DrawString('CRYSTAL  full detail vs compact  (small sizes use compact)', $labelFont, $ink, 40, ($rowY3 - 24))
$chip = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.FillRectangle($chip, 40, $rowY3, 390, 90)
$chip.Dispose()
Draw-Icon -g $g -style 'crystal' -x 56 -y ($rowY3 + 13) -s 64 -detail $true
Draw-Icon -g $g -style 'crystal' -x 140 -y ($rowY3 + 29) -s 32 -detail $true
Draw-Icon -g $g -style 'crystal' -x 186 -y ($rowY3 + 37) -s 16 -detail $true
Draw-Icon -g $g -style 'crystal' -x 236 -y ($rowY3 + 13) -s 64 -detail $false
Draw-Icon -g $g -style 'crystal' -x 320 -y ($rowY3 + 29) -s 32 -detail $false
Draw-Icon -g $g -style 'crystal' -x 366 -y ($rowY3 + 37) -s 16 -detail $false
$g.DrawString('full                       compact', $labelFont, $inkSoft, 56, ($rowY3 + 66))

$titleFont.Dispose(); $labelFont.Dispose(); $ink.Dispose(); $inkSoft.Dispose()
$g.Dispose()

$sheet.Save((Join-Path $outDir 'icon-comparison.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$sheet.Dispose()
Write-Output 'saved icon-comparison.png'

# ==================================================================
# ไฟล์ที่เว็บใช้งานจริง
#
# ทำไมเป็นไฟล์นิ่งไม่ใช่สร้างตอน request ด้วย ImageResponse:
# satori ที่อยู่เบื้องหลังรองรับ CSS ไม่ครบและตรวจสอบผลก่อน deploy ไม่ได้
# ลายลูกแก้วมีวงกลมทับกันและวงรีหมุน ถ้า satori วาดไม่ตรงจะพังเงียบๆ
# ไฟล์นิ่งเปิดดูด้วยตาได้ก่อน จึงชัวร์กว่าสำหรับรูปที่ไม่เคยเปลี่ยน
# ==================================================================

$repoRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

$targets = @(
    @{ path = 'src\app\icon.png'; size = 256 },        # favicon
    @{ path = 'src\app\apple-icon.png'; size = 180 },  # iOS หน้าโฮม
    @{ path = 'public\icon-192.png'; size = 192 },     # manifest
    @{ path = 'public\icon-512.png'; size = 512 }      # manifest + maskable
)

foreach ($t in $targets) {
    $full = Join-Path $repoRoot $t.path
    $dir = Split-Path $full -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force $dir | Out-Null }

    $bmp = New-Object System.Drawing.Bitmap($t.size, $t.size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = $smooth
    Draw-Icon -g $g -style 'crystal' -x 0 -y 0 -s $t.size -detail $true
    $g.Dispose()
    $bmp.Save($full, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()

    Write-Output "saved $($t.path)  ($($t.size)px)"
}
