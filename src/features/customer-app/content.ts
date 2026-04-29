export type ServiceNarrative = {
  eyebrow: string;
  longDescription: string;
  fabricRequirementText: string;
  measurementGuideText: string;
  designHighlights: string[];
  faq: Array<{ question: string; answer: string }>;
};

export type FallbackService = {
  id: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  name: string;
  slug: string;
  shortDescription: string;
  startingPrice: number;
  bookingAmount: number;
  currencyCode: string;
  deliveryEstimateMinDays: number;
  deliveryEstimateMaxDays: number;
  isFeatured: boolean;
  options: Array<{
    id: string;
    name: string;
    optionType: string;
    priceDelta: number;
    isRequired: boolean;
    sortOrder: number;
  }>;
  styleTemplates: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    imageUrl: string | null;
    thumbnailUrl: string | null;
    tags: string[];
    isFeatured: boolean;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    title: string;
    comment: string;
    customerName: string;
    createdAt: string;
  }>;
};

export const tailoringSteps = [
  {
    title: "Choose the silhouette",
    description:
      "Pick a garment service, shortlist style references, and tell us whether you are bringing fabric or want sourcing support.",
  },
  {
    title: "Lock fit and consultation",
    description:
      "Submit a measurement profile or book a guided consultation so the design team can confirm fit, finishing details, and timelines.",
  },
  {
    title: "Track every milestone",
    description:
      "Follow the order from designer assignment and fabric approval through stitching, quality check, delivery, and alterations.",
  },
];

export const trustPillars = [
  "Transparent stage-by-stage production updates",
  "Studio-guided design consultation for occasion and everyday wear",
  "Measurement profiles saved for faster reorders",
  "Pickup, shipping, and alteration workflows built into the order journey",
];

export const testimonials = [
  {
    name: "Rhea Malhotra",
    role: "Bride, Bengaluru",
    quote:
      "The team translated my blouse sketch into a refined bridal piece and the tracking updates made the process feel calm instead of chaotic.",
  },
  {
    name: "Samaira Bedi",
    role: "Working professional, Gurgaon",
    quote:
      "I used one measurement profile for kurtis and alteration follow-ups. The platform feels organized, polished, and genuinely premium.",
  },
  {
    name: "Anika Shah",
    role: "Occasionwear customer, Mumbai",
    quote:
      "Consultation, pickup, stitching, and delivery were all visible in one place. That clarity is what made me trust the service.",
  },
];

export const globalFaq = [
  {
    question: "Can I send my own fabric?",
    answer:
      "Yes. Each service page explains fabric needs and pickup options, and the order flow supports both customer-provided and studio-assisted fabric journeys.",
  },
  {
    question: "Do I need to visit the studio for measurements?",
    answer:
      "No. You can save measurements digitally, request a consultation, or schedule a guided fitting path depending on your garment complexity.",
  },
  {
    question: "How are timelines shared?",
    answer:
      "Every order includes an estimated delivery window and milestone tracking from consultation through shipment and alterations.",
  },
  {
    question: "Are alterations supported after delivery?",
    answer:
      "Yes. Delivered orders can move into an alteration request workflow so fit corrections and finishing tweaks remain traceable.",
  },
];

export const policySections = [
  {
    title: "Measurements and fit responsibility",
    body:
      "Measurement profiles can be saved online, but exact fit depends on accurate inputs or a confirmed consultation. Complex bridal or occasion garments should use a consultation milestone before cutting begins.",
  },
  {
    title: "Fabric intake and approval",
    body:
      "Customer-provided fabric is reviewed before production starts. The team may recommend lining, margin adjustments, or alternate finishing if the supplied fabric affects silhouette or durability.",
  },
  {
    title: "Payments and milestone booking",
    body:
      "Orders support booking-amount and full-payment flows. Gateway processing is abstracted through Razorpay or Stripe-compatible adapters and raw card data is never stored by the platform.",
  },
  {
    title: "Alterations and aftercare",
    body:
      "Alteration requests are reviewed against delivery condition, garment structure, and timeline feasibility. Approved requests move into a dedicated aftercare status flow.",
  },
];

