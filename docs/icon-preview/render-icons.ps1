# เรนเดอร์ไอคอน 3 แบบเป็นไฟล์ PNG จริง ด้วย GDI+ ของ .NET
# ใช้ค่าสีและสัดส่วนชุดเดียวกับ src/lib/app-icon.tsx

Add-Type -AssemblyName System.Drawing

$outDir = $PSScriptRoot
$smooth = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

function New-RoundedDiamondPath {
    param([single]$cx, [single]$cy, [single]$size, [single]$radius)

    # สร้างสี่เหลี่ยมมุมมนแล้วหมุน 45 องศา กลายเป็นข้าวหลามตัดมุมมน
    $half = $size / 2
    $left = $cx - $half
    $top = $cy - $half
    $d = $radius * 2

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

function Draw-Icon {
    param(
        [System.Drawing.Graphics]$g,
        [string]$style,
        [single]$x,
        [single]$y,
        [single]$s
    )

    $rect = New-Object System.Drawing.RectangleF($x, $y, $s, $s)

    if ($style -eq 'ball') {
        $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            $rect,
            [System.Drawing.ColorTranslator]::FromHtml('#FF9EC4'),
            [System.Drawing.ColorTranslator]::FromHtml('#A98FEE'),
            45.0)
        $g.FillRectangle($bg, $rect)
        $bg.Dispose()

        # วงกลมขาว 62%
        $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 255, 255, 255))
        $g.FillEllipse($white, $x + $s * 0.19, $y + $s * 0.19, $s * 0.62, $s * 0.62)
        $white.Dispose()

        # แกนกลางไล่สี 46%
        $coreRect = New-Object System.Drawing.RectangleF(
            ($x + $s * 0.27), ($y + $s * 0.27), ($s * 0.46), ($s * 0.46))
        $core = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            $coreRect,
            [System.Drawing.ColorTranslator]::FromHtml('#A98FEE'),
            [System.Drawing.ColorTranslator]::FromHtml('#6FB3E8'),
            45.0)
        $g.FillEllipse($core, $coreRect)
        $core.Dispose()

        # จุดสะท้อนแสง
        $shine = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 255, 255, 255))
        $g.FillEllipse($shine, $x + $s * 0.27, $y + $s * 0.25, $s * 0.13, $s * 0.13)
        $shine.Dispose()
    }
    elseif ($style -eq 'moon') {
        $bgColor = [System.Drawing.ColorTranslator]::FromHtml('#6B5BD6')
        $bg = New-Object System.Drawing.SolidBrush($bgColor)
        $g.FillRectangle($bg, $rect)
        $bg.Dispose()

        # วงกลมครีม
        $cream = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#FFF0C4'))
        $g.FillEllipse($cream, $x + $s * 0.17, $y + $s * 0.20, $s * 0.60, $s * 0.60)
        $cream.Dispose()

        # วงกลมสีพื้นทับให้เว้าเป็นเสี้ยว
        $bite = New-Object System.Drawing.SolidBrush($bgColor)
        $g.FillEllipse($bite, $x + $s * 0.34, $y + $s * 0.13, $s * 0.60, $s * 0.60)
        $bite.Dispose()

        # ดาวดวงเล็ก
        $starSize = $s * 0.15
        $starCx = $x + $s - $s * 0.13 - $starSize / 2
        $starCy = $y + $s - $s * 0.17 - $starSize / 2
        $starPath = New-RoundedDiamondPath -cx $starCx -cy $starCy -size $starSize -radius ($starSize * 0.22)
        $gold = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#FFD98A'))
        $g.FillPath($gold, $starPath)
        $gold.Dispose()
        $starPath.Dispose()
    }
    else {
        $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            $rect,
            [System.Drawing.ColorTranslator]::FromHtml('#FFD98A'),
            [System.Drawing.ColorTranslator]::FromHtml('#FF8FB1'),
            45.0)
        $g.FillRectangle($bg, $rect)
        $bg.Dispose()

        # ข้าวหลามตัดใหญ่
        $gemSize = $s * 0.46
        $gemPath = New-RoundedDiamondPath -cx ($x + $s * 0.45) -cy ($y + $s * 0.45) -size $gemSize -radius ($gemSize * 0.16)
        $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $g.FillPath($white, $gemPath)
        $white.Dispose()
        $gemPath.Dispose()

        # ดาวเล็กมุมบนขวา
        $sparkSize = $s * 0.19
        $sparkCx = $x + $s - $s * 0.13 - $sparkSize / 2
        $sparkCy = $y + $s * 0.13 + $sparkSize / 2
        $sparkPath = New-RoundedDiamondPath -cx $sparkCx -cy $sparkCy -size $sparkSize -radius ($sparkSize * 0.20)
        $soft = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(235, 255, 255, 255))
        $g.FillPath($soft, $sparkPath)
        $soft.Dispose()
        $sparkPath.Dispose()
    }
}

