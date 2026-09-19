$path = ".\src\content\devi-mahatmya\patha-purva\argala-stotram.json"

$data = Get-Content $path -Raw -Encoding UTF8 | ConvertFrom-Json

$verseSection = $data.sections |
    Where-Object { $_.id -eq "verses" } |
    Select-Object -First 1

if (-not $verseSection) {
    throw "Verses section not found."
}

foreach ($verse in @($verseSection.items)) {

    if (-not $verse.PSObject.Properties["transliteration"]) {
        $verse | Add-Member -MemberType NoteProperty `
            -Name transliteration -Value $null
    }

    if (-not $verse.PSObject.Properties["wordMeaning"]) {
        $verse | Add-Member -MemberType NoteProperty `
            -Name wordMeaning -Value @()
    }

    if (-not $verse.PSObject.Properties["meaning"]) {
        $verse | Add-Member -MemberType NoteProperty `
            -Name meaning -Value $null
    }

    if (-not $verse.PSObject.Properties["learning"]) {
        $verse | Add-Member -MemberType NoteProperty `
            -Name learning -Value ([pscustomobject]@{
                keyTeaching = $null
                contemplation = $null
                practice = $null
            })
    }
}

$data | ConvertTo-Json -Depth 50 |
    Set-Content $path -Encoding UTF8

Write-Host ""
Write-Host "Argala verse data contract updated." -ForegroundColor Green
Write-Host "Existing Sanskrit, commentary and audio were preserved."
Write-Host "Added: IAST, wordMeaning, meaning and learning fields."
Write-Host ""