export const measurementChecklist = [
  "Keep the measuring tape parallel to the floor and snug, not tight.",
  "Wear the innerwear or fit base you plan to use with the garment.",
  "Capture shoulder, bust, waist, hip, and garment length at minimum.",
  "Add notes about sleeve preference, ease, or posture if relevant.",
];

export const serviceNarratives: Record<string, ServiceNarrative> = {
  "designer-blouse-stitching": {
    eyebrow: "Bridal and festive precision",
    longDescription:
      "Crafted for saree blouses that need proportion, structure, and confidence from every angle. This service balances neckline design, sleeve styling, and support details with a consultation-friendly workflow.",
    fabricRequirementText:
      "Works best with blouse fabric plus lining, margin allowance, and embellishment notes if handwork is planned.",
    measurementGuideText:
      "Share bust, waist, shoulder, armhole, blouse length, sleeve length, and preferred fit ease. Bridal orders should add posture or bust-support notes.",
    designHighlights: [
      "Neckline shaping with back-depth planning",
      "Sleeve balance for embellished or plain looks",
      "Padding, piping, cups, tassels, and finishing add-ons",
    ],
    faq: [
      {
        question: "Is this suitable for bridal wear?",
        answer:
          "Yes. Bridal blouse orders benefit from consultation milestones and are designed to accommodate finishing, lining, and occasion-specific structure.",
      },
      {
        question: "Can I match an existing saree blouse fit?",
        answer:
          "Yes. Upload a reference image and share notes about what to replicate or improve in the fit profile.",
      },
    ],
  },
  "custom-kurti-stitching": {
    eyebrow: "Everyday polish with custom fit",
    longDescription:
      "Designed for kurtis that feel comfortable through the workday and refined enough for events. The focus is on silhouette, side-slit balance, lining choices, and finishing quality.",
    fabricRequirementText:
      "Ideal for cottons, linens, rayon blends, festive jacquards, and fabrics that benefit from controlled fall and clean side shaping.",
    measurementGuideText:
      "Share bust, waist, hip, shoulder, kurti length, sleeve length, and preferred ease. Add notes if you want A-line, straight, or gathered silhouettes.",
    designHighlights: [
      "Straight, A-line, panelled, and festive silhouettes",
      "Neckline and sleeve customizations for work or occasionwear",
      "Dupatta and bottom coordination guidance during consultation",
    ],
    faq: [
      {
        question: "Can I order multiple kurtis from one measurement profile?",
        answer:
          "Yes. A saved measurement profile makes repeat kurti orders much faster, with only style and length changes needed.",
      },
      {
        question: "Is lining mandatory?",
        answer:
          "Not always. The team recommends lining based on fabric transparency, fall, and garment structure.",
      },
    ],
  },
  "premium-salwar-suit-stitching": {
    eyebrow: "Coordinated multi-piece tailoring",
    longDescription:
      "Built for customers who want the kameez, lower, and finishing details handled as one polished set. Ideal for festive, semi-formal, and occasion dressing where balance matters.",
    fabricRequirementText:
      "Best for coordinated top and bottom fabrics with lining guidance, dupatta reference, and trim notes if you want an embellished finish.",
    measurementGuideText:
      "Share upper-body fit measurements plus hip, calf, ankle, and preferred bottom shape. Mention whether you want cigarette pants, churidar, palazzo, or classic salwar.",
    designHighlights: [
      "Kameez and bottom planned together for proportion",
      "Consultation support for slit placement and silhouette choice",
      "Festive finishing options with liner and trim recommendations",
    ],
    faq: [
      {
        question: "Can I switch bottom style after booking?",
        answer:
          "Yes, before cutting starts. Once pattern work begins, style changes depend on the stage and fabric usage already committed.",
      },
      {
        question: "Do you handle matching dupatta styling notes?",
        answer:
          "Yes. Even if the dupatta is not stitched, the team can advise border direction, finishing, and styling balance.",
      },
    ],
  },
  "bridal-lehenga-customization": {
    eyebrow: "Ceremony-scale customization",
    longDescription:
      "A high-touch workflow for bridal lehengas that need silhouette planning, can-can structure, blouse coordination, and milestone-based approvals. This is the most consultative service on the platform.",
    fabricRequirementText:
      "Requires fabric details for lehenga, blouse, lining, can-can, and any embellishment plan so weight, fall, and comfort can be balanced properly.",
    measurementGuideText:
      "Use a confirmed profile or guided consultation. Bridal pieces should include heel height, blouse support needs, and event-day comfort priorities.",
    designHighlights: [
      "Panelled volume with structured movement",
      "Bridal blouse coordination with neckline planning",
      "Milestone approvals before cutting, stitching, and QC",
    ],
    faq: [
      {
        question: "How early should I place a bridal lehenga order?",
        answer:
          "Ideally several weeks ahead so consultation, fittings, and any embellishment coordination can be planned without rushing the production flow.",
      },
      {
        question: "Do you support heirloom or repurposed fabrics?",
        answer:
          "Yes. The team can inspect repurposed fabrics and advise how best to use them for a fresh bridal silhouette.",
      },
    ],
  },
  "evening-dress-stitching": {
    eyebrow: "Occasionwear with movement and finish",
    longDescription:
      "Tailored for gowns and dresses that need elegant fall, structured shaping, and event-ready finishing. Ideal for eveningwear, receptions, cocktail looks, and celebratory silhouettes.",
    fabricRequirementText:
      "Works well with satin, crepe, georgette, organza layers, structured blends, and occasionwear fabrics that need careful lining choices.",
    measurementGuideText:
      "Capture bust, waist, hip, shoulder, full length, heel height, and notes about the exact footwear or bra support you plan to use.",
    designHighlights: [
      "Slip, fit-and-flare, draped, and structured gown silhouettes",
      "Lining and movement planning for event comfort",
      "Hem accuracy for heels, photos, and stage movement",
    ],
    faq: [
      {
        question: "Can I submit a Pinterest-style reference?",
        answer:
          "Yes. Uploading references is encouraged so the designer can align expectations on neckline, waist placement, and overall mood.",
      },
      {
        question: "Do you support modest or full-coverage variations?",
        answer:
          "Yes. Coverage and comfort adjustments can be incorporated without losing the overall visual direction.",
      },
    ],
  },
  "premium-alteration-service": {
    eyebrow: "Aftercare and fit correction",
    longDescription:
      "For garments that need better structure, refreshed proportion, or a more confident fit. Suitable for existing studio orders as well as selected finished garments that need expert refinement.",
    fabricRequirementText:
      "The team will assess seam allowance, fabric condition, lining, and trim constraints before approving structural alteration changes.",
    measurementGuideText:
      "Share the current fit issue, what feels loose or tight, and any measurement changes since the garment was last stitched.",
    designHighlights: [
      "Waist, shoulder, length, and overall fit refinements",
      "Rush support for urgent event timelines where feasible",
      "Structured review before approval for major corrections",
    ],
    faq: [
      {
        question: "Can every garment be altered?",
        answer:
          "Not always. Feasibility depends on seam margin, fabric wear, embellishment placement, and the extent of the requested fit change.",
      },
      {
        question: "Do alteration requests get status updates too?",
        answer:
          "Yes. Approved alteration requests move through their own progress flow so aftercare remains visible and accountable.",
      },
    ],
  },
};

