$path = ".\src\content\devi-mahatmya\patha-purva\argala-stotram.json"

if (-not (Test-Path $path)) {
    throw "Argala JSON not found: $path"
}

$data = Get-Content $path -Raw -Encoding UTF8 | ConvertFrom-Json

$data.id = "argala-stotram"
$data.title = "Argala Stotram"
$data.sanskritTitle = "॥ श्रीअर्गलास्तोत्रम् ॥"
$data.type = "stotram"

if (-not $data.metadata) {
    $data | Add-Member -MemberType NoteProperty -Name metadata -Value ([pscustomobject]@{})
}

$data.metadata | Add-Member -Force -MemberType NoteProperty `
    -Name standalone -Value $true

$data.metadata | Add-Member -Force -MemberType NoteProperty `
    -Name learningModel -Value "complete-work"

$data.metadata | Add-Member -Force -MemberType NoteProperty `
    -Name primaryTradition -Value "Devi Mahatmya"

$data.metadata | Add-Member -Force -MemberType NoteProperty `
    -Name sourceTextPreservation -Value "preserve-user-supplied-source"

$data.metadata | Add-Member -Force -MemberType NoteProperty `
    -Name textualNote -Value "Verse numbering and wording may vary by recension; Moku Darshana preserves the selected source text rather than silently merging recensions."

$data.metadata | Add-Member -Force -MemberType NoteProperty `
    -Name learningLanguages -Value @("ne", "en")

$existingSections = @($data.sections)

function Get-Section($id) {
    return $existingSections | Where-Object { $_.id -eq $id } | Select-Object -First 1
}

$intro = Get-Section "introduction"
$viniyoga = Get-Section "viniyoga"
$dhyana = Get-Section "dhyana"
$verses = Get-Section "verses"
$conclusion = Get-Section "conclusion"
$summary = Get-Section "summary"
$tatvikartha = Get-Section "tatvikartha"
$sadhaka = Get-Section "sadhaka-shiksha"
$patha = Get-Section "patha-krama"

$newSections = @()

if ($intro) {
    $newSections += $intro
}

$newSections += [pscustomobject]@{
    id = "purpose"
    type = "lesson"
    title = "पाठको उद्देश्य"
    content = [pscustomobject]@{
        nepali = "अर्गलास्तोत्रमा देवीका विभिन्न स्वरूपहरूको स्तुति गर्दै साधकले रूप, जय, यश तथा शत्रुनाशको प्रार्थना गर्दछ। यस प्रार्थनालाई बाह्य अर्थमा मात्र सीमित नगरी साधकका आन्तरिक अवरोध, दुर्बलता र अज्ञानमाथि विजयको दिशामा पनि अध्ययन गर्न सकिन्छ।"
        english = "Purpose of the hymn: to praise the Goddess and seek her grace through the recurring prayer for form, victory, glory, and the destruction of hostile forces. The prayer may also be studied inwardly as a contemplation on overcoming personal obstacles."
        status = "educational-commentary"
    }
}

$newSections += [pscustomobject]@{
    id = "textual-tradition"
    type = "source-note"
    title = "स्रोत एवं पाठपरम्परा"
    content = [pscustomobject]@{
        nepali = "अर्गलास्तोत्र देवीमाहात्म्यसँग सम्बद्ध प्रसिद्ध स्तोत्र हो। विभिन्न प्रकाशित पाठपरम्परामा श्लोकको संख्या, क्रम वा केही पाठभेद देखिन सक्छन्। Moku Darśana मा प्रयोग गरिएको मूल संस्कृत पाठलाई छुट्टै स्रोत-पाठका रूपमा सुरक्षित राखिनेछ।"
        english = "Argala Stotram is a traditional hymn associated with the Devī Māhātmya. Different textual presentations can vary in verse numbering, sequence, and wording. Moku Darśana therefore treats the selected Sanskrit source as a distinct textual recension rather than silently combining different versions."
        status = "source-note"
    }
}

