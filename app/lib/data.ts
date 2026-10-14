/* ─── Types ─── */

export type CategorySlug = "workspace" | "living" | "wardrobe" | "tech" | "kitchen" | "care";

export interface SubCategory {
  slug: string;
  nameKey: string;
  count: number;
}

export interface CategoryNode {
  slug: CategorySlug;
  nameKey: string;
  icon: string; // lucide icon name
  count: number;
  subs: SubCategory[];
}

export interface Product {
  id: string;
  name: string;
  nameZh: string;
  price: number;
  image: string;
  category: CategorySlug;
  sub?: string;
  colors: string[];
  badge?: string;
  rating?: number;
  reviews?: number;
  spec?: string; // e.g. "Ø24cm" or "M-XL"
  material?: string;
  inStock?: boolean;
}

export interface FilterState {
  category: CategorySlug | "all";
  sub: string | null;
  priceRange: [number, number];
  inStockOnly: boolean;
  materials: string[];
  sort: "featured" | "price-asc" | "price-desc" | "best-selling";
}

/* ─── Category Tree ─── */

export const categoryTree: CategoryNode[] = [
  {
    slug: "workspace", nameKey: "deptWorkspace", icon: "Monitor", count: 180,
    subs: [
      { slug: "desk-lamps", nameKey: "subDeskLamps", count: 42 },
      { slug: "organizers", nameKey: "subOrganizers", count: 65 },
      { slug: "chairs-mats", nameKey: "subChairsMats", count: 73 },
    ],
  },
  {
    slug: "living", nameKey: "deptLiving", icon: "Sofa", count: 320,
    subs: [
      { slug: "candles-scents", nameKey: "subCandlesScents", count: 85 },
      { slug: "vases-planters", nameKey: "subVasesPlanters", count: 120 },
      { slug: "throws-textiles", nameKey: "subThrowsTextiles", count: 115 },
    ],
  },
  {
    slug: "wardrobe", nameKey: "deptWardrobe", icon: "Shirt", count: 210,
    subs: [
      { slug: "tops", nameKey: "subTops", count: 88 },
      { slug: "bottoms", nameKey: "subBottoms", count: 72 },
      { slug: "outerwear", nameKey: "subOuterwear", count: 50 },
    ],
  },
  {
    slug: "tech", nameKey: "deptTech", icon: "Cpu", count: 140,
    subs: [
      { slug: "chargers-cables", nameKey: "subChargersCables", count: 55 },
      { slug: "accessories", nameKey: "subAccessories", count: 85 },
    ],
  },
  {
    slug: "kitchen", nameKey: "deptKitchen", icon: "CookingPot", count: 90,
    subs: [
      { slug: "cookware", nameKey: "subCookware", count: 35 },
      { slug: "tableware", nameKey: "subTableware", count: 55 },
    ],
  },
  {
    slug: "care", nameKey: "deptCare", icon: "Droplets", count: 60,
    subs: [
      { slug: "skincare", nameKey: "subSkincare", count: 30 },
      { slug: "bath-body", nameKey: "subBathBody", count: 30 },
    ],
  },
];

/* ─── Product Data (representative subset of ~1,000 SKU catalog) ─── */

