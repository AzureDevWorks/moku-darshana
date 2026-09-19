$path = ".\src\content\devi-mahatmya\patha-purva\argala-stotram.json"

if (-not (Test-Path $path)) {
    throw "Argala JSON not found: $path"
}

$data = Get-Content $path -Raw -Encoding UTF8 | ConvertFrom-Json

$verseSection = $data.sections |
    Where-Object { $_.id -eq "verses" -or $_.type -eq "verses" } |
    Select-Object -First 1

if (-not $verseSection) {
    throw "Could not find the Argala verses section."
}

$items = @($verseSection.items)

if ($items.Count -eq 0) {
    throw "No verse items found."
}

$standardized = @()

foreach ($verse in $items) {

    $number = 0

    if ($verse.number) {
        $number = [int]$verse.number
    } else {
        $number = $standardized.Count + 1
    }

    # Keep all existing properties.
    $copy = [ordered]@{}

    foreach ($property in $verse.PSObject.Properties) {
        $copy[$property.Name] = $property.Value
    }

    # Stable identity for future bookmarks/progress/audio.
    $copy["id"] = "argala-$($number.ToString('00'))"

    # Stable numbering.
    $copy["number"] = $number

    # Explicit content classification.
    if (-not $copy.Contains("type")) {
        $copy["type"] = "verse"
    }

    # Language/source information.
    if (-not $copy.Contains("language")) {
        $copy["language"] = "sa"
    }

    if (-not $copy.Contains("script")) {
        $copy["script"] = "Devanagari"
    }

    # Learning information.
    if (-not $copy.Contains("learning")) {
        $copy["learning"] = [ordered]@{
            enabled = $true
            meaningAvailable = (
                $copy.Contains("meaning") -or
                $copy.Contains("commentary")
            )
            explanationAvailable = $copy.Contains("commentary")
        }
    }

    # Audio contract.
    if (-not $copy.Contains("audio")) {
        $copy["audio"] = [ordered]@{
            available = $false
            patha = $null
            slow = $null
        }
    } elseif ($copy["audio"] -is [pscustomobject]) {
        if (-not $copy.audio.PSObject.Properties["available"]) {
            $copy.audio | Add-Member -MemberType NoteProperty `
                -Name available -Value $true
        }
    }

    # Future user progress.
    if (-not $copy.Contains("practice")) {
        $copy["practice"] = [ordered]@{
            repeatable = $true
            memorization = $false
        }
    }

    $standardized += [pscustomobject]$copy
}

$verseSection.items = $standardized

$data | ConvertTo-Json -Depth 50 |
    Set-Content $path -Encoding UTF8

Write-Host ""
Write-Host "Argala verses standardized successfully." -ForegroundColor Green
Write-Host "Verses found: $($standardized.Count)"
Write-Host "Existing Sanskrit and commentary preserved."
Write-Host ""