export const fallbackServices: FallbackService[] = [
  {
    id: "service-blouse",
    categoryId: "category-blouse",
    categoryName: "Blouse Stitching",
    categorySlug: "blouse-stitching",
    name: "Designer Blouse Stitching",
    slug: "designer-blouse-stitching",
    shortDescription: "Premium blouse tailoring with consultation-led fit and finishing.",
    startingPrice: 1800,
    bookingAmount: 500,
    currencyCode: "INR",
    deliveryEstimateMinDays: 7,
    deliveryEstimateMaxDays: 10,
    isFeatured: true,
    options: [
      { id: "option-blouse-padding", name: "Built-in padding", optionType: "ADD_ON", priceDelta: 250, isRequired: false, sortOrder: 1 },
      { id: "option-blouse-tassels", name: "Handmade tassels", optionType: "ADD_ON", priceDelta: 180, isRequired: false, sortOrder: 2 },
    ],
    styleTemplates: [
      { id: "style-blouse-bridal", name: "Deep Back Bridal Blouse", slug: "deep-back-bridal-blouse", description: "Bridal-focused blouse with statement back depth and refined sleeve balance.", imageUrl: null, thumbnailUrl: null, tags: ["bridal", "blouse"], isFeatured: true },
      { id: "style-blouse-boat", name: "Modern Boat Neck Blouse", slug: "modern-boat-neck-blouse", description: "A polished silhouette for reception or saree styling with cleaner front balance.", imageUrl: null, thumbnailUrl: null, tags: ["reception", "boat-neck"], isFeatured: false },
    ],
    reviews: [
      { id: "review-blouse-1", rating: 5, title: "Exactly the fit I wanted", comment: "The consultation helped refine the neckline and the blouse arrived balanced and supportive.", customerName: "Rhea M.", createdAt: "2026-04-08T10:00:00.000Z" },
    ],
  },
  {
    id: "service-kurti",
    categoryId: "category-kurti",
    categoryName: "Kurti Stitching",
    categorySlug: "kurti-stitching",
    name: "Custom Kurti Stitching",
    slug: "custom-kurti-stitching",
    shortDescription: "Tailored kurtis with silhouette, sleeve, and length personalization.",
    startingPrice: 1400,
    bookingAmount: 400,
    currencyCode: "INR",
    deliveryEstimateMinDays: 6,
    deliveryEstimateMaxDays: 9,
    isFeatured: true,
    options: [
      { id: "option-kurti-aline", name: "A-line silhouette", optionType: "FIT", priceDelta: 200, isRequired: false, sortOrder: 1 },
      { id: "option-kurti-lining", name: "Soft cotton lining", optionType: "ADD_ON", priceDelta: 240, isRequired: false, sortOrder: 2 },
    ],
    styleTemplates: [
      { id: "style-kurti-festive", name: "Festive A-Line Kurti", slug: "festive-a-line-kurti", description: "An easy festive silhouette with flattering flare and versatile neckline options.", imageUrl: null, thumbnailUrl: null, tags: ["kurti", "aline"], isFeatured: true },
      { id: "style-kurti-workwear", name: "Workwear Straight Kurti", slug: "workwear-straight-kurti", description: "Minimal, crisp, and built for repeat weekday wear with tailored comfort.", imageUrl: null, thumbnailUrl: null, tags: ["workwear", "straight"], isFeatured: false },
    ],
    reviews: [
      { id: "review-kurti-1", rating: 5, title: "Repeat-order worthy", comment: "I saved my measurements once and ordered two more kurtis with small style changes.", customerName: "Samaira B.", createdAt: "2026-04-12T10:00:00.000Z" },
    ],
  },
  {
    id: "service-salwar",
    categoryId: "category-salwar",
    categoryName: "Salwar Suit Stitching",
    categorySlug: "salwar-suit-stitching",
    name: "Premium Salwar Suit Stitching",
    slug: "premium-salwar-suit-stitching",
    shortDescription: "Coordinated kameez and bottom tailoring with festive finishing support.",
    startingPrice: 2200,
    bookingAmount: 700,
    currencyCode: "INR",
    deliveryEstimateMinDays: 8,
    deliveryEstimateMaxDays: 12,
    isFeatured: true,
    options: [
      { id: "option-salwar-cigarette", name: "Cigarette pants", optionType: "STYLE_CHOICE", priceDelta: 250, isRequired: false, sortOrder: 1 },
      { id: "option-salwar-piping", name: "Contrast piping", optionType: "ADD_ON", priceDelta: 150, isRequired: false, sortOrder: 2 },
    ],
    styleTemplates: [
      { id: "style-salwar-straight", name: "Straight Cut Suit Set", slug: "straight-cut-suit-set", description: "A balanced festive suit set with clean shaping and elegant movement.", imageUrl: null, thumbnailUrl: null, tags: ["suit-set", "festive"], isFeatured: true },
    ],
    reviews: [
      { id: "review-salwar-1", rating: 4, title: "Very polished finish", comment: "The whole set felt coordinated and the bottom fit was exactly what I asked for.", customerName: "Ira S.", createdAt: "2026-04-10T10:00:00.000Z" },
    ],
  },
  {
    id: "service-lehenga",
    categoryId: "category-lehenga",
    categoryName: "Lehenga Customization",
    categorySlug: "lehenga-customization",
    name: "Bridal Lehenga Customization",
    slug: "bridal-lehenga-customization",
    shortDescription: "Consultation-heavy lehenga customization for bridal and grand occasionwear.",
    startingPrice: 6500,
    bookingAmount: 2000,
    currencyCode: "INR",
    deliveryEstimateMinDays: 18,
    deliveryEstimateMaxDays: 28,
    isFeatured: true,
    options: [
      { id: "option-lehenga-cancan", name: "Can-can layering", optionType: "ADD_ON", priceDelta: 600, isRequired: false, sortOrder: 1 },
      { id: "option-lehenga-dupatta", name: "Dupatta finishing", optionType: "ADD_ON", priceDelta: 350, isRequired: false, sortOrder: 2 },
    ],
    styleTemplates: [
      { id: "style-lehenga-panelled", name: "Panelled Bridal Lehenga", slug: "panelled-bridal-lehenga", description: "Structured bridal volume with movement, balance, and strong blouse coordination.", imageUrl: null, thumbnailUrl: null, tags: ["bridal", "lehenga"], isFeatured: true },
    ],
    reviews: [
      { id: "review-lehenga-1", rating: 5, title: "Felt fully managed", comment: "The milestone approvals made such a big bridal order feel organized and under control.", customerName: "Anika S.", createdAt: "2026-04-02T10:00:00.000Z" },
    ],
  },
  {
    id: "service-dress",
    categoryId: "category-dress",
    categoryName: "Dress and Gown Stitching",
    categorySlug: "dress-gown-stitching",
    name: "Evening Dress Stitching",
    slug: "evening-dress-stitching",
    shortDescription: "Tailored occasion dresses and gowns with lining and fall planning.",
    startingPrice: 3200,
    bookingAmount: 900,
    currencyCode: "INR",
    deliveryEstimateMinDays: 9,
    deliveryEstimateMaxDays: 14,
    isFeatured: false,
    options: [
      { id: "option-dress-lining", name: "Structured lining", optionType: "ADD_ON", priceDelta: 300, isRequired: false, sortOrder: 1 },
      { id: "option-dress-corset", name: "Corset support", optionType: "ADD_ON", priceDelta: 850, isRequired: false, sortOrder: 2 },
    ],
    styleTemplates: [
      { id: "style-dress-satin", name: "Satin Evening Gown", slug: "satin-evening-gown", description: "Fluid and occasion-ready with clean waist shaping and elegant length control.", imageUrl: null, thumbnailUrl: null, tags: ["gown", "evening"], isFeatured: true },
    ],
    reviews: [
      { id: "review-dress-1", rating: 5, title: "Beautiful movement", comment: "The fall and hem felt considered, especially with heels and photos in mind.", customerName: "Nisha K.", createdAt: "2026-03-30T10:00:00.000Z" },
    ],
  },
  {
    id: "service-alteration",
    categoryId: "category-alteration",
    categoryName: "Alteration Services",
    categorySlug: "alteration-services",
    name: "Premium Alteration Service",
    slug: "premium-alteration-service",
    shortDescription: "Refit and correction services for delivered or existing garments.",
    startingPrice: 500,
    bookingAmount: 200,
    currencyCode: "INR",
    deliveryEstimateMinDays: 3,
    deliveryEstimateMaxDays: 5,
    isFeatured: false,
    options: [
      { id: "option-alteration-rush", name: "Urgent turnaround", optionType: "ADD_ON", priceDelta: 250, isRequired: false, sortOrder: 1 },
    ],
    styleTemplates: [
      { id: "style-alteration-fit", name: "Precision Fit Alteration", slug: "precision-fit-alteration", description: "Focused on silhouette correction and more confident wearability.", imageUrl: null, thumbnailUrl: null, tags: ["alteration", "fit"], isFeatured: true },
    ],
    reviews: [
      { id: "review-alteration-1", rating: 4, title: "Saved an event outfit", comment: "The team corrected the waist and shoulder fit quickly without compromising the original look.", customerName: "Mitali A.", createdAt: "2026-04-01T10:00:00.000Z" },
    ],
  },
];