export const products: Product[] = [
  // Workspace
  { id: "w1", name: "Arc Desk Lamp", nameZh: "弧形台灯", price: 189, image: "/product-desk-lamp.jpg", category: "workspace", sub: "desk-lamps", colors: ["#C9B896", "#121212", "#F5F5F0"], badge: "Best Seller", rating: 4.9, reviews: 128, spec: "Ø24cm", material: "Brass", inStock: true },
  { id: "w2", name: "Walnut Monitor Riser", nameZh: "胡桃木显示器支架", price: 129, image: "/product-wireless-charger.jpg", category: "workspace", sub: "organizers", colors: ["#8B6914", "#3D3D3D"], rating: 4.7, reviews: 86, material: "Walnut", inStock: true },
  { id: "w3", name: "Felt Desk Pad XL", nameZh: "毛毡桌垫 加大款", price: 79, image: "/hero-concept-store.jpg", category: "workspace", sub: "organizers", colors: ["#6B6B6B", "#8B7355", "#121212"], rating: 4.5, reviews: 64, spec: "90×40cm", material: "Linen", inStock: true },
  { id: "w4", name: "Brass Pen Holder", nameZh: "黄铜笔筒", price: 48, image: "/product-desk-lamp.jpg", category: "workspace", sub: "organizers", colors: ["#C9B896"], badge: "New", rating: 4.8, reviews: 32, material: "Brass", inStock: true },

  // Home Living
  { id: "l1", name: "Stoneware Mug Set", nameZh: "粗陶马克杯套装", price: 64, image: "/product-ceramic-set.jpg", category: "living", sub: "tableware", colors: ["#E8DCC8", "#C4A882", "#C25E3E"], badge: "New", rating: 4.8, reviews: 97, spec: "Set of 4", material: "Ceramic", inStock: true },
  { id: "l2", name: "Linen Throw Blanket", nameZh: "亚麻毛毯", price: 148, image: "/product-merino-tee.jpg", category: "living", sub: "throws-textiles", colors: ["#E8DCC8", "#6B6B6B"], rating: 4.6, reviews: 53, spec: "150×200cm", material: "Linen", inStock: true },
  { id: "l3", name: "Hand-Poured Candle", nameZh: "手工蜡烛", price: 38, image: "/product-ceramic-set.jpg", category: "living", sub: "candles-scents", colors: ["#F5F5F0", "#E8DCC8"], rating: 4.4, reviews: 41, material: "Ceramic", inStock: true },
  { id: "l4", name: "Ceramic Vase — Tall", nameZh: "陶瓷花瓶 — 高款", price: 92, image: "/product-ceramic-set.jpg", category: "living", sub: "vases-planters", colors: ["#E8DCC8", "#121212"], badge: "Best Seller", rating: 4.9, reviews: 156, spec: "H 32cm", material: "Ceramic", inStock: true },

  // Wardrobe
  { id: "wr1", name: "Merino Crew Tee", nameZh: "美利奴羊毛T恤", price: 89, image: "/product-merino-tee.jpg", category: "wardrobe", sub: "tops", colors: ["#E8DCC8", "#121212", "#6B6B6B"], badge: "Staff Pick", rating: 4.7, reviews: 204, spec: "3 Colors · S-XL", inStock: true },
  { id: "wr2", name: "Relaxed Linen Shirt", nameZh: "宽松亚麻衬衫", price: 118, image: "/product-merino-tee.jpg", category: "wardrobe", sub: "tops", colors: ["#F5F5F0", "#5B6E7A"], rating: 4.6, reviews: 78, spec: "M-XL", material: "Linen", inStock: true },
  { id: "wr3", name: "Organic Cotton Joggers", nameZh: "有机棉运动裤", price: 94, image: "/product-merino-tee.jpg", category: "wardrobe", sub: "bottoms", colors: ["#121212", "#6B6B6B", "#3D3D3D"], rating: 4.5, reviews: 112, spec: "S-XXL", inStock: true },
  { id: "wr4", name: "Wool Blend Overshirt", nameZh: "羊毛混纺衬衫外套", price: 168, image: "/product-merino-tee.jpg", category: "wardrobe", sub: "outerwear", colors: ["#3D3D3D", "#8B7355"], badge: "New", rating: 4.8, reviews: 45, spec: "M-XL", inStock: true },

  // Tech Gadgets
  { id: "t1", name: "Walnut Wireless Charger", nameZh: "胡桃木无线充电器", price: 68, image: "/product-wireless-charger.jpg", category: "tech", sub: "chargers-cables", colors: ["#8B6914", "#3D3D3D"], badge: "New", rating: 4.6, reviews: 89, material: "Walnut", inStock: true },
  { id: "t2", name: "Aluminum Cable Organizer", nameZh: "铝合金理线器", price: 34, image: "/product-wireless-charger.jpg", category: "tech", sub: "accessories", colors: ["#C0C0C0", "#121212"], rating: 4.3, reviews: 56, inStock: true },
  { id: "t3", name: "Leather AirTag Keychain", nameZh: "皮革AirTag钥匙扣", price: 29, image: "/product-wireless-charger.jpg", category: "tech", sub: "accessories", colors: ["#8B7355", "#121212"], rating: 4.7, reviews: 142, inStock: true },
  { id: "t4", name: "Bamboo Laptop Stand", nameZh: "竹制笔记本支架", price: 85, image: "/product-wireless-charger.jpg", category: "tech", sub: "accessories", colors: ["#C9B896"], rating: 4.5, reviews: 67, inStock: true },

  // Kitchenware
  { id: "k1", name: "Cast Iron Skillet 26cm", nameZh: "铸铁煎锅 26cm", price: 135, image: "/product-ceramic-set.jpg", category: "kitchen", sub: "cookware", colors: ["#121212"], rating: 4.9, reviews: 213, spec: "Ø26cm", inStock: true },
  { id: "k2", name: "Ceramic Dinner Plates", nameZh: "陶瓷餐盘套装", price: 78, image: "/product-ceramic-set.jpg", category: "kitchen", sub: "tableware", colors: ["#E8DCC8", "#F5F5F0"], badge: "Best Seller", rating: 4.8, reviews: 178, spec: "Set of 4", material: "Ceramic", inStock: true },
  { id: "k3", name: "Olive Wood Utensil Set", nameZh: "橄榄木餐具套装", price: 56, image: "/hero-texture.jpg", category: "kitchen", sub: "cookware", colors: ["#8B6914"], rating: 4.6, reviews: 94, spec: "5 Pieces", inStock: true },

  // Personal Care
  { id: "c1", name: "Botanical Face Oil", nameZh: "植物面部精油", price: 56, image: "/product-desk-lamp.jpg", category: "care", sub: "skincare", colors: ["#7A8B6F", "#F5F5F0"], rating: 4.7, reviews: 83, spec: "30ml", inStock: true },
  { id: "c2", name: "Charcoal Bar Soap Set", nameZh: "竹炭手工皂套装", price: 28, image: "/product-desk-lamp.jpg", category: "care", sub: "bath-body", colors: ["#3D3D3D", "#E8DCC8"], badge: "New", rating: 4.5, reviews: 127, spec: "3 Bars", inStock: true },
  { id: "c3", name: "Hinoki Body Lotion", nameZh: "檜木身体乳", price: 42, image: "/product-desk-lamp.jpg", category: "care", sub: "bath-body", colors: ["#C9B896"], rating: 4.4, reviews: 61, spec: "250ml", inStock: true },
  { id: "c4", name: "Mineral Clay Mask", nameZh: "矿物泥面膜", price: 38, image: "/product-desk-lamp.jpg", category: "care", sub: "skincare", colors: ["#E8DCC8"], rating: 4.6, reviews: 72, spec: "100g", material: "Ceramic", inStock: true },
];

/* ─── All available materials for filter ─── */
export const allMaterials = ["Brass", "Walnut", "Linen", "Ceramic"] as const;
