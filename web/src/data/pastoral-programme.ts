export type ProgrammeCategory =
  | "Mass"
  | "Pastoral Visit"
  | "Meeting"
  | "Ordination"
  | "Retreat"
  | "Special";

export type ProgrammeEntry = {
  id: string;
  start: string;
  end?: string;
  title: string;
  location?: string;
  description?: string;
  category: ProgrammeCategory;
};

export const PROGRAMME_YEAR = 2026;

export const PROGRAMME_ENTRIES: ProgrammeEntry[] = [
  // ── November 2025 ──────────────────────────────────────────────
  { id: "2025-11-30-holy-trinity-awada", start: "2025-11-30", title: "Holy Trinity Awada — Pastoral Visit", location: "Holy Trinity Awada", description: "Pastoral visit — First Sunday of Advent.", category: "Pastoral Visit" },
  { id: "2025-11-30-ciwa-collection", start: "2025-11-30", title: "CIWA Collection", description: "Catholic Institute of West Africa collection for the diocese.", category: "Special" },
  { id: "2025-11-30-140-missionaries", start: "2025-11-30", title: "140 Years of the Arrival of the Missionaries", description: "Commemorating 140 years of the arrival of the missionaries.", category: "Special" },
  { id: "2025-11-30-silver-jubilee", start: "2025-11-30", title: "Silver Jubilee Celebration", description: "Silver Jubilee celebration.", category: "Special" },
  { id: "2025-11-30-50-years-bss", start: "2025-11-30", title: "50 Years of BSS", description: "50 Years of BSS celebration.", category: "Special" },
  { id: "2025-11-30-diaconate-ordination", start: "2025-11-30", title: "Diaconate Ordination", description: "Ordination to the diaconate.", category: "Ordination" },

  // ── December 2025 ──────────────────────────────────────────────
  { id: "2025-12-07-st-marys-onitsha", start: "2025-12-07", title: "St Mary's Parish Onitsha — Pastoral Visit", location: "St Mary's Parish Onitsha", description: "Pastoral Visit — Second Sunday of Advent.", category: "Pastoral Visit" },
  { id: "2025-12-07-hospital-visitation", start: "2025-12-07", title: "Hospital Visitation", description: "Hospital Visitation during the Advent week.", category: "Pastoral Visit" },
  { id: "2025-12-07-ihm-10am", start: "2025-12-07", title: "A Day with the IHM", description: "A day with the IHM Sisters at 10am.", category: "Special" },
  { id: "2025-12-08-immaculate-conception", start: "2025-12-08", title: "Immaculate Conception of the Blessed Virgin Mary", description: "Solemnity — Holy Day of Obligation.", category: "Mass" },
  { id: "2025-12-14-immaculate-conception-parish", start: "2025-12-14", title: "Immaculate Conception Parish Onitsha — Pastoral Visit", location: "Immaculate Conception Parish Onitsha", description: "Pastoral Visit — Third Sunday of Advent.", category: "Pastoral Visit" },
  { id: "2025-12-15-hospital-visitation", start: "2025-12-15", title: "Hospital Visitation", description: "Hospital Visitation.", category: "Pastoral Visit" },
  { id: "2025-12-17-hospital-visitation", start: "2025-12-17", title: "Hospital Visitation", description: "Hospital Visitation.", category: "Pastoral Visit" },
  { id: "2025-12-19-hospital-visitation", start: "2025-12-19", title: "Hospital Visitation", description: "Hospital Visitation.", category: "Pastoral Visit" },
  { id: "2025-12-20-installations", start: "2025-12-20", title: "Installations", description: "Installations ceremony — Third Advent week.", category: "Special" },
  { id: "2025-12-21-st-valerian-akpaka", start: "2025-12-21", title: "St Valerian Akpaka — Pastoral Visit", location: "St Valerian Akpaka", description: "Pastoral Visit — Fourth Sunday of Advent.", category: "Pastoral Visit" },
  { id: "2025-12-25-christmas-mass", start: "2025-12-25", title: "Christmas Mass — Holy Trinity Basilica & Onitsha Prison", location: "Holy Trinity Basilica, Onitsha · Onitsha Prison", description: "Christmas Day Mass at Holy Trinity Basilica and Onitsha Prison.", category: "Mass" },
  { id: "2025-12-28-holy-family-tansi", start: "2025-12-28", title: "Holy Family — Blessed Tansi Parish Umudioka", location: "Blessed Tansi Parish Umudioka", description: "Holy Family Sunday Mass at Blessed Tansi Parish Umudioka.", category: "Mass" },

  // ── January 2026 ───────────────────────────────────────────────
  { id: "2026-01-04-st-anthony-nnokwa", start: "2026-01-04", title: "St Anthony's Parish Nnokwa — Handover & Dedication", location: "St Anthony's Parish Nnokwa", description: "Handover and Dedication at St Anthony's Parish Nnokwa at 10am.", category: "Special" },
  { id: "2026-01-04-bot-shanahan", start: "2026-01-04", title: "BOT — Shanahan University", description: "Board of Trustees meeting — Shanahan University.", category: "Meeting" },
  { id: "2026-01-04-akpunonu-60th", start: "2026-01-04", title: "60th Anniversary of Priestly Ordination — Fr Prof P.D. Akpunonu", location: "Blessed Michael Iwene Tansi Major Seminary, Onitsha", description: "60th Anniversary of Priestly Ordination for Rev. Fr Prof P.D. Akpunonu.", category: "Special" },
  { id: "2026-01-11-baptism-of-the-lord", start: "2026-01-11", title: "Baptism of the Lord", description: "Feast of the Baptism of the Lord.", category: "Mass" },
  { id: "2026-01-17-nnewi-cathedral", start: "2026-01-17", title: "O.E.P. & Cathedral Dedication — Nnewi", location: "Nnewi Cathedral", description: "O.E.P. and Cathedral Dedication at Nnewi — Feast of St Anthony Abbot (Saturday).", category: "Special" },
  { id: "2026-01-18-ss-john-paul", start: "2026-01-18", title: "SS. John & Paul Parish — Iba-Pope Awada", location: "SS. John & Paul Parish, Iba-Pope, Awada", description: "Sunday Mass — Second Sunday in Ordinary Time.", category: "Mass" },
  { id: "2026-01-18-regnum-christi", start: "2026-01-18", title: "Regnum Christi", description: "Regnum Christi event.", category: "Special" },

  // ── February 2026 ──────────────────────────────────────────────
  { id: "2026-02-01-day-with-religious", start: "2026-02-01", title: "A Day with the Religious", description: "A Day with the Religious — Fourth Sunday in Ordinary Time.", category: "Special" },
  { id: "2026-02-01-hca-collection", start: "2026-02-01", title: "Holy Childhood (HCA) Collection", description: "H.C.A. (Holy Childhood Association) collection.", category: "Special" },
  { id: "2026-02-08-24th-episcopal", start: "2026-02-08", title: "24th Episcopal Anniversary — Thanksgiving Mass", description: "24th Episcopal Anniversary — Thanksgiving Mass celebrated in all parishes.", category: "Mass" },
  { id: "2026-02-08-religious-collection", start: "2026-02-08", title: "Collection for the Religious", description: "Collection for the Religious.", category: "Special" },
  { id: "2026-02-15-ss-john-paul", start: "2026-02-15", title: "SS. John & Paul Parish — Iba-Pope Awada Mass", location: "SS. John & Paul Parish, Iba-Pope, Awada", description: "Mass — Sixth Sunday in Ordinary Time.", category: "Mass" },
  { id: "2026-02-15-regnum-christi", start: "2026-02-15", title: "Regnum Christi", description: "Regnum Christi event.", category: "Special" },
  { id: "2026-02-15-lenten-charity-begins", start: "2026-02-15", title: "Lenten Charity Fund — Collection Begins", description: "Lenten Charity Fund collection begins.", category: "Special" },
  { id: "2026-02-17-cbcn-abuja", start: "2026-02-17", end: "2026-02-28", title: "CBCN Meeting — Abuja", location: "Abuja", description: "Catholic Bishops' Conference of Nigeria (CBCN) meeting in Abuja.", category: "Meeting" },
  { id: "2026-02-18-ash-wednesday", start: "2026-02-18", title: "Ash Wednesday", description: "Ash Wednesday — begin Lenten preparation. Day of fast (ages 18–59) and abstinence from meat (age 14+). Not a holy day of obligation.", category: "Special" },

  // ── March 2026 ─────────────────────────────────────────────────
  { id: "2026-03-01-st-dominic-abatete", start: "2026-03-01", title: "St Dominic's Parish Abatete — Pastoral Visit", location: "St Dominic's Parish Abatete", description: "Pastoral Visit — Second Sunday of Lent.", category: "Pastoral Visit" },
  { id: "2026-03-01-lenten-charity", start: "2026-03-01", title: "Lenten Charity Fund Collection", description: "Lenten Charity Fund collection.", category: "Special" },
  { id: "2026-03-08-holy-trinity-ogidi", start: "2026-03-08", title: "Holy Trinity Ogidi", location: "Holy Trinity Ogidi", description: "Visit to Holy Trinity Ogidi — Third Sunday of Lent.", category: "Pastoral Visit" },
  { id: "2026-03-08-laity-week", start: "2026-03-08", title: "Laity Week Collections", description: "Laity Week collections.", category: "Special" },
  { id: "2026-03-09-ad-limina", start: "2026-03-09", end: "2026-03-21", title: "Ad Limina Apostolorum", location: "Rome", description: "Ad Limina Apostolorum — Bishops' visit to Rome.", category: "Special" },
  { id: "2026-03-15-pastoral-council", start: "2026-03-15", title: "Pastoral Council", description: "Pastoral Council meeting.", category: "Meeting" },
  { id: "2026-03-19-st-joseph-seminary-awka-etiti", start: "2026-03-19", title: "St Joseph Special Science Seminary Awka-Etiti", location: "St Joseph Special Science Seminary Awka-Etiti", description: "Visit to St Joseph Special Science Seminary Awka-Etiti — Feast of St Joseph.", category: "Pastoral Visit" },
  { id: "2026-03-22-st-joseph-odoakpu", start: "2026-03-22", title: "St Joseph's Parish Odoakpu — Pastoral Visit", location: "St Joseph's Parish Odoakpu", description: "Pastoral Visit — Fifth Sunday of Lent.", category: "Pastoral Visit" },
  { id: "2026-03-22-lenten-charity-2", start: "2026-03-22", title: "Lenten Charity Fund Collection", description: "Lenten Charity Fund collection.", category: "Special" },
  { id: "2026-03-22-national-emergency", start: "2026-03-22", title: "National Emergency Fund Collection", description: "National Emergency Fund collection.", category: "Special" },
  { id: "2026-03-26-chrism-nnobi", start: "2026-03-26", title: "Chrism Mass & Cathedraticum — Nnobi", location: "Nnobi", description: "Chrism Mass and Cathedraticum at Nnobi.", category: "Mass" },
  { id: "2026-03-27-chrism-dunukofia", start: "2026-03-27", title: "Chrism Mass & Cathedraticum — Dunukofia", location: "Dunukofia", description: "Chrism Mass and Cathedraticum at Dunukofia.", category: "Mass" },
  { id: "2026-03-29-passion-sunday", start: "2026-03-29", title: "Passion Sunday Mass — Basilica", location: "Basilica, Onitsha", description: "Palm Sunday Procession and Mass at the Basilica.", category: "Mass" },
  { id: "2026-03-29-holy-land-collections", start: "2026-03-29", title: "Holy Land Collections", description: "Holy Land Collections — Palm Sunday.", category: "Special" },

  // ── April 2026 ─────────────────────────────────────────────────
  { id: "2026-04-02-chrism-iyiowa", start: "2026-04-02", title: "Chrism Mass & Cathedraticum — Iyiowa-Odekpe", location: "Iyiowa-Odekpe", description: "Chrism Mass and Cathedraticum — Holy Thursday.", category: "Mass" },
  { id: "2026-04-02-holy-thursday", start: "2026-04-02", title: "Holy Thursday — Mass of the Lord's Supper", description: "Evening Mass of the Lord's Supper; begin Easter Triduum.", category: "Mass" },
  { id: "2026-04-03-good-friday", start: "2026-04-03", title: "Good Friday — Celebration of the Lord's Passion", description: "Good Friday — Mass not celebrated. Day of fast and abstinence. Celebration of the Lord's Passion.", category: "Special" },
  { id: "2026-04-04-holy-saturday", start: "2026-04-04", title: "Holy Saturday — Easter Vigil", description: "Holy Saturday — Easter Vigil Mass (Easter Sunday Mass).", category: "Mass" },
  { id: "2026-04-05-easter-sunday", start: "2026-04-05", title: "Easter Sunday — Basilica & Prison", location: "Basilica, Onitsha · Onitsha Prison", description: "Easter Sunday Mass at the Basilica and Onitsha Prison.", category: "Mass" },
  { id: "2026-04-05-monastery-umuoji-25", start: "2026-04-05", title: "Monastery Umuoji — 25th Anniversary & Professions", location: "Monastery Umuoji", description: "Monastery Umuoji 25th Anniversary — Final Profession and Simple Profession.", category: "Special" },
  { id: "2026-04-05-youth-weekend", start: "2026-04-05", title: "Youth Weekend", description: "Youth Weekend.", category: "Special" },
  { id: "2026-04-12-divine-mercy", start: "2026-04-12", title: "Divine Mercy Sunday — Second Sunday of Easter", description: "Divine Mercy Sunday; Youth Mass; Low Sunday collections.", category: "Mass" },
  { id: "2026-04-12-monastery-umuoji-visit", start: "2026-04-12", title: "Monastery Umuoji Visit", location: "Monastery Umuoji", description: "Visit to Monastery Umuoji.", category: "Pastoral Visit" },
  { id: "2026-04-19-st-paul-ideani", start: "2026-04-19", title: "St Paul's Parish Ideani — Blessing of a Chapel", location: "St Paul's Parish Ideani", description: "Blessing of a Chapel — Third Sunday of Easter.", category: "Special" },
  { id: "2026-04-26-college-chapel", start: "2026-04-26", title: "Dedication of College Chapel", description: "Dedication of College Chapel.", category: "Special" },
  { id: "2026-04-26-marian-rosary", start: "2026-04-26", title: "Marian Rosary Celebration", description: "Marian Rosary Celebration.", category: "Special" },
  { id: "2026-04-26-good-shepherd", start: "2026-04-26", title: "Good Shepherd / Vocation Sunday", description: "Good Shepherd Sunday — Fourth Sunday of Easter; St Peter the Apostle (Vocation Sunday).", category: "Mass" },
  { id: "2026-04-26-regina-caeli-umuoji", start: "2026-04-26", title: "Regina Caeli — Umuoji", location: "Umuoji", description: "Regina Caeli celebration at Umuoji.", category: "Mass" },

  // ── May 2026 ───────────────────────────────────────────────────
  { id: "2026-05-10-st-peter-nnokwa", start: "2026-05-10", title: "St Peter's Parish Nnokwa — Pastoral Visit", location: "St Peter's Parish Nnokwa", description: "Pastoral Visit — Sixth Sunday of Easter.", category: "Pastoral Visit" },
  { id: "2026-05-10-oep-formators", start: "2026-05-10", title: "O.E.P. & Seminary Formators Meeting", description: "O.E.P. and Seminary Formators meeting.", category: "Meeting" },
  { id: "2026-05-10-ahs-onitsha", start: "2026-05-10", title: "All Hallows Seminary Onitsha", location: "All Hallows Seminary, Onitsha", description: "Event at All Hallows Seminary Onitsha.", category: "Pastoral Visit" },
  { id: "2026-05-10-st-kizito", start: "2026-05-10", title: "St Kizito Girls Secondary School Umudioka", location: "St Kizito Girls Secondary School, Umudioka", description: "Visit to St Kizito Girls Secondary School Umudioka.", category: "Pastoral Visit" },
  { id: "2026-05-17-ascension", start: "2026-05-17", title: "Ascension of the Lord", description: "Ascension of the Lord — Solemnity; Seventh Sunday of Easter.", category: "Mass" },
  { id: "2026-05-17-st-pius-investiture", start: "2026-05-17", title: "St Pius X Seminary Akwu-Ukwu — Investiture", location: "St Pius X Seminary, Akwu-Ukwu", description: "Investiture at St Pius X Seminary Akwu-Ukwu.", category: "Special" },
  { id: "2026-05-17-social-communication", start: "2026-05-17", title: "World Day of Social Communication Collections", description: "World Day of Social Communication collections.", category: "Special" },
  { id: "2026-05-18-cbcn-retreat", start: "2026-05-18", end: "2026-05-23", title: "CBCN Bishops' Retreat", description: "CBCN Bishops' Retreat.", category: "Retreat" },
  { id: "2026-05-24-holy-spirit-ogidi", start: "2026-05-24", title: "Holy Spirit Parish Ogidi — Church Dedication", location: "Holy Spirit Parish Ogidi", description: "Church Dedication at Holy Spirit Parish Ogidi — Pentecost Sunday.", category: "Special" },
  { id: "2026-05-24-sacred-heart-odoakpu", start: "2026-05-24", title: "Sacred Heart Parish Odoakpu", location: "Sacred Heart Parish Odoakpu", description: "Event at Sacred Heart Parish Odoakpu.", category: "Pastoral Visit" },
  { id: "2026-05-31-holy-trinity-sunday", start: "2026-05-31", title: "Holy Trinity Sunday — Basilica", location: "Basilica, Onitsha", description: "Mass at the Basilica — Holy Trinity Sunday.", category: "Mass" },

  // ── June 2026 ──────────────────────────────────────────────────
  { id: "2026-06-01-admin-board", start: "2026-06-01", end: "2026-06-03", title: "Admin Board Meeting", description: "Diocesan Admin Board Meeting.", category: "Meeting" },
  { id: "2026-06-01-shanahan-day", start: "2026-06-01", title: "Shanahan Day", description: "Shanahan Day celebration.", category: "Special" },
  { id: "2026-06-07-corpus-christi", start: "2026-06-07", title: "Corpus Christi Sunday — Archdiocesan Project Sunday", description: "Body and Blood of Christ; Archdiocesan Project Sunday collection.", category: "Mass" },
  { id: "2026-06-28-peters-pence", start: "2026-06-28", title: "Peter's Pence Collection", description: "Peter's Pence Collection — around Feast of SS Peter & Paul (Jun 29).", category: "Special" },
  { id: "2026-06-28-apostolic-work-begins", start: "2026-06-28", title: "Apostolic Work Begins", description: "Apostolic Work begins for the season.", category: "Special" },

  // ── July 2026 ──────────────────────────────────────────────────
  { id: "2026-07-11-priestly-ordination-45", start: "2026-07-11", title: "Priestly Ordination 2026 — 45th Anniversary of Archbishop Val", description: "Priestly Ordination 2026; 45th Priestly Anniversary of Archbishop Val — Feast of St Benedict.", category: "Ordination" },
  { id: "2026-07-12-holy-family-youth-village", start: "2026-07-12", title: "Holy Family Youth Village Awka", location: "Holy Family Youth Village, Awka", description: "Visit to Holy Family Youth Village Awka — Fourteenth Sunday.", category: "Pastoral Visit" },
  { id: "2026-07-13-priestly-retreat-1", start: "2026-07-13", end: "2026-07-17", title: "Priestly Retreat — Group 1", description: "Priestly Retreat for Group 1.", category: "Retreat" },
  { id: "2026-07-19-ckp-onitsha", start: "2026-07-19", title: "C.K.P. Onitsha", location: "Onitsha", description: "C.K.P. meeting at Onitsha — Sixteenth Sunday.", category: "Meeting" },
  { id: "2026-07-19-jdpc-week", start: "2026-07-19", title: "JDPC Week Collections", description: "JDPC Week collections.", category: "Special" },
  { id: "2026-07-20-priestly-retreat-2", start: "2026-07-20", end: "2026-07-24", title: "Priestly Retreat — Group 2", description: "Priestly Retreat for Group 2.", category: "Retreat" },
  { id: "2026-07-22-madonna-nnobi", start: "2026-07-22", title: "Madonna Parish Nnobi", location: "Madonna Parish Nnobi", description: "Visit to Madonna Parish Nnobi.", category: "Pastoral Visit" },
  { id: "2026-07-25-reunion", start: "2026-07-25", title: "Reunion", description: "Reunion.", category: "Special" },
  { id: "2026-07-26-st-michael-nkpor", start: "2026-07-26", title: "St Michael the Archangel Nkpor-Agu (Holy Land)", location: "St Michael the Archangel Parish, Nkpor-Agu", description: "Holy Land collection event — Seventeenth Sunday.", category: "Special" },
  { id: "2026-07-26-st-peter-umunnachi", start: "2026-07-26", title: "St Peter's Parish Umunnachi", location: "St Peter's Parish Umunnachi", description: "Mass / event at St Peter's Parish Umunnachi at 11am.", category: "Pastoral Visit" },

  // ── August 2026 ────────────────────────────────────────────────
  { id: "2026-08-02-st-gregory-iyiowa", start: "2026-08-02", title: "St Gregory the Great Parish Iyiowa-Odekpe", location: "St Gregory the Great Parish, Iyiowa-Odekpe", description: "Visit to St Gregory the Great Parish Iyiowa-Odekpe.", category: "Pastoral Visit" },
  { id: "2026-08-02-st-stephen-obosi", start: "2026-08-02", title: "St Stephen's Parish Obosi", location: "St Stephen's Parish Obosi", description: "Mass / event at St Stephen's Parish Obosi at 11am.", category: "Pastoral Visit" },
  { id: "2026-08-09-st-charles-borromeo", start: "2026-08-09", title: "St Charles Borromeo Parish Onitsha — Pastoral Visit", location: "St Charles Borromeo Parish, Onitsha", description: "Pastoral Visit — Nineteenth Sunday in Ordinary Time.", category: "Pastoral Visit" },
  { id: "2026-08-15-assumption", start: "2026-08-15", title: "Assumption of the Blessed Virgin Mary", description: "Assumption of the BVM — Solemnity. Note: no obligation to attend Mass this year.", category: "Mass" },
  { id: "2026-08-15-ihm-profession", start: "2026-08-15", title: "IHM Profession — Nkpor Novitiate", location: "Nkpor Novitiate", description: "IHM Profession at Nkpor Novitiate — Feast of the Assumption.", category: "Special" },
  { id: "2026-08-16-kristi-bu-chukwu", start: "2026-08-16", title: "Kristi bu Chukwu Parish Ogwu-Ikpele", location: "Kristi bu Chukwu Parish, Ogwu-Ikpele", description: "Visit to Kristi bu Chukwu Parish Ogwu-Ikpele.", category: "Pastoral Visit" },
  { id: "2026-08-16-arinze-lectures", start: "2026-08-16", title: "Cardinal Arinze Lectures", description: "Cardinal Arinze Lectures.", category: "Special" },
  { id: "2026-08-16-reunion", start: "2026-08-16", end: "2026-08-22", title: "Reunion", description: "Reunion (multiple days).", category: "Special" },
  { id: "2026-08-22-apostolic-work-ends", start: "2026-08-22", title: "Apostolic Work Ends", description: "Apostolic Work ends for the season.", category: "Special" },
  { id: "2026-08-23-family-week", start: "2026-08-23", end: "2026-08-29", title: "Family Week", description: "Family Week.", category: "Special" },
  { id: "2026-08-23-st-dominic-obosi", start: "2026-08-23", title: "St Dominic's Parish Obosi — Industrial Estate", location: "St Dominic's Parish Obosi Industrial Estate", description: "Visit to St Dominic's Parish Industrial Estate, Obosi.", category: "Pastoral Visit" },
  { id: "2026-08-23-st-joseph-umunnachi", start: "2026-08-23", title: "St Joseph's Parish Umunnachi", location: "St Joseph's Parish Umunnachi", description: "Visit to St Joseph's Parish Umunnachi.", category: "Pastoral Visit" },
  { id: "2026-08-30-family-week-2", start: "2026-08-30", end: "2026-09-05", title: "Family Week (continued)", description: "Family Week (continued).", category: "Special" },
  { id: "2026-08-30-st-gabriel-ogidi-ikenga", start: "2026-08-30", title: "St Gabriel the Archangel Parish Ogidi-Ikenga", location: "St Gabriel the Archangel Parish, Ogidi-Ikenga", description: "Visit to St Gabriel the Archangel Parish Ogidi-Ikenga.", category: "Pastoral Visit" },
  { id: "2026-08-30-ihm-final-profession", start: "2026-08-30", title: "Final Profession of IHM Sisters", description: "Final Profession of IHM Sisters.", category: "Special" },

  // ── September 2026 ─────────────────────────────────────────────
  { id: "2026-09-06-st-gabriel-umunnachi", start: "2026-09-06", title: "St Gabriel's Parish Umunnachi — Pastoral Visit", location: "St Gabriel's Parish Umunnachi", description: "Pastoral Visit to St Gabriel's Umunnachi — Twenty-Third Sunday.", category: "Pastoral Visit" },
  { id: "2026-09-06-regnum-christi", start: "2026-09-06", title: "Regnum Christi", description: "Regnum Christi event at 4pm.", category: "Special" },
  { id: "2026-09-10-cbcn-meeting", start: "2026-09-10", end: "2026-09-19", title: "CBCN Meeting", description: "Catholic Bishops' Conference of Nigeria (CBCN) meeting.", category: "Meeting" },
  { id: "2026-09-13-acf-collection", start: "2026-09-13", title: "Annual Church Fund (ACF) Collection", description: "Annual Church Fund (A.C.F.) collection.", category: "Special" },
  { id: "2026-09-20-ihm-jubilee", start: "2026-09-20", title: "Jubilee for IHM Sisters", description: "Jubilee for IHM Sisters — Twenty-Fifth Sunday.", category: "Special" },
  { id: "2026-09-20-st-joseph-iba-pope", start: "2026-09-20", title: "St Joseph's Parish Iba-Pope Awada", location: "St Joseph's Parish, Iba-Pope, Awada", description: "Mass / event at St Joseph's Parish Iba-Pope Awada at 11am.", category: "Pastoral Visit" },
  { id: "2026-09-27-st-michael-fegge", start: "2026-09-27", title: "St Michael's Parish Fegge", location: "St Michael's Parish, Fegge", description: "Visit to St Michael's Parish Fegge — Twenty-Sixth Sunday.", category: "Pastoral Visit" },
  { id: "2026-09-27-day-with-mary", start: "2026-09-27", title: "A Day with Mary", description: "A Day with Mary.", category: "Special" },

  // ── October 2026 ───────────────────────────────────────────────
  { id: "2026-10-04-holy-cross-nkpor", start: "2026-10-04", title: "Holy Cross Parish Nkpor", location: "Holy Cross Parish, Nkpor", description: "Visit to Holy Cross Parish Nkpor — Twenty-Seventh Sunday.", category: "Pastoral Visit" },
  { id: "2026-10-04-qrc-meeting", start: "2026-10-04", title: "Q.R.C. Meeting", description: "Q.R.C. Meeting.", category: "Meeting" },
  { id: "2026-10-10-ihm-motherhouse", start: "2026-10-10", title: "Visit to IHM Motherhouse & Q.R.C. Meeting", location: "IHM Motherhouse", description: "Visit to IHM Motherhouse by 6am; Q.R.C. meeting at 10am (Saturday).", category: "Special" },
  { id: "2026-10-11-most-holy-name-abatete", start: "2026-10-11", title: "Most Holy Name Parish Abatete", location: "Most Holy Name Parish, Abatete", description: "Visit to Most Holy Name Parish Abatete — Twenty-Eighth Sunday.", category: "Pastoral Visit" },
  { id: "2026-10-11-clarisan-jubilee", start: "2026-10-11", title: "Golden Jubilee of Clarisan Sisters", description: "Golden Jubilee of Clarisan Sisters at 10am.", category: "Special" },
  { id: "2026-10-11-catechetical-week", start: "2026-10-11", title: "Catechetical Week Collections", description: "Catechetical Week collections.", category: "Special" },
  { id: "2026-10-18-st-charles-lwanga", start: "2026-10-18", title: "St Charles Lwanga's Parish Okpoko", location: "St Charles Lwanga's Parish, Okpoko", description: "Visit to St Charles Lwanga's Parish Okpoko — Twenty-Ninth Sunday.", category: "Pastoral Visit" },
  { id: "2026-10-18-archbishop-birthday", start: "2026-10-18", title: "Birthday Anniversary of Archbishop Val — Prison Mass", location: "Onitsha Prison", description: "Birthday Anniversary of Archbishop Val — Mass at the Onitsha Prison.", category: "Mass" },
  { id: "2026-10-18-world-mission", start: "2026-10-18", title: "World Mission Sunday Collections", description: "World Mission Sunday collections.", category: "Special" },

  // ── November 2026 ──────────────────────────────────────────────
  { id: "2026-11-01-all-saints-st-charles", start: "2026-11-01", title: "All Saints — Visit to St Charles College Onitsha", location: "St Charles College, Onitsha", description: "All Saints Feast — Visit to St Charles College Onitsha.", category: "Pastoral Visit" },
  { id: "2026-11-01-all-saints-ahs", start: "2026-11-01", title: "All Saints Feast — All Hallows Seminary Onitsha", location: "All Hallows Seminary, Onitsha", description: "All Saints Feast celebrated at All Hallows Seminary Onitsha.", category: "Mass" },
  { id: "2026-11-01-ahs-collections", start: "2026-11-01", title: "All Hallows Seminary Collections", description: "All Hallows Seminary collections.", category: "Special" },
  { id: "2026-11-08-st-jerome-odume", start: "2026-11-08", title: "St Jerome's Parish Odume-Obosi", location: "St Jerome's Parish, Odume-Obosi", description: "Visit to St Jerome's Parish Odume-Obosi.", category: "Pastoral Visit" },
  { id: "2026-11-08-st-patrick-new-heaven", start: "2026-11-08", title: "St Patrick Catholic Church New-Heaven", location: "St Patrick Catholic Church, New-Heaven", description: "Visit to St Patrick Catholic Church New-Heaven.", category: "Pastoral Visit" },
  { id: "2026-11-15-bishops-meeting", start: "2026-11-15", title: "Onitsha/Owerri Bishops' Meeting — Onitsha", location: "Onitsha", description: "Joint Onitsha/Owerri Provincial Bishops' Meeting hosted at Onitsha.", category: "Meeting" },
  { id: "2026-11-15-holy-trinity-odume", start: "2026-11-15", title: "Holy Trinity Parish Odume-Obosi", location: "Holy Trinity Parish, Odume-Obosi", description: "Pastoral visit to Holy Trinity Parish Odume-Obosi.", category: "Pastoral Visit" },
  { id: "2026-11-21-pastoral-council", start: "2026-11-21", title: "Pastoral Council Meeting", description: "Pastoral Council Meeting — Feast of the Presentation of the Blessed Virgin Mary.", category: "Meeting" },
  { id: "2026-11-22-mater-amabilis", start: "2026-11-22", title: "Mater Amabilis Secondary School Umuoji — Pastoral Visit", location: "Mater Amabilis Secondary School, Umuoji", description: "Pastoral visit — Solemnity of Christ the King.", category: "Pastoral Visit" },
  { id: "2026-11-22-ckc-parish", start: "2026-11-22", title: "C.K.C. Parish Event", description: "C.K.C. Parish visit — Christ the King.", category: "Pastoral Visit" },
  { id: "2026-11-22-an-bishops", start: "2026-11-22", title: "AN-Bishops' Meeting", description: "Anambra State Catholic Bishops' Meeting.", category: "Meeting" },
  { id: "2026-11-29-advent-1", start: "2026-11-29", title: "First Sunday of Advent", description: "First Sunday of Advent — Year B begins.", category: "Mass" },
  { id: "2026-11-29-st-jude-fegge", start: "2026-11-29", title: "St Jude Parish Fly-over Fegge", location: "St Jude Parish, Fly-over Fegge", description: "Pastoral visit to St Jude Parish Fly-over Fegge.", category: "Pastoral Visit" },
  { id: "2026-11-29-oluchukwu", start: "2026-11-29", title: "Oluchukwu Microfinance 25th Anniversary & AGM", description: "Oluchukwu Microfinance — 25 years · Annual General Meeting.", category: "Special" },
  { id: "2026-11-29-missionaries", start: "2026-11-29", title: "Arrival of the Missionaries 1885 — Commemoration", description: "Commemorating the arrival of the first missionaries in 1885 (141 years).", category: "Special" },
  { id: "2026-11-29-ciwa", start: "2026-11-29", title: "CIWA Collections", description: "Catholic Institute of West Africa collections.", category: "Special" },

  // ── December 2026 ──────────────────────────────────────────────
  { id: "2026-12-06-st-marys", start: "2026-12-06", title: "St Mary's Parish Onitsha", location: "St Mary's Parish, Onitsha", description: "Pastoral visit — Second Sunday of Advent.", category: "Pastoral Visit" },
  { id: "2026-12-06-ihm-sisters", start: "2026-12-06", title: "A Day with IHM Sisters", description: "A day of prayer and fellowship with the IHM Sisters.", category: "Special" },
  { id: "2026-12-08-immaculate-conception", start: "2026-12-08", title: "Immaculate Conception — Holy Day of Obligation", description: "Solemnity of the Immaculate Conception of the Blessed Virgin Mary — Holy Day of Obligation.", category: "Mass" },
  { id: "2026-12-14-hospital-visits", start: "2026-12-14", end: "2026-12-19", title: "Hospital Visits", description: "Hospital visits across the Archdiocese during Advent.", category: "Pastoral Visit" },
  { id: "2026-12-19-installation", start: "2026-12-19", title: "Installation", description: "Installation ceremony.", category: "Special" },
  { id: "2026-12-19-diaconate-ordination", start: "2026-12-19", title: "Diaconate Ordination", description: "Ordination to the diaconate.", category: "Ordination" },
  { id: "2026-12-20-ckc-abatete", start: "2026-12-20", title: "C.K.C. Abatete Parish", location: "C.K.C. Abatete", description: "Pastoral visit — Fourth Sunday of Advent.", category: "Pastoral Visit" },
  { id: "2026-12-25-christmas-mass", start: "2026-12-25", title: "Christmas Mass — Basilica & Prisons", location: "Basilica of the Most Holy Trinity, Onitsha · Onitsha Prison", description: "Christmas Day Mass at the Basilica and at Onitsha Prison — Holy Day of Obligation.", category: "Mass" },
  { id: "2026-12-26-st-anthonys", start: "2026-12-26", title: "St Anthony's Parish Umudioka", location: "St Anthony's Parish, Umudioka", description: "Pastoral visit — Feast of St Stephen.", category: "Pastoral Visit" },
  { id: "2026-12-27-holy-family", start: "2026-12-27", title: "Holy Family — Blessed Iwene Tansi Parish Umudioka", location: "Blessed Iwene Tansi Parish, Umudioka", description: "Holy Family Sunday — Blessed Iwene Tansi Parish Umudioka.", category: "Mass" },
  { id: "2026-12-27-christmas-with-friends", start: "2026-12-27", title: "Christmas with Friends", description: "Christmas with Friends gathering.", category: "Special" },
];

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const MONTH_ROMAN = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
] as const;

