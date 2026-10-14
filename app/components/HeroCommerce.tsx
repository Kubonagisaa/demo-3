"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";

/* ─────────────────────────────────────────────
   TypeScript Interfaces
   ───────────────────────────────────────────── */

export interface DepartmentItem {
  id: string;
  name: string;
  count: number;
  href: string;
}

export interface HotspotPin {
  id: string;
  /** Percentage position from left (0 - 100) */
  x: number;
  /** Percentage position from top (0 - 100) */
  y: number;
  label: string;
  department?: string;
  href?: string;
}

export interface HeroCommerceProps {
  /** High-resolution lifestyle hero photograph covering the entire section */
  imageSrc?: string;
  /** Accessible description of the background photograph */
  imageAlt?: string;
  /** Eyebrow / Catalog edition badge */
  eyebrow?: string;
  /** Main display headline (General Sans) */
  title?: string;
  /** Editorial supporting narrative description */
  description?: string;
  /** Primary button call-to-action label */
  primaryCtaLabel?: string;
  /** Destination route for primary button */
  primaryCtaHref?: string;
  /** Secondary link call-to-action label */
  secondaryCtaLabel?: string;
  /** Destination route for secondary link */
  secondaryCtaHref?: string;
  /** Department quick navigation items */
  departments?: DepartmentItem[];
  /** Optional interactive lifestyle hotspots (maximum 2) */
  hotspots?: HotspotPin[];
  /** Optional container class name */
  className?: string;
}

/* ─────────────────────────────────────────────
   Default Prototype Mock Data (Single-Vendor Concept Store)
   ───────────────────────────────────────────── */

const DEFAULT_DEPARTMENTS: DepartmentItem[] = [
  { id: "workspace", name: "Workspace", count: 180, href: "/collections/workspace" },
  { id: "home-living", name: "Home Living", count: 320, href: "/collections/home-living" },
  { id: "wardrobe", name: "Wardrobe", count: 160, href: "/collections/wardrobe" },
  { id: "technology", name: "Technology", count: 140, href: "/collections/technology" },
  { id: "personal-care", name: "Personal Care", count: 100, href: "/collections/personal-care" },
  { id: "travel", name: "Travel & Accessories", count: 100, href: "/collections/travel-accessories" },
];

const DEFAULT_HOTSPOTS: HotspotPin[] = [
  {
    id: "pin-lamp",
    x: 61,
    y: 54,
    label: "Solid Brass Task Lamp",
    department: "Workspace",
    href: "/collections/workspace",
  },
  {
    id: "pin-journal",
    x: 66,
    y: 77,
    label: "Linen Studio Journal",
    department: "Workspace",
    href: "/collections/workspace",
  },
];

/* ─────────────────────────────────────────────
   Framer Motion Spring Configurations
   ───────────────────────────────────────────── */

const SPRING_PRIMARY = {
  type: "spring" as const,
  stiffness: 260,
  damping: 24,
  mass: 0.8,
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_PRIMARY,
  },
};

/* ─────────────────────────────────────────────
   Subcomponent: Interactive Hotspot Pin
   ───────────────────────────────────────────── */

