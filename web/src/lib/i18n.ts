/**
 * Bilingual chrome dictionary (English ↔ Igbo).
 *
 * Scope: navigation, page eyebrows / titles / leads, common buttons, footer
 * copy, empty states, form labels — i.e. everything the office controls in
 * code. Body content (pastoral letters, homilies, writings) lives in the
 * external CMS as English; when the locale is `ig` we surface a small
 * notice on long-form pages explaining that the Igbo text is forthcoming.
 *
 * Igbo translations follow Standard Igbo as used in Onitsha Archdiocese
 * catechesis. The Office of His Grace owns final phrasing — adjust freely.
 */

export type Lang = "en" | "ig";

export const LANGS: Lang[] = ["en", "ig"];

export type Dict = {
  // ── Common chrome ─────────────────────────────────────────
  brandTagline: string;
  langToggleLabel: string;
  langName: { en: string; ig: string };
  openMenu: string;
  closeMenu: string;
  primaryNav: string;
  bodyEnglishNotice: string;

  // ── Navigation labels ─────────────────────────────────────
  nav: {
    aboutHisGrace: string;
    aboutHisGraceShort: string;
    pastoralLetters: string;
    pastoralLettersShort: string;
    reflections: string;
    diary: string;
    appointments: string;
    appointmentsShort: string;
    connect: string;

    biography: string;
    hisEpiscopacy: string;
    coatOfArms: string;
    photoGallery: string;
    pastoralDiary: string;
    pastoralVisits: string;
    reflectionsAndHomilies: string;
    easterAndChristmasMessages: string;
    otherTeachings: string;
    prayerRequests: string;
    contact: string;
    newsletter: string;
    appointmentLay: string;
    appointmentClergy: string;
  };

  // ── Mega-nav panel headings ───────────────────────────────
  panel: {
    aboutEyebrow: string;
    aboutTitle: string;
    aboutLead: string;
    libraryEyebrow: string;
    libraryTitle: string;
    libraryLead: string;
    libraryBrowse: string;
    reflectionsEyebrow: string;
    reflectionsTitle: string;
    reflectionsLead: string;
    reflectionsBrowse: string;
    connectEyebrow: string;
    connectTitle: string;
    connectLead: string;
  };

  // ── Common buttons / labels ───────────────────────────────
  cta: {
    readInFull: string;
    readTheLetter: string;
    readTheTeaching: string;
    readTheReflection: string;
    open: string;
    downloadPdf: string;
    browseAll: string;
    backTo: string;
    submit: string;
    sending: string;
    learnMore: string;
  };

  // ── Page chrome (eyebrow / title / lead) ──────────────────
  pages: {
    biography: { eyebrow: string; title: string; titleAccent: string; lead: string };
    hisEpiscopacy: { eyebrow: string; title: string; titleAccent: string; lead: string };
    coatOfArms: { eyebrow: string; title: string; titleAccent: string; lead: string };
    photoGallery: { eyebrow: string; title: string; titleAccent: string; lead: string };
    pastoralLetters: { eyebrow: string; title: string; titleAccent: string; lead: string };
    reflections: { eyebrow: string; title: string; titleAccent: string; lead: string };
    messages: { eyebrow: string; title: string; titleAccent: string; lead: string };
    otherTeachings: { eyebrow: string; title: string; titleAccent: string; lead: string };
    diary: { eyebrow: string; title: string; titleAccent: string; lead: string };
    pastoralVisits: { eyebrow: string; title: string; titleAccent: string; lead: string };
    appointments: { eyebrow: string; title: string; titleAccent: string; lead: string };
    connect: { eyebrow: string; title: string; titleAccent: string; lead: string };
  };

  // ── Empty / unavailable states ────────────────────────────
  empty: {
    pastoralLettersTitle: string;
    pastoralLettersBody: string;
    reflectionsTitle: string;
    reflectionsBody: string;
    messagesTitle: string;
    messagesBody: string;
    writingsTitle: string;
    writingsBody: string;
    galleryTitle: string;
    galleryBody: string;
  };

  // ── Footer ────────────────────────────────────────────────
  footer: {
    libraryHeading: string;
    hisGraceHeading: string;
    connectHeading: string;
    motto: string;
    archbishopOfOnitsha: string;
    /** "© · The Office of His Grace" — concatenated with the Roman numeral year at render time. */
    copyrightSuffix: string;
    domus: string;
  };

  // ── Confirmation emails sent back to form submitters ─────
  // bodyTemplate may contain "{name}" and "{subject}" placeholders that the
  // server action substitutes before send.
  confirmations: {
    contact: { subject: string; bodyTemplate: string };
    prayer: { subject: string; bodyTemplate: string };
    newsletter: { subject: string; bodyTemplate: string };
  };

  // ── Pastoral letter chrome ────────────────────────────────
  letter: {
    contents: string;
    /** Eyebrow label above the reading-time value in the left rail. */
    readingLabel: string;
    /** Suffix after the reading-time number, e.g. "5 min read". */
    minRead: string;
    /** Visually-hidden suffix announcing PDF + new-tab to screen readers. */
    pdfNewTabHint: string;
    /** Section eyebrow above the prev / next pastoral letter nav. */
    continueReading: string;
    previousLetter: string;
    nextLetter: string;
    allLetters: string;
    fullTextUnavailableTitle: string;
    fullTextUnavailableBody: string;
  };
};

