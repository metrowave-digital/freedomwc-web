// src/app/portal/nav/nav.config.ts

import {
  BookOpen,
  Calendar,
  Map,
  Play,
  Heart,
  MessageSquare,
  GraduationCap,
  ClipboardList,
  Users,
  CheckSquare,
  Layers,
  PenTool,
  TrendingUp,
  Settings,
  Bell,
} from "lucide-react"

import type { FWCRole } from "../../../access/roles"

/* ======================================================
   Nav Types
====================================================== */

export type NavItem = {
  label: string
  href?: string
  icon?: React.ElementType
  external?: boolean
  minRole?: FWCRole
  children?: NavItem[]
}

/* ======================================================
   MAIN NAVIGATION
====================================================== */

export const MAIN_NAV: NavItem[] = [
  /* ====================================================
     CORE
  ==================================================== */

  {
    label: "Dashboard",
    href: "/portal",
    icon: BookOpen,
    minRole: "viewer",
  },

  {
    label: "Events",
    href: "/portal/events",
    icon: Calendar,
    minRole: "member",
  },

  /* ====================================================
     PATHWAYS — LMS & FORMATION HUB
  ==================================================== */

  {
    label: "Pathways",
    href: "/portal/pathways",
    icon: Map,
    minRole: "student",
    children: [
      /* -----------------------------
         LEARNER OVERVIEW
      ------------------------------ */

      {
        label: "Overview",
        minRole: "student",
        children: [
          {
            label: "My Journey",
            href: "/portal/pathways/journey",
            icon: TrendingUp,
            minRole: "student",
          },
          {
            label: "Progress",
            href: "/portal/pathways/progress",
            icon: TrendingUp,
            minRole: "student",
          },
          {
            label: "Journal",
            href: "/portal/pathways/journal",
            icon: BookOpen,
            minRole: "student",
          },
        ],
      },

      /* -----------------------------
         LEARNING
      ------------------------------ */

      {
        label: "Learning",
        minRole: "student",
        children: [
          {
            label: "My Courses",
            href: "/portal/pathways/courses",
            icon: GraduationCap,
            minRole: "student",
          },
          {
            label: "Modules & Lessons",
            href: "/portal/pathways/lessons",
            icon: Layers,
            minRole: "student",
          },
          {
            label: "Weekly Experiences",
            href: "/portal/pathways/weeks",
            icon: Calendar,
            minRole: "student",
          },
        ],
      },

      /* -----------------------------
         PRACTICE & FORMATION
      ------------------------------ */

      {
        label: "Formation",
        minRole: "student",
        children: [
          {
            label: "Formation Practices",
            href: "/portal/pathways/practices",
            icon: PenTool,
            minRole: "student",
          },
          {
            label: "Assessments",
            href: "/portal/pathways/assessments",
            icon: CheckSquare,
            minRole: "student",
          },
          {
            label: "Assignments",
            href: "/portal/pathways/assignments",
            icon: ClipboardList,
            minRole: "student",
          },
        ],
      },

      /* -----------------------------
         COMMUNITY & GUIDANCE
      ------------------------------ */

      {
        label: "Community",
        minRole: "student",
        children: [
          {
            label: "My Cohort",
            href: "/portal/pathways/cohort",
            icon: Users,
            minRole: "student",
          },
          {
            label: "Mentors",
            href: "/portal/pathways/mentors",
            icon: Users,
            minRole: "mentor",
          },
        ],
      },

      /* -----------------------------
         INSTRUCTOR VIEW
      ------------------------------ */

      {
        label: "Teaching",
        minRole: "instructor",
        children: [
          {
            label: "My Courses",
            href: "/portal/pathways/instructor/courses",
            icon: GraduationCap,
            minRole: "instructor",
          },
          {
            label: "Submissions",
            href: "/portal/pathways/instructor/submissions",
            icon: ClipboardList,
            minRole: "instructor",
          },
          {
            label: "Sessions & Attendance",
            href: "/portal/pathways/instructor/sessions",
            icon: Calendar,
            minRole: "instructor",
          },
        ],
      },

      /* -----------------------------
         LEADERSHIP & ADMIN
      ------------------------------ */

      {
        label: "Administration",
        minRole: "leader",
        children: [
          {
            label: "Programs & Phases",
            href: "/portal/pathways/programs",
            icon: Layers,
            minRole: "leader",
          },
          {
            label: "Enrollments",
            href: "/portal/pathways/enrollments",
            icon: ClipboardList,
            minRole: "staff",
          },
          {
            label: "Notifications",
            href: "/portal/pathways/notifications",
            icon: Bell,
            minRole: "staff",
          },
          {
            label: "Pathways Settings",
            href: "/portal/pathways/settings",
            icon: Settings,
            minRole: "admin",
          },
        ],
      },
    ],
  },

  /* ====================================================
     MEDIA & COMMUNITY
  ==================================================== */

  {
    label: "Media",
    href: "/portal/media",
    icon: Play,
    minRole: "viewer",
  },

  {
    label: "Community",
    href: "/portal/community",
    icon: MessageSquare,
    minRole: "member",
  },

  {
    label: "Giving",
    href: "/portal/giving",
    icon: Heart,
    minRole: "member",
  },
]

/* ======================================================
   FOOTER NAV
====================================================== */

export const FOOTER_NAV: NavItem[] = [
  {
    label: "Support",
    href: "/support",
    minRole: "viewer",
  },
  {
    label: "Terms",
    href: "/terms",
    minRole: "viewer",
  },
  {
    label: "Privacy",
    href: "/privacy",
    minRole: "viewer",
  },
]