$newSections += [pscustomobject]@{
    id = "preparation"
    type = "practice"
    title = "पाठपूर्व तयारी"
    content = [pscustomobject]@{
        nepali = "पाठ सुरु गर्नुअघि केही क्षण शान्त भएर बस्नुहोस्। देवीप्रति श्रद्धा, स्पष्ट संकल्प र ध्यानपूर्वक उच्चारणलाई प्राथमिकता दिनुहोस्।"
        english = "Before beginning, sit quietly for a few moments. Approach the recitation with reverence, a clear intention, and careful pronunciation."
        status = "practice-guidance"
    }
}

if ($viniyoga) {
    $newSections += $viniyoga
}

if ($dhyana) {
    $newSections += $dhyana
}

if ($verses) {
    $newSections += $verses
}

$newSections += [pscustomobject]@{
    id = "refrain-study"
    type = "lesson"
    title = "आवर्ती प्रार्थना"
    content = [pscustomobject]@{
        sanskrit = "रूपं देहि जयं देहि यशो देहि द्विषो जहि"
        transliteration = "rūpaṃ dehi jayaṃ dehi yaśo dehi dviṣo jahi"
        nepali = "रूपं देहि — रूप वा दिव्य सौन्दर्य प्रदान गर। जयं देहि — विजय प्रदान गर। यशो देहि — यश वा कीर्ति प्रदान गर। द्विषो जहि — द्वेष, वैर वा शत्रुत्वको नाश गर।"
        english = "Grant form or beauty, grant victory, grant glory, and destroy hostile forces. The repeated refrain is a central structural feature of the hymn."
        status = "educational-commentary"
    }
}

if ($conclusion) {
    $newSections += $conclusion
}

if ($summary) {
    $newSections += $summary
}

if ($tatvikartha) {
    $newSections += $tatvikartha
}

if ($sadhaka) {
    $newSections += $sadhaka
}

if ($patha) {
    $newSections += $patha
}

$newSections += [pscustomobject]@{
    id = "reflection"
    type = "reflection"
    title = "आत्मचिन्तन"
    content = [pscustomobject]@{
        questions = @(
            "म अहिले कुन आन्तरिक अवरोधमाथि विजय चाहन्छु?",
            "मेरो लागि 'रूप', 'जय' र 'यश' को गहिरो अर्थ के हो?",
            "म बाह्य शत्रुभन्दा आफ्नै क्रोध, भय, लोभ वा अज्ञानलाई कसरी हेर्न सक्छु?",
            "आजको पाठपछि म कुन एउटा सकारात्मक परिवर्तन अभ्यास गर्नेछु?"
        )
        status = "reflection"
    }
}

$newSections += [pscustomobject]@{
    id = "daily-practice"
    type = "practice"
    title = "दैनिक सरल अभ्यास"
    content = [pscustomobject]@{
        nepali = "समयअनुसार विनियोग र ध्यानपछि सम्पूर्ण अर्गलास्तोत्र श्रद्धापूर्वक पाठ गर्न सकिन्छ। अध्ययनका दिनहरूमा प्रत्येक श्लोकको अर्थ बुझ्दै बिस्तारै पाठ गर्नुहोस्। नियमित अभ्यासमा उच्चारण, अर्थ र भाव — यी तीनैलाई सँगसँगै विकसित गर्नुहोस्।"
        english = "When appropriate to one's practice, recite the complete hymn after the preliminary portions. During study, move slowly through each verse and understand its meaning. Let pronunciation, understanding, and devotional attitude develop together."
        status = "practice-guidance"
    }
}

$data.sections = $newSections

$data | ConvertTo-Json -Depth 30 | Set-Content $path -Encoding UTF8

Write-Host ""
Write-Host "Argala Stotram upgraded successfully." -ForegroundColor Green
Write-Host "Existing Sanskrit/source sections were preserved."
Write-Host "New standalone-work sections were added."
Write-Host ""
