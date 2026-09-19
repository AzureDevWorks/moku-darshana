$path = ".\src\content\devi-mahatmya\patha-purva\argala-stotram.json"

if (-not (Test-Path $path)) {
    throw "File not found: $path"
}

$data = Get-Content $path -Raw -Encoding UTF8 | ConvertFrom-Json

# ------------------------------------------------------------
# Standalone course configuration
# ------------------------------------------------------------

$data | Add-Member -Force -MemberType NoteProperty -Name course -Value ([pscustomobject]@{
    enabled = $true
    mode = "standalone"
    completionModel = "guided-reading"

    stages = @(
        [pscustomobject]@{
            id = "orientation"
            title = "परिचय"
            description = "Understand the hymn before beginning the recitation."
            sectionIds = @(
                "introduction",
                "purpose",
                "textual-tradition",
                "preparation"
            )
        },

        [pscustomobject]@{
            id = "preparation"
            title = "पाठपूर्व तयारी"
            description = "Prepare body, speech and attention for recitation."
            sectionIds = @(
                "viniyoga",
                "dhyana"
            )
        },

        [pscustomobject]@{
            id = "recitation"
            title = "मुख्य पाठ"
            description = "Read and listen to the complete hymn."
            sectionIds = @(
                "verses"
            )
        },

        [pscustomobject]@{
            id = "understanding"
            title = "अर्थ र चिन्तन"
            description = "Understand the recurring prayer and deeper meaning."
            sectionIds = @(
                "refrain-study",
                "summary",
                "tatvikartha"
            )
        },

        [pscustomobject]@{
            id = "practice"
            title = "साधना"
            description = "Apply the teaching through reflection and practice."
            sectionIds = @(
                "sadhaka-shiksha",
                "patha-krama",
                "reflection",
                "daily-practice"
            )
        },

        [pscustomobject]@{
            id = "completion"
            title = "समापन"
            description = "Complete the work with its traditional conclusion."
            sectionIds = @(
                "conclusion"
            )
        }
    )
})

# ------------------------------------------------------------
# Completion information
# ------------------------------------------------------------

$data | Add-Member -Force -MemberType NoteProperty -Name completion -Value ([pscustomobject]@{
    enabled = $true
    requiredStages = @(
        "orientation",
        "preparation",
        "recitation",
        "understanding",
        "practice",
        "completion"
    )
    completionMessage = "अर्गलास्तोत्रको अध्ययन तथा पाठ पूर्ण भयो।"
    completionMessageEnglish = "The study and recitation of Argala Stotram is complete."
})

# ------------------------------------------------------------
# Course-level learning objectives
# ------------------------------------------------------------

$data | Add-Member -Force -MemberType NoteProperty -Name learningObjectives -Value @(
    "अर्गलास्तोत्रको स्वरूप र उद्देश्य बुझ्नु",
    "मूल संस्कृत पाठ श्रद्धापूर्वक पढ्नु",
    "प्रमुख प्रार्थनाको अर्थ बुझ्नु",
    "स्तोत्रको तात्त्विक अर्थमा चिन्तन गर्नु",
    "पाठलाई नियमित साधनाको रूपमा अभ्यास गर्नु"
)

# ------------------------------------------------------------
# Preserve and write
# ------------------------------------------------------------

$data | ConvertTo-Json -Depth 40 |
    Set-Content $path -Encoding UTF8

Write-Host ""
Write-Host "Argala standalone course model added." -ForegroundColor Green
Write-Host "Existing Sanskrit and verse content was preserved."
Write-Host ""
