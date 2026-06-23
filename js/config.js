/* ============================================
   Lab Website — Configuration
   ============================================ */

const LAB_CONFIG = {
  // --- Lab Info ---
  name: "VITA LAB",
  shortName: "VITA",
  tagline: "Understand the unseen. Inspire the future.",
  description:
    "Vision, Intelligence and Affective Computing Laboratory conducts research at the intersection of computer vision, multimodal learning, affective computing, and human-centered AI.",

  // --- Google Sheets ---
  spreadsheetId: "1qiIMN4pDwWeaxOO3YhkISbE81lHunssu7cl9VSVl2_Q",

  sheets: {
    members: {
      name: "Members",
      gid: "0"
    },
    publications: {
      name: "Publications",
      gid: "320459195"
    }
  },

  cacheDuration: 0,

  // --- Research Areas ---
  researchAreas: [
    {
      icon: "🧠",
      title: "Affective Computing",
      description:
        "Decoding human emotions and behaviors to understand implicit signals."
    },
    {
      icon: "📊",
      title: "Multimodal AI",
      description:
        "Fusing vision, audio, and text through rigorous mathematical frameworks."
    },
    {
      icon: "🔬",
      title: "Human-Centric AI",
      description:
        "Fostering a joyful and profoundly connected educational ecosystem."
    }
  ],

  // --- Contact ---
  contact: {
    email: "lab@university.edu",
    phone: "+84 XXX XXX XXXX",
    address: "University Lab",
    mapEmbedUrl: ""
  },

  // --- Social ---
  social: {
    googleScholar: "",
    github: "",
    twitter: "",
    linkedin: ""
  },

  // --- Join Us ---
  joinUs: {
    enabled: true,
    description: "We are looking for motivated students and researchers.",
    positions: [
      "PhD Students",
      "Master Students",
      "Research Assistants",
      "Undergraduate Interns"
    ],
    applyEmail: "lab@university.edu"
  }
};

/* ============================================
   Google Sheets Loader (NO CACHE + AUTO UPDATE)
   ============================================ */

function getSheetUrl(key) {
  const sheet = LAB_CONFIG.sheets[key];

  if (!sheet || !LAB_CONFIG.spreadsheetId) return null;

  let url = `https://docs.google.com/spreadsheets/d/${LAB_CONFIG.spreadsheetId}/export?format=csv`;
  
  if (sheet.gid) {
    url += `&gid=${sheet.gid}`;
  } else {
    url += `&sheet=${encodeURIComponent(sheet.name)}`;
  }
  
  return url + `&_=${Date.now()}`;
}