"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  X,
  ArrowRight,
  Globe,
  Factory,
  Leaf,
  Truck,
  Headphones,
  ChevronDown,
  Monitor,
  Coffee,
  Shirt,
  Cpu,
  Sparkles,
  Compass,
  Layers,
  ExternalLink,
  Plus,
  User,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/app/lib/i18n";
import { useCart, type CartItem } from "@/app/lib/cart";
import { departments, products, type CategorySlug, type Product } from "@/app/lib/data";
import { ProductCard } from "@/app/components/ProductCard";
import { CartDrawer } from "@/app/components/CartDrawer";
import { ProfileDrawer } from "@/app/components/ProfileDrawer";
import { AnimatedNumber } from "@/app/components/AnimatedNumber";
import { ProductQuickView } from "@/app/components/ProductQuickView";
import { ToastNotification } from "@/app/components/ToastNotification";
import { HavenJournal } from "@/app/components/HavenJournal";

/* ════════════════════════════════════════════════════
   CUSTOM ICONS & CATEGORY ICON MAPPER
   ════════════════════════════════════════════════════ */

function InstagramIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const CATEGORY_ICONS: Record<CategorySlug, React.ComponentType<{ size?: number; className?: string }>> = {
  workspace: Monitor,
  living: Coffee,
  wardrobe: Shirt,
  tech: Cpu,
  care: Sparkles,
  travel: Compass,
};

/* ════════════════════════════════════════════════════
   TYPOGRAPHY & LOGO ANIMATION HELPERS
   ════════════════════════════════════════════════════ */

function AnimatedLogo() {
  const letters = ["H", "A", "V", "E", "N"];

  return (
    <motion.a
      href="/"
      className="group inline-flex items-center gap-1.5 cursor-pointer select-none"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="font-display font-bold text-[22px] tracking-[-0.03em] text-[#F8F7F2] flex items-center overflow-hidden">
        {letters.map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.05 + i * 0.06,
            }}
            className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
          >
            {char}
          </motion.span>
        ))}
      </span>
      {/* Animated Sage jewel dot */}
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 400, damping: 20 }}
        className="w-1.5 h-1.5 rounded-full bg-[#7D927C] transition-all duration-300 group-hover:scale-150 group-hover:bg-[#F8F7F2]"
      />
    </motion.a>
  );
}

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

