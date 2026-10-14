"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import {
  Search, ShoppingBag, ChevronDown, ChevronRight, Plus,
  Star, X, SlidersHorizontal, Grid3X3, LayoutGrid,
  Monitor, Sofa, Shirt, Cpu, CookingPot, Droplets,
  ArrowRight, ArrowDown, Sparkles, User,
} from "lucide-react";
import { useLanguage } from "@/app/lib/i18n";
import { useCart, type CartItem } from "@/app/lib/cart";
import { categoryTree, products, allMaterials, type CategorySlug, type FilterState, type Product } from "@/app/lib/data";
import { CartDrawer } from "@/app/components/CartDrawer";
import { ToastNotification } from "@/app/components/ToastNotification";
import { AnimatedNumber } from "@/app/components/AnimatedNumber";

/* ─── Motion & Transition Constants ─── */

const luxuryEase = [0.16, 1, 0.3, 1] as const;
const luxuryTransition: Transition = { ease: [0.16, 1, 0.3, 1], duration: 0.3 };
const luxurySpring = { type: "spring" as const, stiffness: 240, damping: 25, mass: 0.8 };
const snappySpring = { type: "spring" as const, stiffness: 300, damping: 28, mass: 0.6 };
const ITEMS_PER_PAGE = 24;

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Monitor, Sofa, Shirt, Cpu, CookingPot, Droplets,
};

/* ─── Main Page ─── */

