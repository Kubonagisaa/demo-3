"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

/* ─── Types ─── */

export type Language = "en" | "zh";

type Dict = Record<string, Record<Language, string>>;

/* ─── Dictionary ─── */

const dict: Dict = {
  kicker: { en: "CURATED DEPARTMENT STORE 2026", zh: "2026 精选生活百货" },
  headline: { en: "A More Considered\nWay to Live.", zh: "更值得斟酌的\n生活方式。" },
  heroCopy: {
    en: "Thoughtfully selected essentials for your workspace, wardrobe, home, and everyday life.",
    zh: "为您的工作空间、衣橱、居家和日常生活精心甄选的必需品。",
  },
  ctaPrimary: { en: "Explore Collection — $507", zh: "探索系列 — $507" },
  ctaSecondary: { en: "Browse 6 Categories", zh: "浏览品类" },
  // Header
  shipping: { en: "Free worldwide shipping over $150", zh: "全球订单满$150免运费" },
  guarantee: { en: "30-day quality guarantee", zh: "30天品质保证" },
  search: { en: "Search", zh: "搜索" },
  bag: { en: "Your Bag", zh: "购物袋" },
  checkout: { en: "Proceed to checkout", zh: "前往结算" },
  emptyBag: { en: "Your bag is empty", zh: "购物袋为空" },
  continueShopping: { en: "Continue shopping", zh: "继续购物" },
  subtotal: { en: "Subtotal", zh: "小计" },
  freeShipProgress: { en: "away from free shipping", zh: "即可免运费" },
  freeShipDone: { en: "You qualify for free shipping!", zh: "已享受免运费！" },
  quickAdd: { en: "Quick Add", zh: "快速添加" },
  loadMore: { en: "Load More Products", zh: "加载更多商品" },
  // Departments
  deptWorkspace: { en: "Workspace", zh: "工作空间" },
  deptLiving: { en: "Living", zh: "居家生活" },
  deptWardrobe: { en: "Wardrobe", zh: "日常衣物" },
  deptTech: { en: "Tech Gadgets", zh: "数码科技" },
  deptCare: { en: "Personal Care", zh: "个人护理" },
  deptTravel: { en: "Travel Goods", zh: "旅行配件" },
  // Sections
  curatedTitle: { en: "Curated Departments", zh: "精选品类" },
  curatedSub: { en: "Six categories, one considered standard.", zh: "六大品类，统一甄选标准。" },
  catalogTitle: { en: "Full Collection", zh: "全部商品" },
  filterAll: { en: "All", zh: "全部" },
  sortFeatured: { en: "Featured", zh: "推荐" },
  sortPriceLow: { en: "Price: Low", zh: "价格从低到高" },
  sortNewest: { en: "Newest", zh: "最新" },
  trustTitle: { en: "Why Haven", zh: "为何选择 Haven" },
  trustDirect: { en: "Direct Manufacturing", zh: "直接制造" },
  trustDirectSub: { en: "No middlemen markup. Factory-to-you pricing.", zh: "无中间商加价，工厂直达。" },
  trustSustain: { en: "Sustainable Materials", zh: "可持续材料" },
  trustSustainSub: { en: "Organic, recycled, and responsibly sourced.", zh: "有机、回收、责任采购。" },
  trustShip: { en: "Express Global Delivery", zh: "全球快速配送" },
  trustShipSub: { en: "3–5 day delivery to 40+ countries.", zh: "3-5天配送至40+国家。" },
  trustSupport: { en: "24/7 Concierge", zh: "全天候专属服务" },
  trustSupportSub: { en: "Dedicated support for every order.", zh: "每一笔订单都有专属客服。" },
};

/* ─── Context ─── */

interface I18nContext {
  lang: Language;
  toggle: () => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nContext>({
  lang: "en",
  toggle: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const toggle = useCallback(() => {
    setLang((prev) => (prev === "en" ? "zh" : "en"));
  }, []);

  const t = useCallback(
    (key: string) => dict[key]?.[lang] ?? key,
    [lang]
  );

  return <Ctx.Provider value={{ lang, toggle, t }}>{children}</Ctx.Provider>;
}

export function useLanguage() {
  return useContext(Ctx);
}