export const dict: Record<Lang, Dict> = {
  en: {
    brandTagline: "The Archbishop of Onitsha",
    langToggleLabel: "Language",
    langName: { en: "English", ig: "Igbo" },
    openMenu: "Open menu",
    closeMenu: "Close menu",
    primaryNav: "Primary",
    bodyEnglishNotice:
      "This text is currently available in English only. An Igbo translation will be published as it is reviewed by the Office of His Grace.",

    nav: {
      aboutHisGrace: "About His Grace",
      aboutHisGraceShort: "About",
      pastoralLetters: "Pastoral Letters",
      pastoralLettersShort: "Letters",
      reflections: "Reflections",
      diary: "Diary",
      appointments: "Appointments",
      appointmentsShort: "Visit",
      connect: "Connect",

      biography: "Biography",
      hisEpiscopacy: "His Episcopacy",
      coatOfArms: "Coat of Arms",
      photoGallery: "Photo Gallery",
      pastoralDiary: "Pastoral Diary",
      pastoralVisits: "Pastoral Visits",
      reflectionsAndHomilies: "Reflections & Homilies",
      easterAndChristmasMessages: "Easter & Christmas Messages",
      otherTeachings: "Other Teachings",
      prayerRequests: "Prayer Requests",
      contact: "Contact",
      newsletter: "Newsletter",
      appointmentLay: "Appointment · Lay",
      appointmentClergy: "Appointment · Clergy",
    },

    panel: {
      aboutEyebrow: "About His Grace",
      aboutTitle: "A Life in the Lord's Vineyard",
      aboutLead: "Shepherd, teacher, and servant of the Church of Onitsha.",
      libraryEyebrow: "The Library",
      libraryTitle: "Pastoral Letters",
      libraryLead:
        "Twenty-four years of teaching — the annual letters of His Grace.",
      libraryBrowse: "Browse all letters →",
      reflectionsEyebrow: "Homilies & Reflections",
      reflectionsTitle: "Spoken from the Cathedra",
      reflectionsLead: "Homilies at solemnities, feasts, and ordinary time.",
      reflectionsBrowse: "Browse all reflections →",
      connectEyebrow: "Domus Episcopalis",
      connectTitle: "Connect with His Grace",
      connectLead:
        "Correspondence, prayer intentions, and quiet communion.",
    },

    cta: {
      readInFull: "Read in Full →",
      readTheLetter: "Read the Letter →",
      readTheTeaching: "Read the Teaching →",
      readTheReflection: "Read the Reflection →",
      open: "Open →",
      downloadPdf: "Download PDF",
      browseAll: "Browse all",
      backTo: "Back to",
      submit: "Send",
      sending: "Sending…",
      learnMore: "Learn more",
    },

    pages: {
      biography: {
        eyebrow: "About His Grace",
        title: "A Life in the",
        titleAccent: "Lord's Vineyard",
        lead: "Shepherd, teacher, and servant of the Church of Onitsha — a ministry formed by scripture, prayer, and the lived faith of his people.",
      },
      hisEpiscopacy: {
        eyebrow: "His Episcopacy",
        title: "The Missionary",
        titleAccent: "Apostolate",
        lead: "Education, prison ministry, and riverine evangelisation across the Archdiocese of Onitsha.",
      },
      coatOfArms: {
        eyebrow: "His Heraldry",
        title: "The Coat",
        titleAccent: "of Arms",
        lead: "The Good Shepherd and the episcopal motto — Ut Vitam Habeant.",
      },
      photoGallery: {
        eyebrow: "Pastoral Archive",
        title: "Photo",
        titleAccent: "Gallery",
        lead: "Feasts, visitations, and the daily life of the Metropolitan See.",
      },
      pastoralLetters: {
        eyebrow: "The Library",
        title: "Pastoral",
        titleAccent: "Letters",
        lead: "Over twenty years of teaching and shepherding the faithful of the Archdiocese — a living archive of pastoral wisdom.",
      },
      reflections: {
        eyebrow: "Homilies & Reflections",
        title: "Spoken from the",
        titleAccent: "Cathedra",
        lead: "Homilies at solemnities, feasts, and ordinary time — the living voice of His Grace.",
      },
      messages: {
        eyebrow: "Easter & Christmas",
        title: "Seasonal",
        titleAccent: "Messages",
        lead: "Pastoral greetings to the Archdiocese for the great solemnities of the Church year.",
      },
      otherTeachings: {
        eyebrow: "Writings & Addresses",
        title: "Other",
        titleAccent: "Teachings",
        lead: "Lectures, conference addresses, essays, and occasional writings beyond the formal pastoral letters.",
      },
      diary: {
        eyebrow: "The Pastoral Diary",
        title: "Engagements",
        titleAccent: "& Visits",
        lead: "Masses, ordinations, and pastoral visits as the liturgical year unfolds.",
      },
      pastoralVisits: {
        eyebrow: "Among the People of God",
        title: "Pastoral",
        titleAccent: "Visits",
        lead: "A visual record of His Grace's visits to parishes, schools, and apostolic communities.",
      },
      appointments: {
        eyebrow: "Audience with His Grace",
        title: "Book an",
        titleAccent: "Appointment",
        lead: "Tuesdays for the lay faithful, Wednesdays for priests and religious — choose a thirty-minute window in the office of the Archbishop.",
      },
      connect: {
        eyebrow: "Domus Episcopalis",
        title: "Connect with",
        titleAccent: "His Grace",
        lead: "Correspondence, prayer intentions, and quiet communion with the Office of His Grace.",
      },
    },

    empty: {
      pastoralLettersTitle: "The library is briefly unavailable",
      pastoralLettersBody:
        "Pastoral letters will return shortly. Please check back in a few minutes.",
      reflectionsTitle: "Reflections will return shortly",
      reflectionsBody:
        "The archive is briefly unavailable. Please check back in a few minutes.",
      messagesTitle: "Messages will return shortly",
      messagesBody:
        "The archive is briefly unavailable. Please check back in a few minutes.",
      writingsTitle: "Writings will return shortly",
      writingsBody:
        "The archive is briefly unavailable. Please check back in a few minutes.",
      galleryTitle: "The gallery is briefly unavailable",
      galleryBody: "Please check back in a few minutes.",
    },

    footer: {
      libraryHeading: "Library",
      hisGraceHeading: "His Grace",
      connectHeading: "Connect",
      motto:
        "“Ut Vitam Habeant — that they may have life, and have it more abundantly.” · John 10:10",
      archbishopOfOnitsha: "Archbishop of Onitsha",
      copyrightSuffix: "· The Office of His Grace",
      domus: "Domus Episcopalis · Onitsha · Anambra · Nigeria",
    },

    confirmations: {
      contact: {
        subject: "Your letter has reached us",
        bodyTemplate:
          "Dear {name},\n\nYour letter regarding \"{subject}\" has reached the Office of His Grace.\n\nEach correspondence sent to this house is read and ordered for response. If the matter calls for the Archbishop's own pen, His Grace will write in his time; if it is for the Chancery, you will hear from us in due course.\n\nBe assured of our prayers.\n\nPax tecum,\nThe Office of the Archbishop of Onitsha",
      },
      prayer: {
        subject: "Your intention has been received",
        bodyTemplate:
          "Dear {name},\n\nYour intention has been received and added to those read at the altar of the Basilica of the Most Holy Trinity, Onitsha, where Mass is offered each day for the people of this Archdiocese.\n\nWhat you have asked, the Lord — who looks upon the heart and not upon the multitude of words — has already heard. The Church only adds her voice to yours.\n\nIn Christo,\nThe Office of the Archbishop of Onitsha",
      },
      newsletter: {
        subject: "Welcome — letters from the Office of His Grace",
        bodyTemplate:
          "Dear {name},\n\nYou are now on the list to receive pastoral letters, reflections, and seasonal messages from this office.\n\nLetters arrive a few times a month, never more, and only when there is something to say. The list is kept here at the Domus Episcopalis and is not shared with anyone. To leave it at any time, write to admin@archbishopvalokeke.org with the subject \"Unsubscribe\"; this is honoured at once.\n\nUntil the next letter, the Lord be with you.\n\nThe Office of the Archbishop of Onitsha",
      },
    },

    letter: {
      contents: "Contents",
      readingLabel: "Reading",
      minRead: "min read",
      pdfNewTabHint: "(opens in a new tab, PDF)",
      continueReading: "Continue reading",
      previousLetter: "Previous letter",
      nextLetter: "Next letter",
      allLetters: "All Pastoral Letters",
      fullTextUnavailableTitle: "The full text isn't available yet",
      fullTextUnavailableBody:
        "This letter's body is being prepared for the Library. The original PDF is available below, and the full archive is one click away.",
    },
  },

  ig: {
    brandTagline: "Onyenwe Onye Isi Bishọp nke Onitsha",
    langToggleLabel: "Asụsụ",
    langName: { en: "Bekee", ig: "Igbo" },
    openMenu: "Mepee menu",
    closeMenu: "Mechie menu",
    primaryNav: "Isi nchịkọta",
    bodyEnglishNotice:
      "Akụkọ a dị naanị n'asụsụ Bekee ugbu a. Nsụgharị Igbo ga-abịa mgbe Ụlọ Ọrụ Ọdaa nyekwasịrị ya isi.",

    nav: {
      aboutHisGrace: "Banyere Ọdaa",
      aboutHisGraceShort: "Banyere",
      pastoralLetters: "Akwụkwọ Ozi Ọchịchị",
      pastoralLettersShort: "Akwụkwọ Ozi",
      reflections: "Ntụgharị Uche",
      diary: "Akwụkwọ Akụkọ Ụbọchị",
      appointments: "Mkpebi Ihu",
      appointmentsShort: "Ihu",
      connect: "Kparịta Ụka",

      biography: "Akụkọ Ndụ",
      hisEpiscopacy: "Ọrụ Onye Isi Bishọp Ya",
      coatOfArms: "Akara Aka Ya",
      photoGallery: "Foto",
      pastoralDiary: "Akwụkwọ Ọrụ Ọchịchị",
      pastoralVisits: "Nleta Ọchịchị",
      reflectionsAndHomilies: "Ntụgharị Uche & Ozi Chinẹke",
      easterAndChristmasMessages: "Ozi Ista & Krismas",
      otherTeachings: "Nkuzi Ndị Ọzọ",
      prayerRequests: "Arịrịọ Ekpere",
      contact: "Kpọtụrụ",
      newsletter: "Akwụkwọ Akụkọ",
      appointmentLay: "Ihu · Ndị Otu",
      appointmentClergy: "Ihu · Ndị Ụkọchukwu",
    },

    panel: {
      aboutEyebrow: "Banyere Ọdaa",
      aboutTitle: "Ndụ N'Ubi Vine Onyenwe Anyị",
      aboutLead: "Onye Ọzụzụ Atụrụ, onye nkuzi, na ohu nke Chọọchị Onitsha.",
      libraryEyebrow: "Ụlọ Akwụkwọ",
      libraryTitle: "Akwụkwọ Ozi Ọchịchị",
      libraryLead:
        "Iri afọ abụọ na anọ nke nkuzi — akwụkwọ ozi kwa afọ nke Ọdaa.",
      libraryBrowse: "Lelee akwụkwọ ozi niile →",
      reflectionsEyebrow: "Ozi Chinẹke & Ntụgharị Uche",
      reflectionsTitle: "Site n'Ocheeze Bishọp",
      reflectionsLead:
        "Ozi Chinẹke n'oge ememme, ụbọchị nsọ, na oge nkịtị.",
      reflectionsBrowse: "Lelee ntụgharị uche niile →",
      connectEyebrow: "Domus Episcopalis",
      connectTitle: "Kparịta Ụka na Ọdaa",
      connectLead:
        "Edemede, ekpere, na nkparịta ụka dị jụụ.",
    },

    cta: {
      readInFull: "Gụọ na zuru ezu →",
      readTheLetter: "Gụọ Akwụkwọ Ozi a →",
      readTheTeaching: "Gụọ Nkuzi a →",
      readTheReflection: "Gụọ Ntụgharị Uche a →",
      open: "Mepee →",
      downloadPdf: "Budata PDF",
      browseAll: "Lelee niile",
      backTo: "Laghachi",
      submit: "Zipu",
      sending: "Na-ezipu…",
      learnMore: "Mata karịa",
    },

    pages: {
      biography: {
        eyebrow: "Banyere Ọdaa",
        title: "Ndụ N'Ubi Vine",
        titleAccent: "Onyenwe Anyị",
        lead: "Onye ọzụzụ atụrụ, onye nkuzi, na ohu nke Chọọchị Onitsha — ọrụ nke Akwụkwọ Nsọ, ekpere, na okwukwe ndị nke ya guzobere.",
      },
      hisEpiscopacy: {
        eyebrow: "Ọrụ Onye Isi Bishọp Ya",
        title: "Ọrụ",
        titleAccent: "Ozi Ọma",
        lead: "Mmụta, ozi mkpọrọ, na izisa ozi ọma n'akụkụ osimiri n'Archdiocese Onitsha.",
      },
      coatOfArms: {
        eyebrow: "Akara Ya",
        title: "Akara",
        titleAccent: "Aka Ya",
        lead: "Ezi Onye Ọzụzụ Atụrụ na okwu nke ọchịchị bishọp — Ut Vitam Habeant.",
      },
      photoGallery: {
        eyebrow: "Akwụkwọ Akụkọ Ọchịchị",
        title: "Foto",
        titleAccent: "Niile",
        lead: "Ememme, nleta, na ndụ kwa ụbọchị nke Ocheeze Onye Isi.",
      },
      pastoralLetters: {
        eyebrow: "Ụlọ Akwụkwọ",
        title: "Akwụkwọ",
        titleAccent: "Ozi Ọchịchị",
        lead: "Ihe karịrị afọ iri abụọ nke nkuzi na ọzụzụ atụrụ ndị kwere ekwe na Archdiocese — akwụkwọ akụkọ ndụ nke amamihe ọchịchị.",
      },
      reflections: {
        eyebrow: "Ozi Chinẹke & Ntụgharị Uche",
        title: "Site n'",
        titleAccent: "Ocheeze Bishọp",
        lead: "Ozi Chinẹke n'oge ememme, ụbọchị nsọ, na oge nkịtị — olu Ọdaa nke dị ndụ.",
      },
      messages: {
        eyebrow: "Ista & Krismas",
        title: "Ozi",
        titleAccent: "Oge",
        lead: "Ekele ọchịchị nyere Archdiocese maka oge ememme ụka kachasị ukwuu.",
      },
      otherTeachings: {
        eyebrow: "Akwụkwọ & Okwu",
        title: "Nkuzi",
        titleAccent: "Ndị Ọzọ",
        lead: "Nkuzi, okwu nzukọ, edemede, na ihe ndị ọzọ ọ deere e wezụga akwụkwọ ozi ọchịchị.",
      },
      diary: {
        eyebrow: "Akwụkwọ Ọrụ Ọchịchị",
        title: "Ọrụ",
        titleAccent: "& Nleta",
        lead: "Mass, ịchụaja, na nleta ọchịchị ka oge ụka na-aga n'ihu.",
      },
      pastoralVisits: {
        eyebrow: "Etiti Ndị Nke Chineke",
        title: "Nleta",
        titleAccent: "Ọchịchị",
        lead: "Akụkọ foto nke nleta Ọdaa n'ụlọ ụka, ụlọ akwụkwọ, na obodo Apọsụl.",
      },
      appointments: {
        eyebrow: "Ihu na Ọdaa",
        title: "Họrọ Oge",
        titleAccent: "Ihu",
        lead: "Tuesday maka ndị otu, Wednesday maka ndị ụkọchukwu na ndị nzọcha — họrọ oge nkeji iri atọ n'ụlọ ọrụ Onye Isi Bishọp.",
      },
      connect: {
        eyebrow: "Domus Episcopalis",
        title: "Kparịta Ụka na",
        titleAccent: "Ọdaa",
        lead: "Edemede, arịrịọ ekpere, na nkparịta ụka dị jụụ na Ụlọ Ọrụ Ọdaa.",
      },
    },

    empty: {
      pastoralLettersTitle: "Ụlọ akwụkwọ adịghị nwa oge",
      pastoralLettersBody:
        "Akwụkwọ ozi ọchịchị ga-alaghachi n'oge na-adịghị anya. Biko bịaghachi nkeji ole na ole.",
      reflectionsTitle: "Ntụgharị uche ga-alaghachi n'oge na-adịghị anya",
      reflectionsBody:
        "Akwụkwọ akụkọ adịghị nwa oge. Biko bịaghachi nkeji ole na ole.",
      messagesTitle: "Ozi ga-alaghachi n'oge na-adịghị anya",
      messagesBody:
        "Akwụkwọ akụkọ adịghị nwa oge. Biko bịaghachi nkeji ole na ole.",
      writingsTitle: "Akwụkwọ ga-alaghachi n'oge na-adịghị anya",
      writingsBody:
        "Akwụkwọ akụkọ adịghị nwa oge. Biko bịaghachi nkeji ole na ole.",
      galleryTitle: "Foto adịghị nwa oge",
      galleryBody: "Biko bịaghachi nkeji ole na ole.",
    },

    footer: {
      libraryHeading: "Ụlọ Akwụkwọ",
      hisGraceHeading: "Ọdaa",
      connectHeading: "Kparịta Ụka",
      motto:
        "“Ut Vitam Habeant — ka ha nwee ndụ, ka ha nweekwa ya n'ụba.” · Jọn 10:10",
      archbishopOfOnitsha: "Onye Isi Bishọp nke Onitsha",
      copyrightSuffix: "· Ụlọ Ọrụ Ọdaa",
      domus: "Domus Episcopalis · Onicha · Anambra · Nigeria",
    },

    confirmations: {
      contact: {
        subject: "Akwụkwọ ozi gị eruola n'aka anyị",
        bodyTemplate:
          "Ezigbo {name},\n\nAkwụkwọ ozi gị banyere \"{subject}\" eruola n'Ụlọ Ọrụ Ọdaa.\n\nA na-agụ ozi ọ bụla na-erute ụlọ a ma debe ya maka ọzịza. Ọ bụrụ na okwu ahụ na-akpọ Ọdaa n'onwe ya idere, ọ ga-edere n'oge ya; ọ bụrụ na ọ bụ maka Ụlọ Ọrụ Ọchịchị, ị ga-anụ n'aka anyị mgbe oge ruru.\n\nCheta na anyị na-ekpere maka gị.\n\nPax tecum,\nỤlọ Ọrụ Onye Isi Bishọp nke Onitsha",
      },
      prayer: {
        subject: "Anatala arịrịọ gị",
        bodyTemplate:
          "Ezigbo {name},\n\nAnatala arịrịọ gị ma tinye ya na ndị a na-agụ n'ebe ịchụ àjà nke Bazilika nke Atọ N'Otu Kachasị Nsọ, Onicha, ebe a na-eme Mass kwa ụbọchị maka ndị nke Archdiocese a.\n\nIhe ị rịọrọ, Onyenwe anyị — onye na-elele obi ọ bụghị ọtụtụ okwu — anụlarị. Ụka na-atụkwasị olu nke ya na nke gị.\n\nIn Christo,\nỤlọ Ọrụ Onye Isi Bishọp nke Onitsha",
      },
      newsletter: {
        subject: "Nnọọ — akwụkwọ ozi sitere n'Ụlọ Ọrụ Ọdaa",
        bodyTemplate:
          "Ezigbo {name},\n\nE debanyere aha gị ka ị nata akwụkwọ ozi ọchịchị, ntụgharị uche, na ozi mgbe ụfọdụ sitere n'ụlọ ọrụ a.\n\nAkwụkwọ ozi na-abịa ugboro ole na ole n'ọnwa, ọ dịghị karịa, naanị mgbe e nwere ihe a ga-ekwu. Ndepụta a debere n'Ụlọ Ọrụ Ọdaa, ọ bụghị ihe a na-ekekọrịta. Iji wepụ aha gị mgbe ọ bụla, dee admin@archbishopvalokeke.org jiri isiokwu \"Unsubscribe\"; a na-asọpụrụ ya ozugbo.\n\nRuo akwụkwọ ozi na-esote, ka Onyenwe anyị nọnyere gị.\n\nỤlọ Ọrụ Onye Isi Bishọp nke Onitsha",
      },
    },

    letter: {
      contents: "Ihe dị n'ime",
      readingLabel: "Ọgụgụ",
      minRead: "nkeji ọgụgụ",
      pdfNewTabHint: "(mepee na windo ọhụrụ, PDF)",
      continueReading: "Gaa n'ihu n'ọgụgụ",
      previousLetter: "Akwụkwọ gara aga",
      nextLetter: "Akwụkwọ na-esote",
      allLetters: "Akwụkwọ Ozi Ọchịchị Niile",
      fullTextUnavailableTitle: "Ederede zuru ezu adịghị ugbu a",
      fullTextUnavailableBody:
        "A na-akwadebe ozi a maka Ụlọ Akwụkwọ. Akwụkwọ PDF mbụ dị n'okpuru, ụlọ akwụkwọ niile dịkwa otu mpịaka.",
    },
  },
};

export function getDict(lang: Lang): Dict {
  return dict[lang] ?? dict.en;
}