export function monthRoman(monthIndex: number): string {
  return MONTH_ROMAN[monthIndex] ?? "";
}

export type MonthGroup = {
  year: number;
  monthIndex: number;
  entries: ProgrammeEntry[];
};

export function groupByMonth(entries: ProgrammeEntry[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>();
  for (const e of entries) {
    const year = Number(e.start.slice(0, 4));
    const monthIndex = Number(e.start.slice(5, 7)) - 1;
    const key = `${year}-${monthIndex}`;
    const existing = map.get(key);
    if (existing) {
      existing.entries.push(e);
    } else {
      map.set(key, { year, monthIndex, entries: [e] });
    }
  }
  return [...map.values()].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.monthIndex - b.monthIndex;
  });
}

export function formatDayLabel(entry: ProgrammeEntry): string {
  const startDay = entry.start.slice(8, 10);
  if (entry.end) {
    const endDay = entry.end.slice(8, 10);
    return `${startDay}–${endDay}`;
  }
  return startDay;
}

export function googleCalendarUrl(entry: ProgrammeEntry): string {
  const start = entry.start.replace(/-/g, "");
  const endDate = entry.end ?? entry.start;
  const endParsed = new Date(endDate);
  endParsed.setUTCDate(endParsed.getUTCDate() + 1);
  const end = endParsed.toISOString().slice(0, 10).replace(/-/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: entry.title,
    dates: `${start}/${end}`,
    details: entry.description ?? "",
    location: entry.location ?? "",
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}
