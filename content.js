/**
 * ============================================================
 *  PORTFOLIO CONTENT
 * ============================================================
 */

const CONTENT = {

  site: {
    title:    "Jarrett Pierse — Portfolio",
    name:     "Jarrett Pierse",
    location: "London, UK",
    status:   "Open to projects",
  },


  layout: {
    portrait: { left:  50, top:  30, w: 320, h: 380 },
    about:    { left: 390, top:  30, w: 410, h: 290 },
    work:     { left: 480, top: 340, w: 400, h: 330 },
    services: { left:  50, top: 430, w: 420, h: 330 },
    contact:  { left: 910, top: 350, w: 310, h: 210 },
    paper:    { left: 910, top:  30, w: 420, h: 680 },
    dontclick: { left:  850, top: 80, w: 180, h: 110 },
  },

  about: {
    portraitUrl: "headshot.jpeg",

    tagline: "Web Developer · UX Designer · Digital Consultant",

    intro: "Based in London, I build digital experiences that feel easy for customers and perform for businesses.",

    skills: ["Web Dev", "UX", "Shopify", "Webflow", "Email Automation", "SEO", "Digital Marketing", "Social Strategy"],

    bio: `Hey there,

My name is Jarrett, and I work at the intersection of design,
development and digital strategy.

WHAT I DO
─────────────────────────────────────────
I help eCommerce brands and digital businesses build
better experiences. I work across platforms with a
wealth of experience across different digital products.

My work spans:
  • UX Design & Web Development
  • Storefront Design & Integrations
  • Email Marketing & SEO
  • Content & Marketing Strategy

BACKGROUND
─────────────────────────────────────────
With a background as a Systems Development Engineer
at AWS, I work with multiple clients in eCommerce and 
various digital businesses - from fashion, medical,
education and media. I tailor my approach to each client
to meet the specific needs of their business and
performance indicators.

CURRENTLY
─────────────────────────────────────────
Based in London, UK.
Open to freelance projects & collaborations.`,
  },

  workExperience: [
    {
      id:      "laserskinclinics",
      company: "Laser + Skin Clinics",
      role:    "UX Design · Web Design · Email Marketing",
      period:  "2026",
      tags:    ["Shopify", "Klaviyo", "SEO", "Digital Strategy", "Google Ads"],
      url:     "https://laserandskin.ie",
      body: `
        <h2>Laser + Skin Clinics</h2>
        <span class="cs-tag">Shopify</span>
        <span class="cs-tag">Klaviyo</span>
        <span class="cs-tag">SEO</span>
        <span class="cs-tag">Digital Strategy</span>
        <span class="cs-tag">Google Ads</span>
        <p>Multi-clinic aesthetics and laser treatment brand operating nationwide across Ireland.</p>
        <p>Migrated the client to Shopify with a new website design and customer experience to improve onsite consultation bookings and build their client mailing list.</p>
        <p>Built custom Klaviyo tracking and metrics enabling personalised email automation flows at scale.</p>
        <p><a href="https://laserandskin.ie" target="_blank" rel="noopener noreferrer" style="color:#000080;text-decoration:underline;">↗ Laser & Skin Clinics Website</a></p>
      `,
    },
    {
      id:      "hatch105",
      company: "Hatch105",
      role:    "Web Development",
      period:  "2025",
      tags:    ["Web Development", "Branding", "Social Media"],
      url:     "https://hatch105.com",
      body: `
        <h2>Hatch105 — the internship program for future entrepreneurs</h2>
        <span class="cs-tag">Web Development</span>
        <span class="cs-tag">Branding</span>
        <span class="cs-tag">Social Media</span>
        <p>Developed the concept, brand aesthetic and website for Hatch105 — a new internship program and startup accelerator based in Dublin, Ireland.</p>
        <p><a href="https://hatch105.com" target="_blank" rel="noopener noreferrer" style="color:#000080;text-decoration:underline;">↗ Hatch105 Website</a></p>
      `,
    },
    {
      id:      "boldgolf",
      company: "Bold Golf",
      role:    "UX · Visual Merchandising · Fashion Show Production",
      period:  "2024–Present",
      tags:    ["UX Design", "Shopify", "Visual Merchandising", "Ireland Fashion Week"],
      url:     "https://bold-golf.com",
      body: `
        <h2>Bold Golf</h2>
        <span class="cs-tag">UX Design</span>
        <span class="cs-tag">Visual Merchandising</span>
        <span class="cs-tag">Shopify</span>
        <span class="cs-tag">Ireland Fashion Week</span>
        <p>Designed and iterated the storefront for Bold Golf — a sportswear-meets-streetwear fashion brand.</p>
        <p>Built out multiple integrations for UGC, customer reviews, referral program, email marketing automation and storefront A/B testing.</p>
        <p>Worked directly with Ireland Fashion Week as part of the show production of the Sportswear Runway Fashion Show in October 2025.</p>
        <p><a href="https://bold-golf.com" target="_blank" rel="noopener noreferrer" style="color:#000080;text-decoration:underline;">↗ Bold Golf Website</a></p>

      `,
    },
    {
      id:      "aws",
      company: "Amazon Web Services",
      role:    "Systems Development Engineer II",
      period:  "2022–2025",
      tags:    ["AWS", "Full Stack", "Cloud Infrastructure", "Networking"],
      body: `
        <h2>Amazon Web Services</h2>
        <span class="cs-tag">Systems Development Engineer II</span>
        <span class="cs-tag">AWS</span>
        <span class="cs-tag">Full Stack</span>
        <span class="cs-tag">Networking</span>
        <p>Build full-stack internal tools for the planning and management of Networking Infrastructure equipment within the AWS network.</p>
      `,
    },
    {
      id:      "ucd",
      company: "University College Dublin",
      role:    "BSc Computer Science",
      period:  "2018–2022",
      tags:    ["University", "Research", "Knowledge Graphs"],
      body: `
        <h2>BSc Computer Science @ UCD</h2>
        <span class="cs-tag">Computer Science</span>
        <span class="cs-tag">Research</span>
        <span class="cs-tag">Knowledge Graphs</span>
        <p>For my undergraduate thesis, I developed a method of connecting climate and tourism data using knowledge graphs as an effective methodology for querying the data. This research included a usability study using established research methods and resulted in a peer-reviewed publication in the <em>IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing</em>.</p>
        <p><a href="https://www.researchgate.net/publication/367446676" target="_blank" rel="noopener noreferrer" style="color:#000080;text-decoration:underline;">↗ Improving Tourism Analytics From Climate Data Using Knowledge Graphs</a></p>
      `,
    },
  ],


  services: [
    {
      icon:   "💻",
      title:  "Web Development",
      desc:   "Custom Web Applications, Shopify, Webflow, Liquid templating and headless integrations.",
      detail: "Web Development\n\nCustom web application development, including using platforms such as Shopify, Squarespace, Webflow. Custom ",
    },
    {
      icon:   "🎨",
      title:  "UX Design",
      desc:   "User research, wireframing, prototyping and usability testing to create experiences people actually enjoy.",
      detail: "UX Design\n\nUser research, wireframing, prototyping and usability testing.\n\n",
    },
    {
      icon:   "🛒",
      title:  "Store Optimisation",
      desc:   "Shopify CRO, theme development, speed optimisation and conversion-focused A/B testing.",
      detail: "Store Optimisation\n\nShopify CRO, theme devevelopment, speed & conversion optimisation.\n\n",
    },
    {
      icon:   "📈",
      title:  "Digital Marketing Strategy",
      desc:   "Klaviyo email flows, SEO audits, paid social and full-funnel strategy built around your goals.",
      detail: "Digital Marketing Strategy\n\nEmail Automation/Flows, SEO, paid social, full-funnel strategy.\n\n",
    },
  ],

  contact: [
    {
      label: "Email",
      value: "hello@jarrettpierse.com",
      href:  "mailto:hello@jarrettpierse.com?subject=Website%20Enquiry",
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/jarrettpierse",
      href:  "https://www.linkedin.com/in/jarrettpierse/",
    },
  ],

  paper: {
    enabled:  false,
    filename: "paper.pdf",
    title:    "📄 Research Paper",
  },
};
