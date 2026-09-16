type Social = {
  name: string;
  url: string;
};

type PersonalInfo = {
  name: string;
  role: string;
  bio: string;
  location: string;
  socials: Social[];
};

type Skill = {
  name: string;
  category: string;
  level: number;
};

export type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
  link: string;
  github: string;
  previewAssets: string[]
};

export const personalInfo: PersonalInfo = {
  name: "Muhammad Rendy Ramadanni",
  role: "Full-Stack Developer & UI/UX Enthusiast",
  bio: "I create responsive, fast, and interactive digital experiences using modern web technologies.",
  location: "Jakarta, Indonesia",
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/KOKRendy"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/muhammad-rendy-ramadanni-793706296"
    },
    {
      name: "Twitter",
      url: "https://twitter.com"
    }
  ]
};

export const skills: Skill[] = [
  {
    name: "Laravel",
    category: "Backend",
    level: 98
  },
  {
    name: "JavaScript / TypeScript",
    category: "Language",
    level: 90
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    level: 95
  },
  {
    name: "Next Js",
    category: "Frontend",
    level: 90
  },
  {
    name: "PostgreSQL / MongoDB",
    category: "Database",
    level: 80
  },
  {
    name: "React Js",
    category: "Frontend",
    level: 85
  }
];

export const projects: Project[] = [
  {
    id: 1,
    title: "Cmc Tiga Warna",
    category: "CMS",
    description:
      "A professional company profile website showcasing CMC Tiga Warna's services, projects, and information.",
    tech: [
      "Laravel",
      "Tailwind CSS",
      "React Js",
      "Filament PHP",
      "Mysql"
    ],
    link: "https://cmctigawarna.com",
    github: "#",
    previewAssets: []
  },
  {
    id: 2,
    title: "Simrs Medivora",
    category: "SIMRS",
    description:
      "A comprehensive hospital information system for managing healthcare services, patient data, and clinical workflows.",
    tech: [
      "Laravel",
      "Tailwind CSS",
      "Next Js",
      "Postgresql"
    ],
    link: "https://simrs-medivora.buatin-website.com",
    github: "#",
    previewAssets: ["/projects/simrs-medivora/1.png", "/projects/simrs-medivora/2.png"],
  },
  {
    id: 3,
    title: "Odobi",
    category: "POS",
    description:
      "A modern point-of-sale system for managing transactions, products, inventory, and business operations.",
    tech: [
      "Laravel",
      "Tailwind CSS",
      "React Js",
      "Mysql"
    ],
    link: "#",
    github: "https://github.com/KOKRendy/Odobi-Laravel",
    previewAssets: [],
  }
];