function HotspotMarker({
  pin,
  reducedMotion,
}: {
  pin: HotspotPin;
  reducedMotion: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 left-[var(--pin-x)] top-[var(--pin-y)]"
      style={
        {
          "--pin-x": `${pin.x}%`,
          "--pin-y": `${pin.y}%`,
        } as React.CSSProperties
      }
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-label={`Inspect ${pin.label}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        className="group relative flex h-7 w-7 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        {/* Subtle breathing ripple */}
        {!reducedMotion && (
          <span
            className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-75 duration-1000"
            aria-hidden="true"
          />
        )}

        {/* Outer glass boundary */}
        <span
          className="relative flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-black/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        >
          {/* Center core dot */}
          <span className="h-2 w-2 rounded-full bg-hc-warm-white transition-colors group-hover:bg-hc-accent" />
        </span>
      </button>

      {/* Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="tooltip"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.92, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 0.94, y: 4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto absolute bottom-9 left-1/2 -translate-x-1/2 w-56 rounded-sm border border-white/20 bg-hc-overlay/90 p-3.5 shadow-2xl backdrop-blur-md"
          >
            <div className="flex flex-col gap-1">
              {pin.department && (
                <span className="font-body text-[10px] font-medium uppercase tracking-[0.16em] text-hc-accent">
                  {pin.department}
                </span>
              )}
              <p className="font-display text-xs font-medium tracking-tight text-white">
                {pin.label}
              </p>
              {pin.href && (
                <a
                  href={pin.href}
                  className="mt-1.5 inline-flex items-center gap-1 font-body text-[11px] font-medium text-hc-secondary transition-colors hover:text-white"
                >
                  <span>View Details</span>
                  <ArrowRight size={11} strokeWidth={1.5} />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component: HeroCommerce
   ───────────────────────────────────────────── */

export default function HeroCommerce({
  imageSrc = "/hero-concept-store.jpg",
  imageAlt = "Architectural minimalist studio workspace and living interior with solid oak desk and natural sunlight",
  eyebrow = "CATALOGUE 2026 — 1,000+ ORIGINALS",
  title = "A More Considered Way to Live.",
  description = "Thoughtfully selected essentials for your workspace, wardrobe, home, and everyday life.",
  primaryCtaLabel = "Explore the Collection",
  primaryCtaHref = "/collections/all",
  secondaryCtaLabel = "Browse Departments",
  secondaryCtaHref = "#departments",
  departments = DEFAULT_DEPARTMENTS,
  hotspots = DEFAULT_HOTSPOTS,
  className = "",
}: HeroCommerceProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const [imageError, setImageError] = useState(false);

  // Enforce maximum 2 subtle hotspots per design constraint
  const activeHotspots = hotspots.slice(0, 2);

  return (
    <section
      aria-label="Homepage Concept Store Hero"
      className={`relative flex min-h-[85vh] w-full flex-col justify-between overflow-hidden bg-hc-overlay text-white lg:h-[90vh] lg:min-h-[720px] lg:max-h-[960px] ${className}`}
    >
      {/* ─────────────────────────────────────────────
          LAYER 1: Full-Bleed Lifestyle Background Image
          ───────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {!imageError ? (
          <motion.div
            className="h-full w-full"
            initial={reducedMotion ? false : { scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 1.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover object-[62%_center] md:object-center"
              onError={() => setImageError(true)}
            />
          </motion.div>
        ) : (
          <div className="h-full w-full bg-[#181715]" />
        )}

        {/* Directional Cinematic Gradient Overlay for High Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-hc-overlay/95 via-hc-overlay/70 to-transparent sm:via-hc-overlay/55 md:via-hc-overlay/40 lg:via-hc-overlay/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-hc-overlay via-transparent to-black/30" />
      </div>

      {/* ─────────────────────────────────────────────
          LAYER 4: Interactive Hotspots (Over Background)
          ───────────────────────────────────────────── */}
      {!imageError && activeHotspots.length > 0 && (
        <div className="pointer-events-none absolute inset-0 z-10 hidden md:block">
          {activeHotspots.map((pin) => (
            <div key={pin.id} className="pointer-events-auto">
              <HotspotMarker pin={pin} reducedMotion={reducedMotion} />
            </div>
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────
          LAYER 2: Main Editorial Content
          ───────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 items-center px-6 pt-24 pb-16 sm:px-10 lg:pl-[8%] lg:pr-12">
        <motion.div
          variants={containerVariants}
          initial={reducedMotion ? "visible" : "hidden"}
          animate="visible"
          className="w-full max-w-[620px]"
        >
          {/* Eyebrow / Catalog Badge */}
          <motion.div variants={fadeUpVariants} className="mb-5 flex items-center gap-2.5">
            <span
              className="h-1.5 w-1.5 rounded-full bg-hc-accent"
              aria-hidden="true"
            />
            <span className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-hc-warm-white/90">
              {eyebrow}
            </span>
          </motion.div>

          {/* Main Display Headline */}
          <motion.h1
            variants={fadeUpVariants}
            className="font-display text-[clamp(2.75rem,5.2vw,4.75rem)] font-medium leading-[1.04] tracking-[-0.03em] text-white"
          >
            {title}
          </motion.h1>

          {/* Supporting Description */}
          <motion.p
            variants={fadeUpVariants}
            className="mt-6 max-w-lg font-body text-base leading-relaxed text-hc-secondary sm:text-[17px] md:mt-7"
          >
            {description}
          </motion.p>

          {/* Primary & Secondary CTAs */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-8 flex flex-wrap items-center gap-5 sm:gap-6 md:mt-10"
          >
            {/* Primary CTA */}
            <a
              href={primaryCtaHref}
              className="inline-flex items-center justify-center rounded-sm bg-hc-warm-white px-7 py-3.5 font-body text-sm font-medium tracking-wide text-hc-overlay shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {primaryCtaLabel}
            </a>

            {/* Secondary CTA */}
            <a
              href={secondaryCtaHref}
              className="group inline-flex items-center gap-2 font-body text-sm font-medium tracking-wide text-hc-warm-white transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>{secondaryCtaLabel}</span>
              <ArrowRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"
                aria-hidden="true"
              />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* ─────────────────────────────────────────────
          LAYER 3: Department Quick Navigation
          ───────────────────────────────────────────── */}
      <nav
        id="departments"
        aria-label="Department Quick Navigation"
        className="relative z-10 w-full border-t border-hc-border bg-hc-overlay/80 backdrop-blur-md"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-6 sm:px-10 lg:px-12">
            <ul className="flex min-w-full items-center justify-between gap-1 py-3.5 sm:py-4">
              {departments.map((dept) => (
                <li key={dept.id} className="flex-shrink-0">
                  <a
                    href={dept.href}
                    className="group relative flex items-center gap-2.5 rounded-sm px-3.5 py-2 font-body text-xs tracking-wider transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <span className="font-medium text-hc-warm-white/90 group-hover:text-white">
                      {dept.name}
                    </span>
                    <span className="font-normal text-hc-secondary/70 group-hover:text-hc-secondary">
                      {dept.count}
                    </span>

                    {/* Subtle hairline hover underline indicator */}
                    <span
                      className="absolute inset-x-3.5 bottom-1 h-[1px] origin-left scale-x-0 bg-hc-accent transition-transform duration-300 ease-out group-hover:scale-x-100"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </section>
  );
}
