export type Option = { value: string; label: string };

export type Dict = {
  brand: { name: string; tagline: string };
  nav: {
    home: string;
    about: string;
    services: string;
    gallery: string;
    process: string;
    faq: string;
    contact: string;
    cta: string;
    langToggle: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scroll: string;
  };
  marquee: string[];
  about: {
    eyebrow: string;
    title: string;
    lead: string;
    paragraphs: string[];
    stats: { value: string; label: string }[];
    quote: string;
    signature: string;
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { key: string; title: string; description: string }[];
  };
  gallery: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { title: string; category: string }[];
  };
  banner: {
    title: string;
    subtitle: string;
    button: string;
  };
  beforeAfter: {
    eyebrow: string;
    title: string;
    subtitle: string;
    beforeLabel: string;
    afterLabel: string;
  };
  process: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: { title: string; description: string }[];
  };
  values: {
    eyebrow: string;
    title: string;
    items: { title: string; description: string }[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    items: { quote: string; author: string; role: string }[];
  };
  quote: {
    eyebrow: string;
    title: string;
    subtitle: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      projectTypeLabel: string;
      projectTypeOptions: Option[];
      budgetLabel: string;
      budgetOptions: Option[];
      timelineLabel: string;
      timelineOptions: Option[];
      descriptionLabel: string;
      descriptionPlaceholder: string;
      contactMethodLabel: string;
      contactMethodOptions: Option[];
      consentLabel: string;
      submit: string;
      sending: string;
    };
    orWhatsapp: string;
    whatsappCta: string;
    success: { title: string; body: string };
    error: { title: string; body: string };
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { q: string; a: string }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    phoneLabel: string;
    emailLabel: string;
    whatsappLabel: string;
    locationLabel: string;
    location: string;
    hoursLabel: string;
    hours: string;
    cta: string;
  };
  footer: {
    tagline: string;
    rights: string;
    credit: string;
    quickLinks: string;
    contactTitle: string;
  };
};