function AnimatedHeadline({ text, className, delay = 0.2 }: AnimatedTextProps) {
  const lines = text.split("\n");

  return (
    <h1 className={className}>
      {lines.map((line, lineIdx) => {
        const words = line.split(" ");
        return (
          <span key={lineIdx} className="block overflow-hidden py-0.5">
            {words.map((word, wordIdx) => (
              <motion.span
                key={wordIdx}
                className="inline-block mr-[0.25em] last:mr-0"
                initial={{ y: "115%", opacity: 0, rotate: 1.5 }}
                animate={{ y: "0%", opacity: 1, rotate: 0 }}
                transition={{
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1],
                  delay: delay + lineIdx * 0.12 + wordIdx * 0.04,
                }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        );
      })}
    </h1>
  );
}

function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : ""}`}>
      {/* Eyebrow with animated line & letter expansion */}
      <motion.div
        initial={{ opacity: 0, x: align === "center" ? 0 : -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`flex items-center gap-3 mb-3 ${align === "center" ? "justify-center" : ""}`}
      >
        <span className="w-5 h-[1.5px] bg-[#7D927C] rounded-full inline-block" />
        <span className="font-body text-[11px] tracking-[0.2em] uppercase text-[#7D927C] font-semibold">
          {eyebrow}
        </span>
      </motion.div>

      {/* Title with overflow-hidden mask reveal */}
      <div className="overflow-hidden">
        <motion.h2
          initial={{ y: "100%", opacity: 0 }}
          whileInView={{ y: "0%", opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="font-display font-bold text-[#292D29] text-3xl md:text-[2.75rem] tracking-[-0.03em]"
        >
          {title}
        </motion.h2>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   1. STICKY HEADER (Animated Logo, Icons & Live Search)
   ════════════════════════════════════════════════════ */

function SiteHeader({
  onQuickView,
  onAddToCart,
  onOpenProfile,
}: {
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenProfile: () => void;
}) {
  const { lang, toggle, t } = useLanguage();
  const { openCart, totalItems } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameZh.includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const popularTags = [
    { labelEn: "Desk Lamp", labelZh: "台灯", query: "Lamp" },
    { labelEn: "Merino Tee", labelZh: "羊毛T恤", query: "Merino" },
    { labelEn: "Ceramic Mug", labelZh: "马克杯", query: "Mug" },
    { labelEn: "Charger", labelZh: "无线充", query: "Charger" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#292D29]/95 backdrop-blur-md border-b border-white/10 text-[#F8F7F2]">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between h-16 px-6 md:px-10">
        {/* Animated Kinetic Logo */}
        <AnimatedLogo />

        {/* Center Category Navigation Menu with Icons */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7" aria-label="Department navigation">
          {departments.map((dept) => {
            const Icon = CATEGORY_ICONS[dept.slug];
            return (
              <motion.a
                key={dept.slug}
                href="#catalog"
                whileHover={{ y: -1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="font-body text-xs font-medium tracking-[0.06em] uppercase text-[#F8F7F2]/80 hover:text-[#F8F7F2] transition-colors duration-200 relative group cursor-pointer flex items-center gap-1.5"
              >
                <Icon size={13} className="text-[#7D927C] group-hover:scale-110 transition-transform" />
                <span>{t(dept.nameKey)}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#7D927C] group-hover:w-full transition-all duration-300 rounded-full" />
              </motion.a>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1 text-[#F8F7F2]">
          {/* Live Search toggle */}
          <motion.button
            id="search-trigger"
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2.5 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label={t("search")}
          >
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </motion.button>

          {/* Language toggle with smooth text flip */}
          <motion.button
            id="lang-toggle"
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={toggle}
            className="p-2.5 rounded-full hover:bg-white/10 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            aria-label="Switch language"
          >
            <Globe size={16} />
            <AnimatePresence mode="wait">
              <motion.span
                key={lang}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="font-body text-xs font-semibold tracking-wider uppercase text-[#F8F7F2]"
              >
                {lang === "en" ? "中文" : "EN"}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Profile / Member account trigger */}
          <motion.button
            id="profile-trigger"
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onOpenProfile}
            className="p-2.5 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer relative"
            aria-label={lang === "en" ? "Member Profile" : "会员中心"}
          >
            <User size={18} />
          </motion.button>

          {/* Cart trigger with pulse badge */}
          <motion.button
            id="cart-trigger"
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={openCart}
            className="p-2.5 rounded-full hover:bg-white/10 hover:text-white transition-colors relative cursor-pointer"
            aria-label={t("bag")}
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="absolute -top-0.5 -right-0.5 bg-[#7D927C] text-[#F8F7F2] text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs"
              >
                {totalItems}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Expanded Live Search Overlay Panel */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 bg-[#292D29]"
          >
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5">
              {/* Search input field */}
              <div className="relative mb-4">
                <input
                  autoFocus
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={lang === "en" ? "Search 1,000+ curated products" : "搜索精选商品"}
                  placeholder={lang === "en" ? "Search 1,000+ curated products..." : "搜索1,000+精选商品..."}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#7D927C] rounded-2xl px-5 py-3 font-body text-base outline-none text-[#F8F7F2] placeholder:text-[#F8F7F2]/40 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F8F7F2]/50 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Live Search Results */}
              {searchQuery.trim() ? (
                <div className="py-2">
                  <p className="font-body text-xs text-[#E8E5DA]/60 mb-3 uppercase tracking-wider">
                    {searchResults.length}{" "}
                    {lang === "en" ? "results found" : "个搜索结果"}
                  </p>
                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer group"
                          onClick={() => {
                            onQuickView(product);
                            setSearchOpen(false);
                          }}
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#E8E5DA] flex-shrink-0">
                            <Image
                              src={product.image}
                              alt={lang === "en" ? product.name : product.nameZh}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-xs font-semibold text-[#F8F7F2] truncate group-hover:text-[#7D927C] transition-colors">
                              {lang === "en" ? product.name : product.nameZh}
                            </p>
                            <p className="font-body text-xs text-[#E8E5DA]/70">${product.price}</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(product);
                            }}
                            className="p-1.5 rounded-lg bg-[#34483B] hover:bg-[#28382E] text-white transition-colors"
                            aria-label="Add to bag"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-body text-sm text-[#E8E5DA]/50 py-4">
                      {lang === "en"
                        ? "No matching products found. Try another keyword."
                        : "未找到相关商品，请尝试其他关键词。"}
                    </p>
                  )}
                </div>
              ) : (
                /* Popular Search suggestions */
                <div className="flex items-center gap-2 flex-wrap text-xs text-[#E8E5DA]/70 pt-1">
                  <span className="font-semibold uppercase tracking-wider text-[#7D927C] mr-1">
                    {lang === "en" ? "Popular:" : "热门搜索:"}
                  </span>
                  {popularTags.map((tag) => (
                    <button
                      key={tag.query}
                      type="button"
                      onClick={() => setSearchQuery(tag.query)}
                      className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[#F8F7F2] transition-colors cursor-pointer"
                    >
                      {lang === "en" ? tag.labelEn : tag.labelZh}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ════════════════════════════════════════════════════
   2. CINEMATIC HERO (With Kinetic Typography & Hotspot)
   ════════════════════════════════════════════════════ */

function HeroSection({ onAddToCart }: { onAddToCart: (product: Product) => void }) {
  const { t, lang } = useLanguage();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const headline = t("headline");

  return (
    <section id="hero" className="relative h-[88svh] sm:h-[88vh] md:h-[90vh] min-h-[580px] md:min-h-[620px] max-h-[1050px] overflow-hidden bg-[#292D29]">
      {/* Background with subtle slow scale */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Mobile portrait photograph (native 9:16 tailored for phone screens) */}
        <div className="block md:hidden absolute inset-0">
          <Image
            src="/hero-concept-store-mobile.jpg"
            alt="Haven concept store interior"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1px"
          />
        </div>

        {/* Desktop landscape photograph (wide 16:9 for large displays) */}
        <div className="hidden md:block absolute inset-0">
          <Image
            src="/hero-concept-store.jpg"
            alt="Haven concept store"
            fill
            priority
            className="object-cover object-center"
            sizes="(min-width: 769px) 100vw, 1px"
          />
        </div>
      </motion.div>

      {/* Gradients: Mobile deep vertical vignette + Desktop directional vignette */}
      <div className="block md:hidden absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 pointer-events-none" />
      <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20 pointer-events-none" />
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none" />

      {/* Interactive Lifestyle Hotspot 1: Brass Lamp */}
      <div className="absolute left-[63%] top-[48%] z-20 -translate-x-1/2 -translate-y-1/2 hidden md:block">
        <div className="relative group">
          <button
            type="button"
            onClick={() => setActiveHotspot(activeHotspot === "lamp" ? null : "lamp")}
            aria-expanded={activeHotspot === "lamp"}
            className="relative flex items-center justify-center w-8 h-8 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Inspect Arc Desk Lamp"
          >
            <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
            <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-black/50 border border-white/60 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-[#F8F7F2] group-hover:bg-[#7D927C] transition-colors" />
            </span>
          </button>

          {/* Hotspot Popover Card */}
          <div
            className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-52 p-3 rounded-xl bg-[#F8F7F2] border border-[#D8D4C7] shadow-xl transition-all duration-300 ${
              activeHotspot === "lamp"
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
            }`}
          >
            <p className="font-body text-[10px] uppercase tracking-wider text-[#7D927C] font-semibold mb-0.5">
              Workspace
            </p>
            <p className="font-body text-xs font-semibold text-[#292D29] line-clamp-1">
              {lang === "en" ? "Arc Desk Lamp" : "弧形台灯"}
            </p>
            <p className="font-body text-xs font-medium text-[#292D29]/75 mb-2">$189</p>
            <button
              type="button"
              onClick={() => {
                const lamp = products.find((p) => p.id === "w1");
                if (lamp) onAddToCart(lamp);
              }}
              className="w-full bg-[#34483B] hover:bg-[#28382E] text-[#F8F7F2] font-body text-[10px] font-semibold tracking-wider uppercase py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              {lang === "en" ? "Add to Bag" : "加入购物袋"}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-[1400px] mx-auto px-5 sm:px-6 md:px-10 flex flex-col justify-end pb-22 sm:pb-22 md:pb-24">
        {/* Kicker with animated letter expansion */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.65 }}
          className="flex items-center gap-3 mb-4 sm:mb-5"
        >
          <span className="w-6 h-[1.5px] bg-[#7D927C] rounded-full inline-block" />
          <p className="font-body text-[11px] tracking-[0.22em] uppercase text-[#E8E5DA] drop-shadow-sm font-semibold">
            {t("kicker")}
          </p>
        </motion.div>

        {/* Word-by-word Split Mask Reveal Headline */}
        <AnimatedHeadline
          key={lang + headline}
          text={headline}
          delay={0.25}
          className="font-display font-bold text-[#F8F7F2] text-[clamp(2.1rem,6.5vw,5.5rem)] leading-[1.06] tracking-[-0.035em] max-w-3xl whitespace-pre-line mb-4 sm:mb-6 drop-shadow-md"
        />

        {/* Hero Narrative Copy with soft blur-up reveal */}
        <motion.p
          key={lang + t("heroCopy")}
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.6, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-[#E8E5DA] text-sm sm:text-base md:text-lg max-w-lg mb-6 sm:mb-8 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] line-clamp-3 sm:line-clamp-none"
        >
          {t("heroCopy")}
        </motion.p>

        {/* Buttons with hover lift and tap springs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          {/* Primary CTA */}
          <motion.a
            href="#catalog"
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-full sm:w-auto justify-center inline-flex items-center gap-2 bg-[#F8F7F2] text-[#292D29] font-body font-semibold text-xs sm:text-sm tracking-[0.02em] px-6 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.4)] hover:bg-white hover:shadow-[0_10px_28px_rgba(0,0,0,0.5)] transition-all duration-200 cursor-pointer text-center"
          >
            {t("ctaPrimary")}
          </motion.a>

          {/* Secondary CTA */}
          <motion.a
            href="#departments"
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-full sm:w-auto justify-center group inline-flex items-center gap-2 backdrop-blur-md bg-white/20 border border-white/50 text-[#F8F7F2] font-body text-xs sm:text-sm tracking-[0.02em] px-6 sm:px-7 py-3 sm:py-3.5 rounded-full hover:bg-white/30 hover:border-white/70 shadow-lg transition-all duration-200 cursor-pointer text-center"
          >
            <span>{t("ctaSecondary")}</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </motion.a>
        </motion.div>
      </div>

      {/* Bottom department quick-nav with animated numbers & icons */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-10 py-3 sm:py-4 flex gap-5 sm:gap-6 overflow-x-auto scrollbar-none">
          {departments.map((d) => {
            const Icon = CATEGORY_ICONS[d.slug];
            return (
              <motion.a
                key={d.slug}
                href="#catalog"
                whileHover={{ y: -1 }}
                className="flex-shrink-0 font-body text-xs tracking-[0.08em] uppercase text-[#E8E5DA]/80 hover:text-[#F8F7F2] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Icon size={12} className="text-[#7D927C]" />
                <span>{useLanguage().t(d.nameKey)}</span>
                <span className="ml-1 text-[#E8E5DA]/50">
                  <AnimatedNumber value={d.count} />
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   3. CATEGORY ICON RAIL (Mục Icon các phân mục)
   ════════════════════════════════════════════════════ */

function CategoryIconRail({ onSelectCategory }: { onSelectCategory: (slug: CategorySlug) => void }) {
  const { t, lang } = useLanguage();

  return (
    <section className="bg-[#F8F7F2] py-12 md:py-16 border-b border-[#D8D4C7]/60">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-4 h-[1.5px] bg-[#7D927C] rounded-full inline-block" />
            <p className="font-body text-[11px] tracking-[0.2em] uppercase text-[#7D927C] font-semibold">
              {lang === "en" ? "Departments Directory" : "精选品类目录"}
            </p>
          </div>
          <span className="font-body text-xs text-[#292D29]/60">
            {lang === "en" ? "Click to view curated essentials" : "点击查看对应精选商品"}
          </span>
        </div>

        {/* 6 Category Icon Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 md:gap-4">
          {departments.map((dept, i) => {
            const Icon = CATEGORY_ICONS[dept.slug];
            return (
              <motion.a
                key={dept.slug}
                href="#catalog"
                onClick={() => onSelectCategory(dept.slug)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 350, damping: 25, delay: i * 0.06 }}
                className="group flex flex-col items-center p-4 rounded-2xl bg-[#E8E5DA]/50 hover:bg-[#E8E5DA] border border-[#D8D4C7]/60 hover:border-[#34483B]/30 shadow-xs hover:shadow-md transition-all duration-300 text-center cursor-pointer"
              >
                {/* Icon Container */}
                <div className="w-13 h-13 rounded-2xl bg-[#F8F7F2] border border-[#D8D4C7]/60 flex items-center justify-center text-[#34483B] group-hover:bg-[#34483B] group-hover:text-[#F8F7F2] group-hover:scale-108 transition-all duration-300 mb-3 shadow-xs">
                  <Icon size={22} className="stroke-[2]" />
                </div>

                <h3 className="font-display font-semibold text-xs text-[#292D29] group-hover:text-[#34483B] tracking-tight mb-1 transition-colors">
                  {t(dept.nameKey)}
                </h3>

                <p className="font-body text-[11px] text-[#292D29]/65 font-medium">
                  <AnimatedNumber value={dept.count} /> {lang === "en" ? "items" : "件"}
                </p>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   4. KEY METRICS STATS BAR (Animation cho số)
   ════════════════════════════════════════════════════ */

function KeyMetricsBanner() {
  const { lang } = useLanguage();

  const stats = [
    { value: 1000, suffix: "+", labelEn: "Curated Originals", labelZh: "精选独家商品" },
    { value: 6, suffix: "", labelEn: "Dedicated Departments", labelZh: "专业生活品类" },
    { value: 40, suffix: "+", labelEn: "Express Delivery Regions", labelZh: "全球配送区域" },
    { value: 99.8, decimals: 1, suffix: "%", labelEn: "Quality Satisfaction", labelZh: "品质满意度" },
  ];

  return (
    <section className="bg-[#E8E5DA]/60 border-y border-[#D8D4C7]/60 py-10 md:py-12">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.labelEn}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <div className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-[#292D29] tracking-tight mb-1.5 flex items-baseline justify-center">
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                  duration={1.6}
                />
              </div>
              <p className="font-body text-xs font-semibold uppercase tracking-wider text-[#7D927C]">
                {lang === "en" ? stat.labelEn : stat.labelZh}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   5. CURATED DEPARTMENT BENTO GRID
   ════════════════════════════════════════════════════ */

function DepartmentGrid({ onSelectCategory }: { onSelectCategory: (slug: CategorySlug) => void }) {
  const { t, lang } = useLanguage();

  return (
    <section id="departments" className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28 bg-[#F8F7F2]">
      <SectionHeading eyebrow={t("curatedSub")} title={t("curatedTitle")} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((dept, i) => {
          const Icon = CATEGORY_ICONS[dept.slug];
          return (
            <motion.a
              key={dept.slug}
              href="#catalog"
              onClick={() => onSelectCategory(dept.slug)}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 350, damping: 25, delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl border border-[#D8D4C7]/50 shadow-xs hover:shadow-md cursor-pointer ${
                i === 0 ? "md:col-span-2 aspect-[2.4/1]" : "aspect-[1.6/1]"
              }`}
            >
              <Image
                src={dept.image}
                alt={t(dept.nameKey)}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                sizes={i === 0 ? "100vw" : "50vw"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent transition-opacity duration-300 group-hover:from-black/80" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform transition-transform duration-300 group-hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon size={14} className="text-[#7D927C]" />
                  <p className="font-body text-[11px] tracking-[0.15em] uppercase text-[#E8E5DA] font-medium">
                    <AnimatedNumber value={dept.count} /> {lang === "en" ? "items" : "件商品"}
                  </p>
                </div>
                <h3 className="font-display font-semibold text-[#F8F7F2] text-xl md:text-2xl tracking-[-0.02em]">
                  {t(dept.nameKey)}
                </h3>
              </div>
              <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#F8F7F2]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 translate-x-2 -translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300">
                <ArrowRight size={15} className="text-[#F8F7F2]" />
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   6. PRODUCT CATALOG ENGINE
   ════════════════════════════════════════════════════ */

type SortKey = "featured" | "price-low" | "newest";

function ProductCatalog({
  activeCategory,
  setActiveCategory,
  onQuickView,
  onAddToCart,
}: {
  activeCategory: CategorySlug | "all";
  setActiveCategory: (cat: CategorySlug | "all") => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}) {
  const { t, lang } = useLanguage();
  const [sortBy, setSortBy] = useState<SortKey>("featured");
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = useMemo(() => {
    let list = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);
    if (sortBy === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "newest") list = [...list].reverse();
    return list;
  }, [activeCategory, sortBy]);

  const visible = filtered.slice(0, visibleCount);

  const categories: { key: CategorySlug | "all"; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { key: "all", label: t("filterAll"), icon: Layers },
    ...departments.map((d) => ({ key: d.slug, label: t(d.nameKey), icon: CATEGORY_ICONS[d.slug] })),
  ];

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "featured", label: t("sortFeatured") },
    { key: "price-low", label: t("sortPriceLow") },
    { key: "newest", label: t("sortNewest") },
  ];

  return (
    <section id="catalog" className="bg-[#F8F7F2] border-t border-[#D8D4C7]/60">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2.5 mb-2"
            >
              <span className="w-5 h-[1.5px] bg-[#7D927C] rounded-full inline-block" />
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-[#7D927C] font-semibold">
                {lang === "en" ? "Curated Essentials" : "精选必需品"}
              </p>
            </motion.div>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%", opacity: 0 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-bold text-[#292D29] text-3xl md:text-[2.75rem] tracking-[-0.03em]"
              >
                {t("catalogTitle")}
              </motion.h2>
            </div>
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              aria-label={lang === "en" ? "Sort catalog by" : "商品排序"}
              className="appearance-none bg-[#E8E5DA] font-body text-xs font-semibold uppercase tracking-wider text-[#292D29] pr-8 pl-4 py-2.5 rounded-full border border-[#D8D4C7] cursor-pointer outline-none hover:border-[#34483B]/40 transition-colors shadow-xs"
            >
              {sortOptions.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#292D29] pointer-events-none" />
          </div>
        </div>

        {/* Category filter pills with matching icons */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.key;
            return (
              <motion.button
                key={cat.key}
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setVisibleCount(8);
                }}
                className={`flex-shrink-0 font-body text-xs font-semibold tracking-wider uppercase px-4 py-2.5 rounded-full border transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-[#34483B] text-[#F8F7F2] border-[#34483B] shadow-xs"
                    : "bg-[#E8E5DA] text-[#292D29] border-[#D8D4C7] hover:border-[#34483B]/50 hover:bg-[#E8E5DA]/80"
                }`}
              >
                <Icon size={13} className={isSelected ? "text-[#7D927C]" : "text-[#292D29]/70"} />
                <span>{cat.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Product grid using ProductCard component */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
          <AnimatePresence mode="popLayout">
            {visible.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickAdd={(p) => onAddToCart(p)}
                onQuickView={(p) => onQuickView(p)}
                lang={lang}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Load more button with hover spring */}
        {visibleCount < filtered.length && (
          <div className="text-center mt-14">
            <motion.button
              type="button"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => setVisibleCount((v) => v + 8)}
              className="font-body text-xs font-semibold tracking-wider uppercase text-[#292D29] bg-[#E8E5DA] border border-[#D8D4C7] px-8 py-3.5 rounded-full hover:bg-[#34483B] hover:text-[#F8F7F2] hover:border-[#34483B] transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <span>{t("loadMore")}</span>
              <ChevronDown size={14} />
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   7. BRAND TRUST PILLARS
   ════════════════════════════════════════════════════ */

const trustPillars = [
  { icon: Factory, titleKey: "trustDirect", subKey: "trustDirectSub" },
  { icon: Leaf, titleKey: "trustSustain", subKey: "trustSustainSub" },
  { icon: Truck, titleKey: "trustShip", subKey: "trustShipSub" },
  { icon: Headphones, titleKey: "trustSupport", subKey: "trustSupportSub" },
] as const;

function TrustSection() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-[#D8D4C7]/60 bg-[#F8F7F2]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28">
        <SectionHeading eyebrow="Haven Standards" title={t("trustTitle")} align="center" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {trustPillars.map(({ icon: Icon, titleKey, subKey }, i) => (
            <motion.div
              key={titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 350, damping: 25, delay: i * 0.1 }}
              className="group text-center p-6 rounded-2xl bg-[#E8E5DA]/40 border border-[#D8D4C7]/40 hover:bg-[#E8E5DA]/80 transition-colors duration-300"
            >
              <div className="w-13 h-13 rounded-2xl bg-[#E8E5DA] border border-[#D8D4C7]/60 flex items-center justify-center mx-auto mb-5 text-[#34483B] shadow-xs group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Icon size={22} className="stroke-[2]" />
              </div>
              <h3 className="font-display font-semibold text-[#292D29] text-base tracking-[-0.01em] mb-2">
                {t(titleKey)}
              </h3>
              <p className="font-body text-sm text-[#292D29]/70 leading-relaxed">
                {t(subKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   8. SITE FOOTER (With NeaGiSea - Studio Credit)
   ════════════════════════════════════════════════════ */

function SiteFooter() {
  const { lang } = useLanguage();

  return (
    <footer className="bg-[#292D29] text-[#E8E5DA] border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
          <div>
            <div className="mb-3">
              <AnimatedLogo />
            </div>
            <p className="font-body text-sm text-[#E8E5DA]/70 max-w-xs leading-relaxed">
              {lang === "en"
                ? "Essentials, considered. A single-vendor concept store for everyday life."
                : "精心甄选。为日常生活打造的一站式概念店。"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:text-right">
            <div className="font-body text-xs text-[#E8E5DA]/60">
              <p>{lang === "en" ? "Modern Lifestyle Concept Store" : "现代生活方式概念店"}</p>
              <p className="mt-1 text-[#E8E5DA]/40">
                {lang === "en" ? "Visual prototype — Awwwards standard." : "视觉原型 — Awwwards设计标准。"}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar with NeaGiSea - Studio Credit Link */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* NeaGiSea - Studio Instagram badge link */}
          <motion.a
            href="https://www.instagram.com/neagisea_studio/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#7D927C] transition-all duration-300 shadow-xs cursor-pointer"
          >
            <InstagramIcon size={16} className="text-[#7D927C] group-hover:scale-110 transition-transform duration-200" />
            <span className="font-body text-xs text-[#E8E5DA] group-hover:text-white transition-colors">
              Design & Powered by{" "}
              <strong className="font-semibold text-white underline underline-offset-4 decoration-[#7D927C] decoration-2">
                NeaGiSea - Studio
              </strong>
            </span>
            <ExternalLink size={12} className="text-[#E8E5DA]/50 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </motion.a>

          {/* Copyright notice */}
          <p className="font-body text-xs text-[#E8E5DA]/50">
            © 2026 Haven Concept Store. {lang === "en" ? "All rights reserved." : "版权所有。"}
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════
   PAGE EXPORT
   ════════════════════════════════════════════════════ */

export default function HomePage() {
  const { lang } = useLanguage();
  const { addItem, openCart } = useCart();
  const [activeCategory, setActiveCategory] = useState<CategorySlug | "all">("all");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastItem, setToastItem] = useState<Omit<CartItem, "qty"> | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Auto dismiss toast after 3.5s
  useEffect(() => {
    if (!toastItem) return;
    const timer = setTimeout(() => setToastItem(null), 3500);
    return () => clearTimeout(timer);
  }, [toastItem]);

  const handleAddToCart = (product: Product, qty: number = 1) => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        nameZh: product.nameZh,
        price: product.price,
        image: product.image,
      });
    }
    setToastItem({
      id: product.id,
      name: product.name,
      nameZh: product.nameZh,
      price: product.price,
      image: product.image,
    });
  };

  const handleSelectCategory = (slug: CategorySlug) => {
    setActiveCategory(slug);
  };

  return (
    <>
      <SiteHeader
        onQuickView={(p) => setQuickViewProduct(p)}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />
      <main>
        <HeroSection onAddToCart={(p) => handleAddToCart(p, 1)} />
        <CategoryIconRail onSelectCategory={handleSelectCategory} />
        <KeyMetricsBanner />
        <DepartmentGrid onSelectCategory={handleSelectCategory} />
        <ProductCatalog
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onQuickView={(p) => setQuickViewProduct(p)}
          onAddToCart={(p) => handleAddToCart(p, 1)}
        />
        <HavenJournal lang={lang} />
        <TrustSection />
      </main>
      <SiteFooter />
      <CartDrawer />
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        lang={lang}
      />

      {/* Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, qty) => handleAddToCart(p, qty)}
        lang={lang}
      />

      {/* Floating Toast Notification */}
      <ToastNotification
        item={toastItem}
        onClose={() => setToastItem(null)}
        onOpenCart={openCart}
        lang={lang}
      />
    </>
  );
}