# ---------- ไฟล์เดี่ยวขนาด 256 ----------
foreach ($style in @('ball', 'moon', 'star')) {
    $bmp = New-Object System.Drawing.Bitmap(256, 256)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = $smooth
    Draw-Icon -g $g -style $style -x 0 -y 0 -s 256
    $g.Dispose()
    $bmp.Save((Join-Path $outDir "icon-$style-256.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Output "saved icon-$style-256.png"
}

# ---------- แผ่นเปรียบเทียบ ----------
$W = 900
$H = 620
$sheet = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($sheet)
$g.SmoothingMode = $smooth
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

$cream = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#FFF8F2'))
$g.FillRectangle($cream, 0, 0, $W, $H)
$cream.Dispose()

$titleFont = New-Object System.Drawing.Font('Segoe UI', 20, [System.Drawing.FontStyle]::Bold)
$labelFont = New-Object System.Drawing.Font('Consolas', 11)
$ink = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#4A3B52'))
$inkSoft = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#8D7F97'))

$names = @('01  BALL', '02  MOON', '03  STAR')
$styles = @('ball', 'moon', 'star')

for ($i = 0; $i -lt 3; $i++) {
    $colX = 40 + $i * 290

    $g.DrawString($names[$i], $titleFont, $ink, $colX, 32)

    # ขนาดใหญ่
    Draw-Icon -g $g -style $styles[$i] -x $colX -y 76 -s 180
    $g.DrawString('180 px', $labelFont, $inkSoft, $colX, 262)

    # แถวขนาดจริงบนพื้นสว่าง
    $rowY = 300
    $lightChip = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillRectangle($lightChip, $colX, $rowY, 240, 96)
    $lightChip.Dispose()

    Draw-Icon -g $g -style $styles[$i] -x ($colX + 20) -y ($rowY + 24) -s 64
    Draw-Icon -g $g -style $styles[$i] -x ($colX + 104) -y ($rowY + 40) -s 32
    Draw-Icon -g $g -style $styles[$i] -x ($colX + 152) -y ($rowY + 48) -s 16
    $g.DrawString('64      32   16', $labelFont, $inkSoft, ($colX + 20), ($rowY + 74))

    # แถวขนาดจริงบนพื้นมืด
    $rowY2 = 420
    $darkChip = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#241E2A'))
    $g.FillRectangle($darkChip, $colX, $rowY2, 240, 96)
    $darkChip.Dispose()

    Draw-Icon -g $g -style $styles[$i] -x ($colX + 20) -y ($rowY2 + 24) -s 64
    Draw-Icon -g $g -style $styles[$i] -x ($colX + 104) -y ($rowY2 + 40) -s 32
    Draw-Icon -g $g -style $styles[$i] -x ($colX + 152) -y ($rowY2 + 48) -s 16
}

$g.DrawString('mu-today app icon options', $labelFont, $inkSoft, 40, $H - 50)
$g.DrawString('bottom row = real favicon sizes on dark background', $labelFont, $inkSoft, 40, $H - 30)

$titleFont.Dispose()
$labelFont.Dispose()
$ink.Dispose()
$inkSoft.Dispose()
$g.Dispose()

$sheet.Save((Join-Path $outDir 'icon-comparison.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$sheet.Dispose()
Write-Output 'saved icon-comparison.png'
