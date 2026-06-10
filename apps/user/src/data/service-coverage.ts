export interface CoverageArea {
  title: string;
  description: string;
}

export const SERVICE_COVERAGE: Record<string, CoverageArea[]> = {
  vapt: [
    {
      title: "Web/API Application VAPT",
      description:
        "Security testing for web and API applications based on OWASP Top 10.",
    },
    {
      title: "Mobile Application VAPT",
      description:
        "Identify vulnerabilities in mobile apps using OWASP Mobile Top 10.",
    },
    {
      title: "Network and Systems VAPT",
      description:
        "Assessment of networks, devices, and systems using SANS Top 25 & OSSTMM.",
    },
    {
      title: "Desktop Application VAPT",
      description:
        "Analyze desktop apps for vulnerabilities to prevent unauthorized access.",
    },
    {
      title: "Cloud Infrastructure VAPT",
      description:
        "Cloud penetration testing and auditing for improved cloud security posture.",
    },
    {
      title: "Web3 Application VAPT",
      description:
        "Audit smart contracts and decentralized applications for security issues.",
    },
   
  ],
  "mobile-flutter": [
    {
      title: "Cross-Platform Architecture",
      description:
        "Design scalable Flutter architectures that perform consistently across iOS and Android.",
    },
    {
      title: "State Management",
      description:
        "Implement robust state management with Riverpod, BLoC, or Provider patterns.",
    },
    {
      title: "API Integration",
      description:
        "Connect mobile apps to backend services with type-safe API clients and offline support.",
    },
    {
      title: "Native Platform Features",
      description:
        "Leverage platform channels for camera, GPS, biometrics, and hardware sensors.",
    },
    {
      title: "App Store Deployment",
      description:
        "Manage end-to-end publishing on Google Play and the Apple App Store.",
    },
    {
      title: "Performance Optimization",
      description:
        "Profile and optimize Flutter apps for smooth 60fps rendering and minimal bundle size.",
    },
    {
      title: "Testing & CI/CD",
      description:
        "Set up widget tests, integration tests, and automated build pipelines for mobile releases.",
    },
  ],
  "web-apps": [
    {
      title: "Full-Stack Architecture",
      description:
        "Design modern web architectures using Next.js, React, and scalable backend services.",
    },
    {
      title: "Database Design",
      description:
        "Model relational data with Postgres, optimize queries, and manage migrations.",
    },
    {
      title: "Authentication & Authorization",
      description:
        "Implement secure auth flows, RBAC, and session management for web applications.",
    },
    {
      title: "API Development",
      description:
        "Build RESTful and GraphQL APIs with proper validation, caching, and rate limiting.",
    },
    {
      title: "Frontend Performance",
      description:
        "Optimize Core Web Vitals, code-split bundles, and implement efficient rendering strategies.",
    },
    {
      title: "DevOps & Deployment",
      description:
        "Configure CI/CD pipelines, containerization, and cloud infrastructure for web apps.",
    },
    {
      title: "Accessibility & SEO",
      description:
        "Ensure WCAG compliance, semantic HTML, and search-engine-optimized page structures.",
    },
  ],
};
