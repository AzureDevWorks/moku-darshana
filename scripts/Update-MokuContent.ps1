param(
    [Parameter(Mandatory = $true)]
    [string]$File,

    [Parameter(Mandatory = $true)]
    [int]$Verse,

    [Parameter(Mandatory = $true)]
    [ValidateSet(
        "sanskrit",
        "transliteration",
        "meaning.english",
        "meaning.nepali",
        "explanation.english",
        "explanation.nepali",
        "learning.keyTeaching",
        "learning.contemplation",
        "learning.practice",
        "practice.instructions",
        "practice.duration",
        "audio.patha",
        "audio.slow",
        "audio.meaning",
        "audio.explanation"
    )]
    [string]$Field,

    [Parameter(Mandatory = $true)]
    [AllowEmptyString()]
    [string]$Value
)

if (-not (Test-Path $File)) {
    throw "File not found: $File"
}

$data = Get-Content $File -Raw -Encoding UTF8 | ConvertFrom-Json

$verseSection = @($data.sections) |
    Where-Object { $_.id -eq "verses" } |
    Select-Object -First 1

if (-not $verseSection) {
    throw "Section 'verses' was not found."
}

$verse = @($verseSection.items) |
    Where-Object { [int]$_.number -eq $Verse } |
    Select-Object -First 1

if (-not $verse) {
    throw "Verse $Verse was not found."
}

function Set-NestedValue {
    param(
        [object]$Object,
        [string]$Path,
        [string]$Value
    )

    $parts = $Path -split "\."
    $current = $Object

    for ($i = 0; $i -lt ($parts.Count - 1); $i++) {

        $part = $parts[$i]

        if (-not $current.PSObject.Properties[$part]) {
            $current | Add-Member `
                -NotePropertyName $part `
                -NotePropertyValue ([PSCustomObject]@{})
        }

        $current = $current.$part
    }

    $finalPart = $parts[$parts.Count - 1]

    if ($current.PSObject.Properties[$finalPart]) {
        $current.$finalPart = $Value
    }
    else {
        $current | Add-Member `
            -NotePropertyName $finalPart `
            -NotePropertyValue $Value
    }
}

# ------------------------------------------------------------
# UPDATE
# ------------------------------------------------------------

switch -Wildcard ($Field) {

    "sanskrit" {
        $verse.text.sanskrit = $Value
    }

    "transliteration" {
        $verse.text.transliteration = $Value
    }

    "meaning.*" {
        Set-NestedValue `
            -Object $verse.meaning `
            -Path ($Field -replace "^meaning\.", "") `
            -Value $Value
    }

    "explanation.*" {
        Set-NestedValue `
            -Object $verse.explanation `
            -Path ($Field -replace "^explanation\.", "") `
            -Value $Value
    }

    "learning.*" {
        Set-NestedValue `
            -Object $verse.learning `
            -Path ($Field -replace "^learning\.", "") `
            -Value $Value
    }

    "practice.*" {
        Set-NestedValue `
            -Object $verse.practice `
            -Path ($Field -replace "^practice\.", "") `
            -Value $Value
    }

    "audio.*" {
        $verse.audio.available = $true

        Set-NestedValue `
            -Object $verse.audio `
            -Path ($Field -replace "^audio\.", "") `
            -Value $Value
    }
}

# ------------------------------------------------------------
# WRITE
# ------------------------------------------------------------

$data |
    ConvertTo-Json -Depth 50 |
    Set-Content $File -Encoding UTF8

# ------------------------------------------------------------
# VERIFY
# ------------------------------------------------------------

$verify = Get-Content $File -Raw -Encoding UTF8 |
    ConvertFrom-Json

$verifyVerse = @(
    $verify.sections |
    Where-Object { $_.id -eq "verses" } |
    Select-Object -ExpandProperty items
) |
    Where-Object { [int]$_.number -eq $Verse } |
    Select-Object -First 1

if (-not $verifyVerse) {
    throw "Verification failed: verse $Verse could not be found after saving."
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "MOKU CONTENT UPDATED" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Document : $($verify.id)" -ForegroundColor Cyan
Write-Host "Verse    : $Verse" -ForegroundColor Cyan
Write-Host "Field    : $Field" -ForegroundColor Cyan
Write-Host "Updated  : SUCCESS" -ForegroundColor Green
Write-Host ""
