/**
 * ==========================================================================
 * CENTRALIZED PORTFOLIO DATA — WALEED HASSAN
 * Single source of truth for Profile, Experience, Projects, Skills & Education.
 * Easily add new experience, internships, or projects by appending to the arrays below.
 * ==========================================================================
 */

const PORTFOLIO_DATA = {
  profile: {
    name: "Waleed Hassan",
    label: "COMPUTER SCIENCE STUDENT & DEVELOPER",
    headline: "Building Ideas Into Reality.",
    description: "Third-year BS Computer Science student at University of Engineering and Technology, Lahore, based in Gujranwala. Focused on building high-performance algorithms, database architectures, and full-stack software applications.",
    status: "Third Year BS Computer Science",
    university: "University of Engineering and Technology, Lahore",
    residence: "Gujranwala",
    location: "Gujranwala, Pakistan",
    githubUrl: "https://github.com/Waleedhasn",
    githubUsername: "Waleedhasn",
    linkedinUrl: "https://www.linkedin.com/in/waleed-hassan-98768b330/",
    email: "grw2206420@outlook.com"
  },

  /**
   * EXPERIENCE DATA
   * Add any future internships, jobs, freelance work, or project milestones here.
   * Each entry automatically renders in the Experience page timeline without markup duplication.
   */
  experience: [
    {
      id: "hr-mega-market",
      title: "Data Entry Specialist",
      organization: "H&R Mega Market",
      employmentType: "Verified Employment",
      badgeType: "employment", // 'employment' | 'practice' | 'project'
      startDate: "2023",
      endDate: "2024",
      isCurrent: false,
      location: "On-site",
      description: "Managed operational data entry processes, maintaining accurate catalog records, inventory logging, and transactional data consistency with high attention to detail.",
      responsibilities: [
        "Maintained structured inventory records and catalog data integrity across operations.",
        "Validated transactional receipts and stock movement logs with strict precision.",
        "Supported internal auditing by systematically cataloging product codes and price updates."
      ],
      technologies: ["Data Logging", "Inventory Tracking", "Microsoft Office", "Catalog Management"],
      accomplishments: [
        "Consistently maintained verified transactional logging accuracy across operations."
      ],
      link: null
    },
    {
      id: "web-development-practice",
      title: "Web Development",
      organization: "Development Journey & Independent Practice",
      employmentType: "Practice Area",
      badgeType: "practice",
      startDate: "2023",
      endDate: "Present",
      isCurrent: true,
      location: "Independent",
      description: "Constructing responsive user interfaces, structured semantic HTML, modern styling systems, and interactive JavaScript web applications.",
      responsibilities: [
        "Designing responsive layouts utilizing CSS Grid, Flexbox, and tailored design systems.",
        "Developing dynamic frontend interfaces with vanilla JavaScript and asynchronous API integration.",
        "Focusing on web accessibility, performance optimization, and cross-browser resilience."
      ],
      technologies: ["HTML5", "CSS3", "JavaScript", "Node.js", "REST APIs"],
      accomplishments: [
        "Engineered responsive, accessible web layouts adhering to modern UI/UX design standards."
      ],
      link: "https://github.com/Waleedhasn"
    },
    {
      id: "game-development-practice",
      title: "Game Development",
      organization: "Development Journey & Independent Practice",
      employmentType: "Practice Area",
      badgeType: "practice",
      startDate: "2024",
      endDate: "Present",
      isCurrent: true,
      location: "Independent",
      description: "Building interactive logic, card deck simulation engines, algorithmic rulesets, and structured state machines in C++.",
      responsibilities: [
        "Architected game loop mechanics and object-oriented entity hierarchies.",
        "Programmed legal move validation and state transitions for card engines.",
        "Optimized computational performance and algorithmic efficiency for real-time interaction."
      ],
      technologies: ["C++", "Object-Oriented Design", "Game Logic", "State Management"],
      accomplishments: [
        "Engineered complete Solitaire card engine with validation and state management."
      ],
      link: "https://github.com/Waleedhasn/CSC200M24PID51"
    },
    {
      id: "application-development-practice",
      title: "Application Development",
      organization: "Development Journey & Independent Practice",
      employmentType: "Practice Area",
      badgeType: "practice",
      startDate: "2024",
      endDate: "Present",
      isCurrent: true,
      location: "Independent",
      description: "Designing store management and academic workflow software with modular object models, file serialization, and structured business logic.",
      responsibilities: [
        "Built enterprise-style object-oriented architectures for store and inventory management.",
        "Implemented data persistence, ledger tracking, and record indexing.",
        "Modeled normalized relational schemas for academic thesis and assignment portals."
      ],
      technologies: ["C#", "Python", "SQL", "MySQL", "OOP Architectures"],
      accomplishments: [
        "Developed full store management inventory application with data persistence."
      ],
      link: "https://github.com/Waleedhasn/OOP-semester-2"
    }
  ],

  /**
   * FEATURED PROJECTS
   * Verified projects from Waleed Hassan's GitHub repositories.
   */
  projects: [
    {
      id: "assignment-system",
      title: "Assignment Management System",
      category: "Data Structures & Algorithms",
      badge: "Featured Centerpiece",
      description: "An algorithmic assignment tracking and management system designed to coordinate submissions, deadlines, and student evaluations using optimized data structures.",
      technologies: ["Python", "DSA", "Data Structures", "Algorithms", "File I/O"],
      githubUrl: "https://github.com/Waleedhasn/DSAFINALPROJECT/commit/98eb44240d9ab30b866ae73d66897020bfa3549e",
      repoUrl: "https://github.com/Waleedhasn/DSAFINALPROJECT",
      details: [
        "Implemented custom data structures for efficient task sorting, prioritization, and rapid lookup.",
        "Automated deadline notifications and status lifecycle for student submissions.",
        "Architected modular Python codebase following clean computational complexity principles."
      ]
    },
    {
      id: "thesis-system",
      title: "Thesis Management System",
      category: "Database Systems",
      badge: "Academic System",
      description: "A database-driven academic portal engineered to organize, archive, and manage undergraduate thesis proposals, evaluations, and supervisor allocations.",
      technologies: ["SQL", "MySQL", "Database Design", "Relational Schema"],
      githubUrl: "https://github.com/Waleedhasn/DBS25F001/tree/master/Thesis%20Management%20System",
      repoUrl: "https://github.com/Waleedhasn/DBS25F001",
      details: [
        "Constructed normalized relational schema ensuring strict referential integrity across students, faculty, and theses.",
        "Optimized relational SQL queries for high-speed search across research topics, domains, and supervisor slots.",
        "Implemented comprehensive record tracking for proposal approval workflows and defense schedules."
      ]
    },
    {
      id: "solitaire-game",
      title: "Solitaire Game",
      category: "Game Development",
      badge: "Interactive Logic",
      description: "A classic Solitaire card game engineered with custom game loop mechanics, state management, algorithmic card movement verification, and card foundation logic.",
      technologies: ["C++", "Game Architecture", "OOP", "Algorithm Design"],
      githubUrl: "https://github.com/Waleedhasn/CSC200M24PID51/commit/f5c97e604f44a2a733906d4a834b34c073741938",
      repoUrl: "https://github.com/Waleedhasn/CSC200M24PID51",
      details: [
        "Modeled complete standard 52-card deck distribution, tableau columns, waste piles, and foundation stacks.",
        "Designed rule verification algorithms ensuring valid card moves and suit-alternating sequences.",
        "Structured object-oriented components for low-latency game state transitions."
      ]
    },
    {
      id: "inventory-system",
      title: "Inventory Management System",
      category: "Store Management",
      badge: "Enterprise OOP",
      description: "An object-oriented store and inventory management system handling item cataloging, stock thresholds, supplier data, and real-time transaction processing.",
      technologies: ["C#", "OOP", "File Handling", "Store Architecture"],
      githubUrl: "https://github.com/Waleedhasn/OOP-semester-2/tree/main/2024-CS-51/StoreManagement",
      repoUrl: "https://github.com/Waleedhasn/OOP-semester-2",
      details: [
        "Developed object-oriented models encapsulating product inventory, reorder thresholds, and billing records.",
        "Integrated file serialization and persistence for continuous ledger maintenance.",
        "Engineered administrative controls for real-time stock deductions and restock auditing."
      ]
    }
  ],

  /**
   * VERIFIED PUBLIC GITHUB REPOSITORIES CACHE
   */
  verifiedReposFallback: [
    {
      name: "DSAFINALPROJECT",
      description: "Assignment Management System built with Python leveraging optimized Data Structures and Algorithms.",
      language: "Python",
      stars: 0,
      forks: 0,
      url: "https://github.com/Waleedhasn/DSAFINALPROJECT",
      updated: "2025-12-31"
    },
    {
      name: "OOP-semester-2",
      description: "Object-Oriented Programming repository containing StoreManagement Inventory System and modular architectures.",
      language: "C#",
      stars: 0,
      forks: 0,
      url: "https://github.com/Waleedhasn/OOP-semester-2",
      updated: "2025-05-11"
    },
    {
      name: "PD-Semester-1",
      description: "Foundational programming and algorithmic problem solving implementations in C++.",
      language: "C++",
      stars: 0,
      forks: 0,
      url: "https://github.com/Waleedhasn/PD-Semester-1",
      updated: "2025-03-30"
    }
  ],

  /**
   * EDUCATION TIMELINE
   */
  education: [
    {
      degree: "Bachelor of Science in Computer Science (BS Computer Science)",
      status: "Third Year (Currently In Progress)",
      institution: "University of Engineering and Technology, Lahore",
      location: "Lahore / Gujranwala, Pakistan",
      dates: "2023 – 2027 (Expected)",
      description: "Engaging in core Computer Science curriculum encompassing Data Structures, Algorithms, Object-Oriented Programming, Database Systems, Computer Architecture, and Software Engineering methodologies.",
      coursework: [
        "Data Structures & Algorithms",
        "Database Systems & SQL",
        "Object-Oriented Programming",
        "Software Engineering",
        "Discrete Mathematics"
      ]
    }
  ]
};

// Export to window if in browser environment
if (typeof window !== 'undefined') {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}
