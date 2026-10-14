"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

/* ─── Types ─── */

export type Language = "en" | "zh";

type Dict = Record<string, Record<Language, string>>;

/* ─── Dictionary ─── */

const dict: Dict = {
  // Header
  brandItems: { en: "1,000+ Items", zh: "1,000+ 商品" },
  searchPlaceholder: { en: "Search by name, SKU, material…", zh: "按名称、SKU、材质搜索…" },
  allDepartments: { en: "All Departments", zh: "所有部门" },
  bag: { en: "Your Bag", zh: "购物袋" },
  checkout: { en: "Proceed to checkout", zh: "前往结算" },
  emptyBag: { en: "Your bag is empty", zh: "购物袋为空" },
  continueShopping: { en: "Continue shopping", zh: "继续购物" },
  subtotal: { en: "Subtotal", zh: "小计" },
  freeShipProgress: { en: "away from free shipping", zh: "即可免运费" },
  freeShipDone: { en: "You qualify for free shipping!", zh: "已享受免运费！" },
  quickAdd: { en: "Quick Add", zh: "快速添加" },

  // Sidebar
  allDepts: { en: "All Departments", zh: "所有部门" },
  filters: { en: "Filters", zh: "筛选" },
  priceRange: { en: "Price Range", zh: "价格范围" },
  inStockOnly: { en: "In Stock Only", zh: "仅显示有货" },
  material: { en: "Material", zh: "材质" },
  categoriesFilters: { en: "Categories & Filters", zh: "分类与筛选" },

  // Departments
  deptWorkspace: { en: "Workspace", zh: "工作空间" },
  deptLiving: { en: "Home Living", zh: "居家生活" },
  deptWardrobe: { en: "Wardrobe", zh: "日常衣物" },
  deptTech: { en: "Tech Gadgets", zh: "数码科技" },
  deptKitchen: { en: "Kitchenware", zh: "厨房用品" },
  deptCare: { en: "Personal Care", zh: "个人护理" },

  // Subcategories
  subDeskLamps: { en: "Desk Lamps", zh: "台灯" },
  subOrganizers: { en: "Organizers", zh: "收纳" },
  subChairsMats: { en: "Chairs & Mats", zh: "座椅与垫子" },
  subCandlesScents: { en: "Candles & Scents", zh: "蜡烛与香薰" },
  subVasesPlanters: { en: "Vases & Planters", zh: "花瓶与花盆" },
  subThrowsTextiles: { en: "Throws & Textiles", zh: "毯子与纺织品" },
  subTops: { en: "Tops", zh: "上衣" },
  subBottoms: { en: "Bottoms", zh: "裤装" },
  subOuterwear: { en: "Outerwear", zh: "外套" },
  subChargersCables: { en: "Chargers & Cables", zh: "充电器与线材" },
  subAccessories: { en: "Accessories", zh: "配件" },
  subCookware: { en: "Cookware", zh: "烹饪用具" },
  subTableware: { en: "Tableware", zh: "餐具" },
  subSkincare: { en: "Skincare", zh: "护肤" },
  subBathBody: { en: "Bath & Body", zh: "沐浴与身体" },

  // Grid utility
  sortFeatured: { en: "Featured", zh: "推荐" },
  sortPriceLow: { en: "Price: Low to High", zh: "价格从低到高" },
  sortPriceHigh: { en: "Price: High to Low", zh: "价格从高到低" },
  sortBestSelling: { en: "Best Selling", zh: "畅销" },
  loadMore: { en: "Load More Products", zh: "加载更多商品" },
  showing: { en: "Showing", zh: "显示" },
  of: { en: "of", zh: "共" },
  products: { en: "products", zh: "件商品" },

  // Trending
  trendingBrassLamp: { en: "Brass Lamp", zh: "黄铜台灯" },
  trendingMerinoTee: { en: "Merino Tee", zh: "美利奴T恤" },
  trendingCeramic: { en: "Ceramic", zh: "陶瓷" },
  trendingWalnut: { en: "Walnut", zh: "胡桃木" },

  // Hero & Categories
  heroBadge: { en: "HAVEN SMART MEGA-CATALOG · 2026", zh: "HAVEN 智能大目录 · 2026" },
  heroTitle: { en: "A More Considered Way to Live.", zh: "更加精简专注的生活方式。" },
  heroSubtitle: { en: "Single-vendor precision catalog across 6 core lifestyle departments. Factory-direct craft with zero retail markup.", zh: "跨越6大核心生活部门的单品牌严选目录。原厂直达，剔除层层溢价。" },
  exploreCatalog: { en: "Browse Mega-Catalog", zh: "浏览全部大目录" },
  viewNewIn: { en: "Discover New In", zh: "探索本季新品" },
  curatedItems: { en: "Curated Essentials", zh: "甄选生活单品" },
  coreDepartments: { en: "Departments", zh: "核心分类部门" },
  verifiedCraft: { en: "Verified Craft", zh: "原厂直造品质" },
  freeWorldwide: { en: "Worldwide Free Shipping", zh: "全球免运专线" },
  featuredDepartments: { en: "Featured Departments", zh: "特色核心部门" },
  departmentSub: { en: "Instant department navigation across our full range of 1,000+ catalog items.", zh: "即时分类导航，快速定位1,000+大目录商品。" },
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
