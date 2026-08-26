import type { ComponentType, SVGProps } from "react";

import GitHub from "../assets/icons/github.svg";
import Instagram from "../assets/icons/instagram.svg";
import LinkedIn from "../assets/icons/linkedin.svg";
import Substack from "../assets/icons/substack.svg";
import Threads from "../assets/icons/threads.svg";
import TikTok from "../assets/icons/tiktok.svg";
import YouTube from "../assets/icons/youtube.svg";

export type MenuItem = {
  label: string;
  href: string;
  active?: boolean;
  subLinks?: MenuItem[];
};

export type RecruiterAction = {
  label: string;
  href: string;
  available: boolean;
  download?: boolean;
};

export type SocialIcon = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const resumeHref = "/resume/ariela-israel-general-resume.pdf";

export const MenuItems: MenuItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Experience",
    href: "/experience",
  },
  {
    label: "Projects",
    href: "/projects",
  },
  {
    label: "Diary",
    href: "/field-notes",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export const RecruiterActions: RecruiterAction[] = [
  {
    label: "Experience",
    href: "/experience",
    available: false,
  },
  {
    label: "Resume",
    href: "/resume/arielaisrael-resume.pdf",
    available: false,
    download: true,
  },
];

export const SocialIcons: SocialIcon[] = [
  {
    label: "GitHub",
    href: "https://github.com/thearielaisrael",
    icon: GitHub,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/ariela-israel",
    icon: LinkedIn,
  },
  {
    label: "The Informatics Diary on Substack",
    href: "https://theinformaticsdiary.substack.com",
    icon: Substack,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@thearielaisrael",
    icon: YouTube,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/thearielaisrael",
    icon: Instagram,
  },
  {
    label: "Threads",
    href: "https://threads.com/thearielaisrael",
    icon: Threads,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@thearielaisrael",
    icon: TikTok,
  },
];
