export type NavItem = {
  readonly href: string;
  readonly label: string;
  readonly activePath?: string;
};

export type ExternalNavItem = {
  readonly href: string;
  readonly icon: string;
  readonly label: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/hello", label: "Hello!" },
  { href: "/work/public", label: "Work", activePath: "/work" },
  { href: "/colleagues", label: "Colleagues" },
  { href: "/blog", label: "Blog" },
  { href: "/thoughts", label: "Thoughts" },
  { href: "/photos", label: "Photos" },
  { href: "/about", label: "About" },
];

export const EXTERNAL_NAV_ITEMS = [
  {
    href: "https://github.com/andymerskin",
    icon: "ri-github-fill",
    label: "GitHub",
  },
  {
    href: "https://codepen.io/andymerskin",
    icon: "ri-codepen-fill",
    label: "CodePen",
  },
  {
    href: "https://www.linkedin.com/in/andymerskin/",
    icon: "ri-linkedin-fill",
    label: "LinkedIn",
  },
  {
    href: "https://dribbble.com/andymerskin",
    icon: "ri-dribbble-fill",
    label: "Dribbble",
  },
] as const satisfies ExternalNavItem[];

export const normalizePathname = (pathname: string) => {
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
};

export const isActiveNavItem = (currentPath: string, item: NavItem) => {
  const normalizedCurrent = normalizePathname(currentPath);
  const itemPath = normalizePathname(item.href);
  const activePath = normalizePathname(item.activePath ?? item.href);

  return (
    activePath === normalizedCurrent ||
    (activePath !== "/" && normalizedCurrent.startsWith(`${activePath}/`))
  );
};
