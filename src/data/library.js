const library = {
  id: "devi-mahatmya",
  title: "DEVĪ MĀHĀTMYA",
  sanskritTitle: "देवीमाहात्म्यम्",

  collections: [
    {
      id: "patha-purva",
      title: "PĀṬHA PŪRVA",
      sanskritTitle: "पाठपूर्व",
      description:
        "Texts traditionally associated with preparation for the Devī Māhātmya recitation.",

      items: [
        {
          id: "devi-kavacam",
          title: "Devī Kavacam",
          sanskritTitle: "॥ श्रीदेवीकवचम् ॥",
          type: "stotram",
          verses: 47,
          attachable: true,
          status: "available",
        },
        {
          id: "argala-stotram",
          title: "Argala Stotram",
          sanskritTitle: "॥ श्रीअर्गलास्तोत्रम् ॥",
          type: "stotram",
          verses: 27,
          attachable: true,
          status: "available",
        },
        {
          id: "keelaka-strotram",
          title: "Kīlaka Stotram",
          sanskritTitle: "॥ श्रीकीलकस्तोत्रम् ॥",
          type: "stotram",
          verses: 15,
          attachable: true,
          status: "available",
        },
      ],
    },

    {
      id: "saptashati",
      title: "SAPTAŚATĪ",
      sanskritTitle: "सप्तशती",
      description:
        "The thirteen chapters of the Devī Māhātmya.",

      items: Array.from({ length: 13 }, (_, index) => ({
        id: `adhyaya-${index + 1}`,
        title: `Adhyāya ${index + 1}`,
        sanskritTitle: `अध्याय ${index + 1}`,
        type: "chapter",
        attachable: true,
        status: "available",
      })),
    },

    {
      id: "patha-uttara",
      title: "PĀṬHA UTTARA",
      sanskritTitle: "पाठोत्तर",
      description:
        "Stotras, prayers, mysteries and concluding devotional texts associated with the Devī Māhātmya.",

      items: [
        {
          id: "devi-manasapuja",
          title: "Devī Mānasapūjā",
          sanskritTitle: "॥ देवीमानसपूजा ॥",
          type: "stotram",
          attachable: true,
          status: "available",
        },

        {
          id: "devi-suktam",
          title: "Devī Sūktam",
          sanskritTitle: "॥ देवीसूक्तम् ॥",
          type: "stotram",
          attachable: true,
          status: "available",
        },

        {
          id: "ratri-suktam",
          title: "Rātri Sūktam",
          sanskritTitle: "॥ रात्रिसूक्तम् ॥",
          type: "stotram",
          attachable: true,
          status: "available",
        },

        {
          id: "devyaparadha-kshamapana",
          title: "Devyaparādhakṣamāpaṇa Stotram",
          sanskritTitle:
            "॥ देव्यपराधक्षमापनस्तोत्रम् ॥",
          type: "stotram",
          attachable: true,
          status: "available",
        },

        {
          id: "kshamaprarthana",
          title: "Kṣamāprārthanā",
          sanskritTitle: "॥ क्षमाप्रार्थना ॥",
          type: "prayer",
          attachable: true,
          status: "available",
        },

        {
          id: "saptashloki-durga",
          title: "Śrī Saptashlokī Durgā",
          sanskritTitle: "॥ श्रीसप्तश्लोकी दुर्गा ॥",
          type: "stotram",
          audio: true,
          attachable: true,
          status: "available",
        },

        {
          id: "siddha-kunjika-stotram",
          title: "Siddhakuñjikā Stotram",
          sanskritTitle:
            "॥ सिद्धकुञ्जिकास्तोत्रम् ॥",
          type: "stotram",
          attachable: true,
          status: "available",
        },

        {
          id: "rahasya-trayam",
          title: "Rahasya Trayam",
          sanskritTitle: "॥ रहस्यत्रयम् ॥",
          type: "rahasya",
          sections: 3,
          attachable: true,
          status: "available",
        },

        {
          id: "pradhanika-rahasya",
          title: "Prādhānika Rahasya",
          sanskritTitle: "॥ प्राधानिकरहस्यम् ॥",
          type: "rahasya",
          attachable: true,
          status: "available",
        },

        {
          id: "vaikritika-rahasya",
          title: "Vaikṛtika Rahasya",
          sanskritTitle: "॥ वैकृतिकरहस्यम् ॥",
          type: "rahasya",
          attachable: true,
          status: "available",
        },

        {
          id: "murti-rahasya",
          title: "Mūrti Rahasya",
          sanskritTitle: "॥ मूर्तिरहस्यम् ॥",
          type: "rahasya",
          attachable: true,
          status: "available",
        },

        {
          id: "navarna-mantra-japa",
          title: "Navārṇa Mantra Japa",
          sanskritTitle: "॥ नवार्णमन्त्रजपः ॥",
          type: "mantra",
          attachable: true,
          status: "available",
        },

        {
          id: "phalashruti",
          title: "Phalaśruti",
          sanskritTitle: "॥ फलश्रुतिः ॥",
          type: "phala-shruti",
          attachable: true,
          status: "available",
        },

        {
          id: "arati-nirajana",
          title: "Āratī / Nīrājana",
          sanskritTitle: "॥ आरती / नीराजनम् ॥",
          type: "ritual",
          attachable: true,
          status: "available",
        },

        {
          id: "namaskara-prarthana",
          title: "Namaskāra / Prārthanā",
          sanskritTitle: "॥ नमस्कारप्रार्थना ॥",
          type: "prayer",
          attachable: true,
          status: "available",
        },

        {
          id: "prasada-samapana",
          title: "Prasāda / Samāpana",
          sanskritTitle: "॥ प्रसादसमापनम् ॥",
          type: "ritual",
          attachable: true,
          status: "available",
        },
      ],
    },
  ],
};

export default library;