export default function CatalogPage() {
  const { t, lang, toggle } = useLanguage();
  const cart = useCart();

  /* ── Filter State ── */
  const [filter, setFilter] = useState<FilterState>({
    category: "all",
    sub: null,
    priceRange: [0, 500],
    inStockOnly: false,
    materials: [],
    sort: "featured",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [gridCols, setGridCols] = useState<5 | 6>(5);
  const [expandedDepts, setExpandedDepts] = useState<Set<CategorySlug>>(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchDropdownDept, setSearchDropdownDept] = useState<CategorySlug | "all">("all");
  const [toast, setToast] = useState<Omit<CartItem, "qty"> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* ── Keyboard shortcut ⌘K ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  /* ── Filtered Products ── */
  const filtered = useMemo(() => {
    let list = [...products];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameZh.includes(q) ||
          p.id.toLowerCase().includes(q) ||
          (p.material && p.material.toLowerCase().includes(q))
      );
    }

    // Search dropdown dept filter
    if (searchDropdownDept !== "all" && searchQuery.trim()) {
      list = list.filter((p) => p.category === searchDropdownDept);
    }

    // Category
    if (filter.category !== "all") {
      list = list.filter((p) => p.category === filter.category);
    }
    if (filter.sub) {
      list = list.filter((p) => p.sub === filter.sub);
    }

    // Price
    list = list.filter((p) => p.price >= filter.priceRange[0] && p.price <= filter.priceRange[1]);

    // Stock
    if (filter.inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    // Material
    if (filter.materials.length > 0) {
      list = list.filter((p) => p.material && filter.materials.includes(p.material));
    }

    // Sort
    switch (filter.sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "best-selling":
        list.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
        break;
    }

    return list;
  }, [filter, searchQuery, searchDropdownDept]);

  const visible = filtered.slice(0, visibleCount);
  const totalProducts = categoryTree.reduce((s, c) => s + c.count, 0);

  /* ── Handlers ── */
  const toggleDept = useCallback((slug: CategorySlug) => {
    setExpandedDepts((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const selectCategory = useCallback((slug: CategorySlug | "all", sub?: string) => {
    setFilter((f) => ({ ...f, category: slug, sub: sub ?? null }));
    setVisibleCount(ITEMS_PER_PAGE);
    setMobileFiltersOpen(false);
  }, []);

  const toggleMaterial = useCallback((mat: string) => {
    setFilter((f) => ({
      ...f,
      materials: f.materials.includes(mat)
        ? f.materials.filter((m) => m !== mat)
        : [...f.materials, mat],
    }));
  }, []);

  const handleQuickAdd = useCallback(
    (p: Product) => {
      const item = { id: p.id, name: p.name, nameZh: p.nameZh, price: p.price, image: p.image };
      cart.addItem(item);
      setToast(item);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2500);
    },
    [cart]
  );

  /* ── Breadcrumb ── */
  const breadcrumb = useMemo(() => {
    const parts: string[] = [t("allDepts")];
    if (filter.category !== "all") {
      const dept = categoryTree.find((c) => c.slug === filter.category);
      if (dept) parts.push(t(dept.nameKey));
      if (filter.sub) {
        const sub = dept?.subs.find((s) => s.slug === filter.sub);
        if (sub) parts.push(t(sub.nameKey));
      }
    }
    return parts;
  }, [filter.category, filter.sub, t]);

  /* ── Search suggestions ── */
  const trendingTags = ["trendingBrassLamp", "trendingMerinoTee", "trendingCeramic", "trendingWalnut"];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return products
      .filter((p) => p.name.toLowerCase().includes(q) || p.nameZh.includes(q))
      .slice(0, 5);
  }, [searchQuery]);

  /* ── Sidebar content (shared between desktop & mobile drawer) ── */
  const SidebarContent = (
    <>
      {/* Category Tree */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => selectCategory("all")}
          className={`w-full text-left px-3.5 py-2.5 rounded-xl font-body text-xs font-bold tracking-tight transition-all cursor-pointer ${
            filter.category === "all"
              ? "bg-[#8F3040] text-white shadow-xs"
              : "text-[#262321] hover:bg-[#EBD9DC]/40"
          }`}
        >
          {t("allDepts")} ({totalProducts.toLocaleString("en-US")})
        </button>

        <div className="mt-1.5 space-y-0.5">
          {categoryTree.map((dept) => {
            const Icon = iconMap[dept.icon];
            const isExpanded = expandedDepts.has(dept.slug);
            const isActive = filter.category === dept.slug;

            return (
              <div key={dept.slug}>
                <button
                  type="button"
                  onClick={() => {
                    toggleDept(dept.slug);
                    selectCategory(dept.slug);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#F7EFF1] text-[#8F3040] font-bold border border-[#8F3040]/30"
                      : "text-[#262321] hover:bg-[#EBD9DC]/30"
                  }`}
                >
                  {Icon && <Icon size={15} className={isActive ? "text-[#8F3040]" : "text-[#736B66]"} />}
                  <span className="flex-1 text-left font-body">{t(dept.nameKey)}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isActive ? "bg-[#8F3040] text-white" : "text-[#736B66] bg-[#EBD9DC]/60"}`}>
                    {dept.count}
                  </span>
                  <motion.span
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={snappySpring}
                  >
                    <ChevronRight size={13} className={isActive ? "text-[#8F3040]" : "text-[#736B66]"} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={snappySpring}
                      className="overflow-hidden"
                    >
                      <div className="ml-3 pl-3 border-l-2 border-[#E7E1DC] space-y-0.5 py-1">
                        {dept.subs.map((sub) => (
                          <button
                            key={sub.slug}
                            type="button"
                            onClick={() => selectCategory(dept.slug, sub.slug)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                              filter.sub === sub.slug
                                ? "bg-[#8F3040] text-white font-bold shadow-2xs"
                                : "text-[#736B66] hover:bg-[#EBD9DC]/40 hover:text-[#262321]"
                            }`}
                          >
                            <span className="font-body">{t(sub.nameKey)}</span>
                            <span className="text-[10px] opacity-70">{sub.count}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#E7E1DC] my-4" />

      {/* Quick Filters */}
      <div className="space-y-5">
        {/* Price Range */}
        <div>
          <h4 className="font-body text-[11px] font-bold text-[#736B66] uppercase tracking-wider mb-2.5">
            {t("priceRange")}
          </h4>
          <div className="flex items-center gap-2">
            <span className="font-body text-xs font-semibold text-[#262321]">${filter.priceRange[0]}</span>
            <input
              type="range"
              min={0}
              max={500}
              value={filter.priceRange[1]}
              onChange={(e) =>
                setFilter((f) => ({ ...f, priceRange: [f.priceRange[0], parseInt(e.target.value)] }))
              }
              className="flex-1 accent-[#8F3040] h-1.5 cursor-pointer bg-[#E7E1DC] rounded-lg"
            />
            <span className="font-body text-xs font-bold text-[#8F3040]">${filter.priceRange[1]}</span>
          </div>
        </div>

        {/* In Stock */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filter.inStockOnly}
            onChange={(e) => setFilter((f) => ({ ...f, inStockOnly: e.target.checked }))}
            className="w-4 h-4 rounded border-[#E7E1DC] accent-[#8F3040] cursor-pointer"
          />
          <span className="font-body text-xs font-semibold text-[#262321]">{t("inStockOnly")}</span>
        </label>

        {/* Materials */}
        <div>
          <h4 className="font-body text-[11px] font-bold text-[#736B66] uppercase tracking-wider mb-2.5">
            {t("material")}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {allMaterials.map((mat) => (
              <button
                key={mat}
                type="button"
                onClick={() => toggleMaterial(mat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-body ${
                  filter.materials.includes(mat)
                    ? "bg-[#8F3040] text-white shadow-2xs"
                    : "bg-white text-[#262321] hover:bg-[#EBD9DC]/40 border border-[#E7E1DC]"
                }`}
              >
                {mat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#262321]">
      {/* ═══════════════ TOP ANNOUNCEMENT BAR ═══════════════ */}
      <div className="bg-[#262321] text-[#E7E1DC] text-[11px] py-2 px-4 border-b border-[#262321]">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium tracking-wide">
              {lang === "en"
                ? "Worldwide Free Shipping on Orders Over $150 · Direct from Verified Makers"
                : "全场订单满 $150 尊享全球免运 · 原厂直发 品质保障"}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[#E7E1DC]/70 text-[10px] tracking-wider uppercase">
            <span>HAVEN FACTORY-DIRECT 2026</span>
            <span>·</span>
            <span>NO MIDDLEMEN MARKUP</span>
          </div>
        </div>
      </div>

      {/* ═══════════════ STICKY HEADER ═══════════════ */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7E1DC] shadow-2xs">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 h-16 flex items-center gap-4">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="flex items-center group">
              <span className="font-display text-xl font-extrabold text-[#262321] tracking-[-0.03em]">HAVEN</span>
            </a>
          </div>

          {/* Center: Smart Mega-Catalog Search Bar */}
          <div className="flex-1 max-w-2xl mx-auto relative">
            <div
              className={`flex items-center h-11 w-full rounded-xl bg-white border transition-all ${
                searchFocused
                  ? "border-[#8F3040] ring-3 ring-[#8F3040]/15 shadow-sm"
                  : "border-[#E7E1DC] hover:border-[#8F3040]/40"
              }`}
            >
              {/* Department Dropdown */}
              <div className="relative hidden sm:block">
                <select
                  value={searchDropdownDept}
                  onChange={(e) => setSearchDropdownDept(e.target.value as CategorySlug | "all")}
                  className="appearance-none bg-transparent pl-3.5 pr-6 h-full text-xs font-semibold text-[#262321] font-body cursor-pointer focus:outline-none"
                >
                  <option value="all">{t("allDepartments")}</option>
                  {categoryTree.map((d) => (
                    <option key={d.slug} value={d.slug}>{t(d.nameKey)}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#736B66]" />
              </div>

              <div className="hidden sm:block w-px h-5 bg-[#E7E1DC]" />

              {/* Search Input */}
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder={t("searchPlaceholder")}
                className="flex-1 bg-transparent px-3.5 h-full text-xs text-[#262321] placeholder:text-[#736B66]/60 font-body focus:outline-none"
              />

              {/* ⌘K Badge */}
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 mr-2 rounded bg-[#F8F5F0] border border-[#E7E1DC] text-[10px] text-[#736B66] font-body font-semibold shadow-2xs">
                ⌘K
              </kbd>

              {/* Search Button in Burgundy */}
              <button
                type="button"
                className="h-8 w-8 mr-1.5 rounded-lg bg-[#8F3040] hover:bg-[#792534] text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
                aria-label="Search"
              >
                <Search size={14} />
              </button>
            </div>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {searchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={luxurySpring}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E7E1DC] rounded-xl shadow-xl overflow-hidden z-50"
                >
                  {searchResults.length > 0 ? (
                    <div className="py-2 divide-y divide-[#E7E1DC]/60">
                      {searchResults.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onMouseDown={() => {
                            setSearchQuery(p.name);
                            setSearchFocused(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F8F5F0] transition-colors cursor-pointer text-left"
                        >
                          <div className="w-9 h-9 rounded-lg bg-[#F8F5F0] overflow-hidden relative shrink-0 border border-[#E7E1DC]">
                            <Image src={p.image} alt={p.name} fill className="object-cover" sizes="36px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-xs font-bold text-[#262321] truncate">{lang === "en" ? p.name : p.nameZh}</p>
                            <p className="font-body text-[11px] font-extrabold text-[#8F3040]">${p.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4">
                      <p className="font-body text-[10px] font-bold text-[#736B66] uppercase tracking-wider mb-2.5">
                        Trending Searches
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {trendingTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onMouseDown={() => {
                              setSearchQuery(t(tag));
                              setSearchFocused(false);
                            }}
                            className="px-2.5 py-1 rounded-full bg-[#EBD9DC] hover:bg-[#EBD9DC]/80 text-[11px] font-semibold text-[#8F3040] transition-colors cursor-pointer font-body border border-[#8F3040]/15"
                          >
                            {t(tag)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Actions: Lang Switcher + Profile + Bag */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={toggle}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#262321] hover:bg-[#EBD9DC]/40 transition-colors cursor-pointer font-body border border-[#E7E1DC]"
            >
              <span className={lang === "en" ? "text-[#8F3040]" : "text-[#736B66]"}>EN</span>
              <span className="text-[#E7E1DC]">/</span>
              <span className={lang === "zh" ? "text-[#8F3040]" : "text-[#736B66]"}>中文</span>
            </motion.button>

            {/* Profile Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-lg hover:bg-[#EBD9DC]/30 text-[#262321] hover:text-[#8F3040] transition-colors cursor-pointer border border-[#E7E1DC]"
              aria-label={lang === "en" ? "Profile" : "个人账户"}
            >
              <User size={18} />
            </motion.button>

            {/* Shopping Bag Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={cart.openCart}
              className="relative p-2.5 rounded-lg hover:bg-[#EBD9DC]/30 text-[#262321] hover:text-[#8F3040] transition-colors cursor-pointer border border-[#E7E1DC]"
              aria-label={t("bag")}
            >
              <ShoppingBag size={18} />
              {cart.totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={snappySpring}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[#8F3040] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center font-body shadow-xs"
                >
                  {cart.totalItems}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* ═══════════════ TYPOGRAPHIC EDITORIAL HERO SECTION (NO IMAGES) ═══════════════ */}
      <section className="border-b border-[#E7E1DC] bg-[#F8F5F0] pt-12 pb-14 lg:pt-20 lg:pb-20">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <div className="max-w-4xl space-y-6">
            {/* Edition Pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: luxuryEase }}
              className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#EBD9DC] border border-[#8F3040]/20 text-[11px] font-semibold text-[#8F3040] uppercase tracking-[0.16em]"
            >
              <span>{t("heroBadge")}</span>
            </motion.div>

            {/* Editorial Hero Headline with staggered text animation */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: luxuryEase }}
              className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-[#262321] tracking-[-0.02em] leading-[1.08]"
            >
              {lang === "en" ? (
                <>
                  <motion.span
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: luxuryEase }}
                    className="inline-block"
                  >
                    A More
                  </motion.span>{" "}
                  <motion.span
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.28, ease: luxuryEase }}
                    className="italic font-light text-[#8F3040] inline-block"
                  >
                    Considered
                  </motion.span>{" "}
                  <motion.span
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.38, ease: luxuryEase }}
                    className="inline-block"
                  >
                    Way to Live.
                  </motion.span>
                </>
              ) : (
                <>
                  <motion.span
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: luxuryEase }}
                    className="inline-block"
                  >
                    更加考究的
                  </motion.span>{" "}
                  <motion.span
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3, ease: luxuryEase }}
                    className="text-[#8F3040] inline-block"
                  >
                    日常生活方式。
                  </motion.span>
                </>
              )}
            </motion.h2>

            {/* Manifesto description */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: luxuryEase }}
              className="font-body text-base sm:text-lg text-[#736B66] max-w-2xl leading-relaxed"
            >
              {t("heroSubtitle")}
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: luxuryEase }}
              className="flex flex-wrap items-center gap-3.5 pt-2"
            >
              <motion.a
                href="#catalog"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#8F3040] hover:bg-[#792534] text-white font-body text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                <span>{t("exploreCatalog")}</span>
                <ArrowDown size={14} />
              </motion.a>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => selectCategory("all")}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-[#EBD9DC]/40 text-[#262321] font-body text-xs font-bold uppercase tracking-wider border border-[#E7E1DC] transition-all shadow-2xs cursor-pointer"
              >
                <span>{t("viewNewIn")}</span>
                <ArrowRight size={14} className="text-[#8F3040]" />
              </motion.button>
            </motion.div>
          </div>

          {/* Architectural Value Metrics Cards with individual item hover animations */}
          <div className="mt-12 pt-8 border-t border-[#E7E1DC] grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: luxuryEase }}
              whileHover={{ y: -4, transition: { duration: 0.18 } }}
              className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E7E1DC] shadow-2xs space-y-1 hover:border-[#8F3040]/30 hover:shadow-md transition-all cursor-default"
            >
              <AnimatedNumber
                value={1000}
                suffix="+"
                className="font-editorial text-3xl sm:text-4xl font-bold text-[#8F3040]"
              />
              <p className="font-body text-xs font-bold text-[#262321]">{t("curatedItems")}</p>
              <p className="font-body text-[11px] text-[#736B66]">Single-Vendor Archive</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: luxuryEase }}
              whileHover={{ y: -4, transition: { duration: 0.18 } }}
              className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E7E1DC] shadow-2xs space-y-1 hover:border-[#8F3040]/30 hover:shadow-md transition-all cursor-default"
            >
              <AnimatedNumber
                value={6}
                className="font-editorial text-3xl sm:text-4xl font-bold text-[#8F3040]"
              />
              <p className="font-body text-xs font-bold text-[#262321]">{t("coreDepartments")}</p>
              <p className="font-body text-[11px] text-[#736B66]">Workspace to Care</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3, ease: luxuryEase }}
              whileHover={{ y: -4, transition: { duration: 0.18 } }}
              className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E7E1DC] shadow-2xs space-y-1 hover:border-[#8F3040]/30 hover:shadow-md transition-all cursor-default"
            >
              <AnimatedNumber
                value={100}
                suffix="%"
                className="font-editorial text-3xl sm:text-4xl font-bold text-[#8F3040]"
              />
              <p className="font-body text-xs font-bold text-[#262321]">{t("verifiedCraft")}</p>
              <p className="font-body text-[11px] text-[#736B66]">Direct From Maker</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4, ease: luxuryEase }}
              whileHover={{ y: -4, transition: { duration: 0.18 } }}
              className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E7E1DC] shadow-2xs space-y-1 hover:border-[#8F3040]/30 hover:shadow-md transition-all cursor-default"
            >
              <AnimatedNumber
                value={150}
                prefix="$"
                className="font-editorial text-3xl sm:text-4xl font-bold text-[#8F3040]"
              />
              <p className="font-body text-xs font-bold text-[#262321]">{t("freeWorldwide")}</p>
              <p className="font-body text-[11px] text-[#736B66]">Worldwide Delivery</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED CATEGORIES SECTION ═══════════════ */}
      <section className="border-b border-[#E7E1DC] bg-[#FFFFFF] py-10 lg:py-12">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
            <div>
              <motion.h3
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: luxuryEase }}
                className="font-editorial text-2xl sm:text-3xl font-bold text-[#262321] tracking-tight mb-1"
              >
                {t("featuredDepartments")}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: luxuryEase }}
                className="font-body text-xs text-[#736B66]"
              >
                {t("departmentSub")}
              </motion.p>
            </div>
            <motion.button
              type="button"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.15 }}
              onClick={() => selectCategory("all")}
              className="font-body text-xs font-bold text-[#8F3040] hover:text-[#722633] flex items-center gap-1 self-start sm:self-auto cursor-pointer transition-colors"
            >
              <span>{t("allDepartments")} ({totalProducts})</span>
              <ArrowRight size={13} />
            </motion.button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {categoryTree.map((dept, index) => {
              const Icon = iconMap[dept.icon];
              const isSelected = filter.category === dept.slug;

              return (
                <motion.button
                  key={dept.slug}
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.06, ease: luxuryEase }}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectCategory(dept.slug)}
                  className={`group relative p-4 rounded-2xl border text-left cursor-pointer flex flex-col justify-between transition-colors duration-150 ${
                    isSelected
                      ? "bg-[#EBD9DC]/50 border-[#8F3040] shadow-sm"
                      : "bg-[#FFFFFF] hover:bg-[#F8F5F0] border-[#E7E1DC] hover:border-[#8F3040]/30 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 ${
                        isSelected
                          ? "bg-[#8F3040] text-white shadow-xs"
                          : "bg-[#FFFFFF] text-[#262321] group-hover:bg-[#EBD9DC] group-hover:text-[#8F3040] border border-[#E7E1DC]"
                      }`}
                    >
                      {Icon && <Icon size={20} />}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors duration-200 ${
                        isSelected
                          ? "bg-[#8F3040] text-white"
                          : "bg-[#EBD9DC]/70 text-[#262321] group-hover:bg-[#8F3040] group-hover:text-white"
                      }`}
                    >
                      {dept.count}
                    </span>
                  </div>

                  <div>
                    <h4
                      className={`font-display text-sm font-bold tracking-tight transition-colors duration-200 ${
                        isSelected ? "text-[#8F3040]" : "text-[#262321] group-hover:text-[#8F3040]"
                      }`}
                    >
                      {t(dept.nameKey)}
                    </h4>
                    <p className="font-body text-[11px] text-[#736B66] mt-0.5 line-clamp-1">
                      {dept.subs.map((s) => t(s.nameKey)).slice(0, 2).join(" · ")}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ MOBILE FILTER BUTTON ═══════════════ */}
      <div className="lg:hidden px-4 py-3 border-b border-[#E7E1DC] bg-[#F8F5F0]">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E7E1DC] text-[#262321] text-xs font-bold font-body cursor-pointer w-full justify-center shadow-2xs hover:border-[#8F3040]/40 transition-colors"
        >
          <SlidersHorizontal size={15} className="text-[#8F3040]" />
          {t("categoriesFilters")}
        </button>
      </div>

      {/* ═══════════════ MOBILE FILTER DRAWER ═══════════════ */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-[#262321]/45 backdrop-blur-xs lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={luxurySpring}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] bg-[#FFFFFF] border-r border-[#E7E1DC] shadow-2xl overflow-y-auto p-6 lg:hidden"
            >
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E7E1DC]">
                <h2 className="font-editorial text-xl font-bold text-[#262321]">{t("categoriesFilters")}</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[#F8F5F0] text-[#736B66] hover:text-[#262321] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════ MAIN WORKSPACE ═══════════════ */}
      <div id="catalog" className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8 flex gap-8">
        {/* ─── LEFT: Sticky Category Tree ─── */}
        <aside className="w-64 shrink-0 hidden lg:block sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 scrollbar-thin">
          <div className="p-4 bg-[#FFFFFF] border border-[#E7E1DC] rounded-2xl shadow-2xs">
            {SidebarContent}
          </div>
        </aside>

        {/* ─── RIGHT: Product Grid ─── */}
        <main className="flex-1 min-w-0">
          {/* Utility Bar */}
          <div className="mb-6 space-y-3.5">
            {/* Breadcrumb + Count */}
            <div className="flex items-center justify-between">
              <nav className="font-body text-xs text-[#736B66]">
                {breadcrumb.map((part, i) => (
                  <span key={i}>
                    {i > 0 && <span className="mx-1.5 text-[#E7E1DC]">/</span>}
                    <span className={i === breadcrumb.length - 1 ? "text-[#262321] font-bold" : ""}>{part}</span>
                  </span>
                ))}
              </nav>
              <span className="font-body text-xs font-semibold text-[#736B66]">
                <span className="text-[#8F3040] font-bold">{filtered.length}</span> {t("products")}
              </span>
            </div>

            {/* Quick Filter Pills + Sort + Grid Toggle */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Quick filter pills for departments */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15 }}
                onClick={() => selectCategory("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors duration-150 cursor-pointer font-body ${
                  filter.category === "all"
                    ? "bg-[#8F3040] text-white shadow-xs"
                    : "bg-[#FFFFFF] text-[#262321] hover:bg-[#EBD9DC]/50 hover:text-[#8F3040] border border-[#E7E1DC]"
                }`}
              >
                All
              </motion.button>
              {categoryTree.map((dept) => (
                <motion.button
                  key={dept.slug}
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => selectCategory(dept.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors duration-150 cursor-pointer font-body ${
                    filter.category === dept.slug
                      ? "bg-[#8F3040] text-white shadow-xs"
                      : "bg-[#FFFFFF] text-[#262321] hover:bg-[#EBD9DC]/50 hover:text-[#8F3040] border border-[#E7E1DC]"
                  }`}
                >
                  {t(dept.nameKey)}
                </motion.button>
              ))}

              <div className="flex-1" />

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={filter.sort}
                  onChange={(e) => setFilter((f) => ({ ...f, sort: e.target.value as FilterState["sort"] }))}
                  className="appearance-none bg-[#FFFFFF] border border-[#E7E1DC] rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-[#262321] font-body cursor-pointer focus:outline-none focus:border-[#8F3040] shadow-2xs transition-colors"
                >
                  <option value="featured">{t("sortFeatured")}</option>
                  <option value="price-asc">{t("sortPriceLow")}</option>
                  <option value="price-desc">{t("sortPriceHigh")}</option>
                  <option value="best-selling">{t("sortBestSelling")}</option>
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#736B66]" />
              </div>

              {/* Grid toggle */}
              <div className="hidden xl:flex items-center border border-[#E7E1DC] rounded-xl overflow-hidden bg-[#FFFFFF] shadow-2xs">
                <button
                  type="button"
                  onClick={() => setGridCols(5)}
                  className={`p-1.5 transition-colors cursor-pointer ${gridCols === 5 ? "bg-[#8F3040] text-white" : "text-[#736B66] hover:text-[#262321]"}`}
                  aria-label="5 columns"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setGridCols(6)}
                  className={`p-1.5 transition-colors cursor-pointer ${gridCols === 6 ? "bg-[#8F3040] text-white" : "text-[#736B66] hover:text-[#262321]"}`}
                  aria-label="6 columns"
                >
                  <Grid3X3 size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* ─── Product Grid ─── */}
          <motion.div
            key={`${filter.category}-${filter.sub ?? "all"}-${filter.sort}`}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`grid gap-3.5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${
              gridCols === 6 ? "xl:grid-cols-5 2xl:grid-cols-6" : "xl:grid-cols-5"
            }`}
          >
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} onQuickAdd={handleQuickAdd} lang={lang} t={t} />
            ))}
          </motion.div>

          {/* ─── Empty State ─── */}
          {filtered.length === 0 && (
            <div className="py-20 text-center bg-[#FFFFFF] rounded-2xl border border-[#E7E1DC] shadow-2xs">
              <p className="font-body text-sm font-semibold text-[#736B66]">
                {lang === "en" ? "No products match your criteria." : "没有匹配的商品。"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilter({
                    category: "all",
                    sub: null,
                    priceRange: [0, 500],
                    inStockOnly: false,
                    materials: [],
                    sort: "featured",
                  });
                  setSearchQuery("");
                }}
                className="mt-3 text-xs font-bold text-[#8F3040] hover:text-[#722633] underline cursor-pointer transition-colors"
              >
                {lang === "en" ? "Reset all filters" : "重置所有筛选"}
              </button>
            </div>
          )}

          {/* ─── Pagination / Load More ─── */}
          {visibleCount < filtered.length && (
            <div className="mt-8 space-y-3">
              {/* Progress */}
              <div className="flex items-center justify-between">
                <p className="font-body text-xs font-semibold text-[#736B66]">
                  {t("showing")} <span className="text-[#262321] font-bold">{visible.length}</span> {t("of")} <span className="text-[#262321] font-bold">{filtered.length}</span> {t("products")}
                </p>
              </div>
              <div className="h-1.5 bg-[#EBD9DC]/40 rounded-full overflow-hidden border border-[#E7E1DC]">
                <div
                  className="h-full bg-[#8F3040] rounded-full transition-all duration-500"
                  style={{ width: `${(visible.length / filtered.length) * 100}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => setVisibleCount((v) => v + ITEMS_PER_PAGE)}
                className="w-full py-3.5 bg-[#FFFFFF] border-2 border-[#8F3040] rounded-xl font-body text-xs font-bold text-[#8F3040] hover:bg-[#8F3040] hover:text-white transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              >
                {t("loadMore")}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ═══════════════ FOOTER (Soft Black #262321) ═══════════════ */}
      <footer className="mt-16 bg-[#262321] text-[#F8F5F0] border-t border-[#E7E1DC]/20 pt-16 pb-12">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E7E1DC]/15">
            {/* Col 1: Brand & Philosophy */}
            <div className="space-y-4 md:col-span-1">
              <span className="font-editorial text-2xl font-bold tracking-tight text-[#FFFFFF]">HAVEN</span>
              <p className="font-body text-xs text-[#E7E1DC]/70 leading-relaxed">
                {lang === "en"
                  ? "Single-vendor smart mega-catalog engineered for elevated living, functional minimalism, and enduring design."
                  : "专为高品质生活打造的单品牌智能大型商品目录，崇尚实用极简与历久弥新的设计。"}
              </p>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 rounded-md bg-[#8F3040]/30 text-[#EBD9DC] border border-[#8F3040]/40 text-[10px] font-bold font-mono uppercase tracking-wider">
                  Tokyo · Stockholm · New York
                </span>
              </div>
            </div>

            {/* Col 2: Departments */}
            <div className="space-y-3">
              <h4 className="font-editorial text-sm font-bold text-[#FFFFFF] tracking-wider uppercase">{t("featuredDepartments")}</h4>
              <ul className="space-y-2 font-body text-xs text-[#E7E1DC]/75">
                {categoryTree.map((dept) => (
                  <li key={dept.slug}>
                    <button
                      type="button"
                      onClick={() => {
                        selectCategory(dept.slug);
                        const el = document.getElementById("catalog");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="hover:text-[#EBD9DC] transition-colors cursor-pointer"
                    >
                      {t(dept.nameKey)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Standards */}
            <div className="space-y-3">
              <h4 className="font-editorial text-sm font-bold text-[#FFFFFF] tracking-wider uppercase">
                {lang === "en" ? "House Standards" : "品质标准"}
              </h4>
              <ul className="space-y-2 font-body text-xs text-[#E7E1DC]/75">
                <li>
                  <span>{lang === "en" ? "Complimentary White Glove Delivery" : "尊享免费入户安装配送"}</span>
                </li>
                <li>
                  <span>{lang === "en" ? "Architectural Material Curation" : "严选建筑级环保天然材料"}</span>
                </li>
                <li>
                  <span>{lang === "en" ? "10-Year Lifetime Craft Guarantee" : "十年经典匠心品质质保"}</span>
                </li>
                <li>
                  <span>{lang === "en" ? "Zero Single-Use Plastic Packaging" : "全面采用零塑料可降解包装"}</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Dispatch */}
            <div className="space-y-3">
              <h4 className="font-editorial text-sm font-bold text-[#FFFFFF] tracking-wider uppercase">
                {lang === "en" ? "The Haven Dispatch" : "订阅品牌专刊"}
              </h4>
              <p className="font-body text-xs text-[#E7E1DC]/70">
                {lang === "en"
                  ? "Receive quiet announcements on seasonal releases and rare archive restorations."
                  : "抢先获取季节新品发布与典藏复刻系列的私密发售资讯。"}
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={lang === "en" ? "Enter your email..." : "输入您的邮箱..."}
                  className="bg-white/10 border border-[#E7E1DC]/30 rounded-xl px-3 py-2 text-xs text-[#FFFFFF] placeholder:text-[#E7E1DC]/40 focus:outline-none focus:border-[#8F3040] flex-1"
                />
                <button
                  type="button"
                  className="px-3.5 py-2 rounded-xl bg-[#8F3040] text-white text-xs font-bold hover:bg-[#722633] transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  {lang === "en" ? "Join" : "订阅"}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-body text-[#E7E1DC]/50">
            <p>© 2026 HAVEN Department Store. High-Density Functional Minimalism.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-[#EBD9DC] transition-colors cursor-pointer">{lang === "en" ? "Privacy Policy" : "隐私政策"}</span>
              <span className="hover:text-[#EBD9DC] transition-colors cursor-pointer">{lang === "en" ? "Terms of Service" : "服务条款"}</span>
              <span className="hover:text-[#EBD9DC] transition-colors cursor-pointer">{lang === "en" ? "Accessibility" : "无障碍访问"}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════ CART DRAWER ═══════════════ */}
      <CartDrawer />

      {/* ═══════════════ TOAST ═══════════════ */}
      <ToastNotification
        item={toast}
        onClose={() => setToast(null)}
        onOpenCart={cart.openCart}
        lang={lang}
      />
    </div>
  );
}

/* ─── Product Card Component ─── */

interface ProductCardProps {
  product: Product;
  onQuickAdd: (p: Product) => void;
  lang: Language;
  t: (key: string) => string;
}

type Language = "en" | "zh";

function ProductCard({ product, onQuickAdd, lang, t }: ProductCardProps) {
  const getBadgeStyle = (badge?: string) => {
    if (badge === "Staff Pick") return "bg-[#8F3040] text-white";
    if (badge === "Best Seller") return "bg-[#EBD9DC] text-[#262321] border border-[#8F3040]/30";
    return "bg-[#262321] text-[#F8F5F0]";
  };

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
      className="group relative bg-[#FFFFFF] rounded-2xl p-2.5 border border-[#E7E1DC] hover:border-[#8F3040]/40 hover:shadow-xl hover:shadow-[#262321]/6 transition-all duration-200 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Image Container */}
        <div className="relative aspect-square rounded-xl bg-[#F8F5F0] overflow-hidden border border-[#E7E1DC]/70">
          <Image
            src={product.image}
            alt={lang === "en" ? product.name : product.nameZh}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-106"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />

          {/* Badge */}
          {product.badge && (
            <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold font-body shadow-xs ${getBadgeStyle(product.badge)}`}>
              {product.badge}
            </span>
          )}

          {/* Quick Add Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className="absolute bottom-2 right-2 w-8 h-8 rounded-lg bg-[#8F3040] hover:bg-[#722633] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-md shadow-[#8F3040]/25"
            aria-label={`${t("quickAdd")} ${lang === "en" ? product.name : product.nameZh}`}
          >
            <Plus size={16} />
          </motion.button>
        </div>

        {/* Info */}
        <div className="mt-2.5 space-y-1 px-1">
          {/* Color Swatches + Spec */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 4).map((color, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border border-[#E7E1DC] shadow-2xs"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {product.spec && (
              <>
                <span className="text-[10px] text-[#E7E1DC]">·</span>
                <span className="font-body text-[10px] font-medium text-[#736B66] truncate">{product.spec}</span>
              </>
            )}
          </div>

          {/* Name */}
          <p className="font-body text-xs font-semibold text-[#262321] line-clamp-1 group-hover:text-[#8F3040] transition-colors duration-200">
            {lang === "en" ? product.name : product.nameZh}
          </p>
        </div>
      </div>

      {/* Price + Rating */}
      <div className="mt-2.5 pt-2 border-t border-[#E7E1DC]/70 flex items-center justify-between px-1">
        <span className="font-display text-sm font-extrabold text-[#8F3040]">${product.price}</span>
        {product.rating && (
          <span className="flex items-center gap-0.5 font-body text-[10px] font-semibold text-[#736B66]">
            <Star size={10} className="fill-[#8F3040] text-[#8F3040]" />
            <span className="text-[#262321] font-bold">{product.rating}</span>
            {product.reviews && <span className="text-[#736B66] font-normal">({product.reviews})</span>}
          </span>
        )}
      </div>
    </motion.div>
  );
}

