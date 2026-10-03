/* ================= SETĂRI ȘI CONȚINUT (editează aici) ================= */
const CONFIG = {
  // Adresa WordPress-ului unde se scriu articolele. După mutare, de ex. "https://blog.centrudesticla.ro"
  wpBase: "https://centrudesticla.ro",
  formWebhook: "",                 // gol = cererea se trimite pe email
  email: "sticla@centrudesticla.ro"
};
// [nume, descriere scurtă, pagina (fără .html), categorii, culori]
const PRODUCTS = [
 [
  "Balustrade din sticlă",
  "Pentru scări, terase și balcoane, din sticlă securizată și laminată.",
  "balustrade-din-sticla",
  [
   "casa"
  ],
  "#cfe3e0,#8fc0b6"
 ],
 [
  "Pereți de sticlă",
  "Birouri luminoase și săli de ședință separate fără ziduri.",
  "pereti-de-sticla",
  [
   "birou"
  ],
  "#e4eef0,#a9c9cf"
 ],
 [
  "Uși de sticlă",
  "Pentru interior, birouri și spații comerciale.",
  "usi-de-sticla",
  [
   "casa",
   "birou"
  ],
  "#dfe9ec,#9cbcc4"
 ],
 [
  "Cabine de duș",
  "Făcute pe dimensiunea băii tale, din sticlă securizată.",
  "cabine-de-dus",
  [
   "baie"
  ],
  "#e8f1f3,#b4d3d8"
 ],
 [
  "Oglinzi",
  "Tăiate pe măsură, șlefuite, fațetate sau gravate.",
  "oglinzi",
  [
   "baie",
   "decor"
  ],
  "#f2f5f6,#c3ccd0"
 ],
 [
  "Termopane",
  "Geamuri termoizolante produse în secția noastră, cu etichetă de identificare.",
  "termopane",
  [
   "casa"
  ],
  "#dbe7ea,#93b2ba"
 ],
 [
  "Copertine",
  "Protecție transparentă pentru intrări și terase.",
  "copertine",
  [
   "casa"
  ],
  "#d6e6e6,#86b4ae"
 ],
 [
  "Sticlă vopsită simplă sau cu model",
  "Pentru bucătării, mobilier și pereți decorativi.",
  "sticla-vopsita",
  [
   "casa",
   "decor"
  ],
  "#2f6f6a,#7fb8ae"
 ],
 [
  "Sticlă ornamentală",
  "Texturi care lasă lumina să treacă și păstrează intimitatea.",
  "sticla-ornamentala",
  [
   "birou",
   "decor"
  ],
  "#e6eef0,#b9cdd2"
 ],
 [
  "Ornamente din vitralii realizate manual",
  "Vitralii lucrate de mână, pentru uși, ferestre și decor.",
  "vitralii",
  [
   "decor"
  ],
  "#b8925a,#2f6f6a"
 ],
 [
  "Sticlă curbată",
  "Pentru proiecte cu forme speciale.",
  "sticla-curbata",
  [
   "special"
  ],
  "#d3e4e6,#8ab3b5"
 ],
 [
  "Sticlă termorezistentă",
  "Pentru zone expuse la temperaturi ridicate.",
  "sticla-termorezistenta",
  [
   "special"
  ],
  "#e9ddd0,#b8925a"
 ],
 [
  "Sticle float",
  "Sticlă clară, la grosimea și dimensiunea de care ai nevoie.",
  "sticla-float",
  [
   "special"
  ],
  "#eef4f5,#cfe0e2"
 ],
 [
  "Rame tablouri",
  "Înrămăm tablouri, fotografii și diplome.",
  "rame-tablouri",
  [
   "decor"
  ],
  "#d9c3a0,#8a6a3e"
 ],
 [
  "Canvas personalizat",
  "Fotografiile tale, imprimate pe canvas.",
  "canvas-personalizat",
  [
   "decor"
  ],
  "#e8d9c6,#b8925a"
 ],
 [
  "Placare cu fototapet",
  "Pereți decorativi cu imaginea aleasă de tine.",
  "placare-fototapet",
  [
   "decor"
  ],
  "#cfe0e2,#b8925a"
 ],
 [
  "Accesorii",
  "Feronerie pentru uși, cabine de duș și pereți de sticlă.",
  "accesorii",
  [
   "special"
  ],
  "#c7d0d4,#5e707a"
 ]
];
const FILTERS = [["toate", "Toate"], ["casa", "Pentru casă"], ["baie", "Baie"], ["birou", "Birouri și spații comerciale"], ["decor", "Decor"], ["special", "Sticlă tehnică și accesorii"]];
// [nume, dimensiuni, preț, disponibilitate, pagina pe site-ul vechi]
const PROMOS = [
 [
  "Oglindă 4 mm, vopsită pe spate verde",
  "800 x 800",
  "175 lei",
  "",
  "/promotii/oglinda-4-mm-vopsita-pe-spate-verde"
 ],
 [
  "Oglindă fațetată",
  "345 x 430",
  "28 lei",
  "2 bucăți disponibile",
  "/promotii/oglinda-4-mm-fatetata"
 ],
 [
  "Oglindă fațetată",
  "610 x 800",
  "72 lei",
  "",
  "/promotii/oglinda-4-mm-fatetata-mare"
 ],
 [
  "Oglindă 4 mm fumurie",
  "700 x 700",
  "78 lei",
  "",
  "/promotii/oglinda-4-mm-fumurie"
 ],
 [
  "Oglindă 4 mm șlefuită, gravat luciu",
  "500 x 1625",
  "307 lei",
  "",
  "/promotii/oglinda-4-mm-slefuita-gravat-luciu-3"
 ],
 [
  "Sticlă gri 8 mm șlefuită, securizată",
  "540 x 1025",
  "154 lei",
  "",
  "/promotii/sticla-gri-8-mm-slefuita-securizat"
 ],
 [
  "Sticlă satinată albă 4 mm, pictată",
  "450 x 930",
  "236 lei",
  "",
  "/promotii/sticla-satinata-alba-4-mm-slefuita-pictata"
 ],
 [
  "Sticlă antică pictată",
  "440 x 830",
  "343 lei",
  "",
  "/promotii/sticla-antica-ant-dulce-pictata"
 ]
];
const POSTS = [
 [
  "De ce nu se sparge peretele din sticlă al unei piscine?",
  "/de-ce-nu-se-sparge-peretele-din-sticla-al-unei-piscine-raspunsul-este-mult-mai-complex-decat-ai-crede/"
 ],
 [
  "De ce devine căldura insuportabilă în unele locuințe? Răspunsul se ascunde în sticlă",
  "/de-ce-devine-caldura-insuportabila-in-unele-locuinte-raspunsul-se-ascunde-in-sticla/"
 ],
 [
  "Cât de sigură este balustrada ta din sticlă?",
  "/cat-de-sigura-este-balustrada-ta-din-sticla-o-singura-greseala-poate-provoca-o-tragedie/"
 ],
 [
  "Paștele acesta, ce ai schimba la casa ta ca să o simți mai „a ta”?",
  "/pastele-acesta-ce-ai-schimba-la-casa-ta-ca-sa-o-simti-mai-a-ta/"
 ],
 [
  "Știi diferența dintre sticla normală și sticla securizată?",
  "/diferenta-intre-sticla-normala-si-sticla-securizata/"
 ],
 [
  "5 moduri în care sticla îți face casa mai sustenabilă",
  "/5-moduri-in-care-sticla-iti-face-casa-mai-sustenabila/"
 ]
];
