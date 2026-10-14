/* ─── Types ─── */

export type CategorySlug = "workspace" | "living" | "wardrobe" | "tech" | "care" | "travel";

export interface Department {
  slug: CategorySlug;
  nameKey: string;
  count: number;
  image: string;
  accent: string;
}

export interface Product {
  id: string;
  name: string;
  nameZh: string;
  price: number;
  image: string;
  category: CategorySlug;
  colors: string[];
  badge?: string;
}

/* ─── Department Data ─── */

export const departments: Department[] = [
  { slug: "workspace", nameKey: "deptWorkspace", count: 184, image: "/hero-concept-store.jpg", accent: "#C25E3E" },
  { slug: "living", nameKey: "deptLiving", count: 216, image: "/product-ceramic-set.jpg", accent: "#8B7355" },
  { slug: "wardrobe", nameKey: "deptWardrobe", count: 197, image: "/product-merino-tee.jpg", accent: "#6B6B6B" },
  { slug: "tech", nameKey: "deptTech", count: 143, image: "/product-wireless-charger.jpg", accent: "#5B6E7A" },
  { slug: "care", nameKey: "deptCare", count: 132, image: "/product-desk-lamp.jpg", accent: "#7A8B6F" },
  { slug: "travel", nameKey: "deptTravel", count: 128, image: "/hero-texture.jpg", accent: "#8B7355" },
];

/* ─── Product Data (representative subset of ~1000 SKU catalog) ─── */

export const products: Product[] = [
  // Workspace
  { id: "w1", name: "Arc Desk Lamp", nameZh: "弧形台灯", price: 189, image: "/product-desk-lamp.jpg", category: "workspace", colors: ["#C9B896", "#121212", "#F5F5F0"], badge: "Best Seller" },
  { id: "w2", name: "Walnut Monitor Riser", nameZh: "胡桃木显示器支架", price: 129, image: "/product-wireless-charger.jpg", category: "workspace", colors: ["#8B6914", "#3D3D3D"] },
  { id: "w3", name: "Felt Desk Pad XL", nameZh: "毛毡桌垫 加大款", price: 79, image: "/hero-concept-store.jpg", category: "workspace", colors: ["#6B6B6B", "#8B7355", "#121212"] },
  { id: "w4", name: "Brass Pen Holder", nameZh: "黄铜笔筒", price: 48, image: "/product-desk-lamp.jpg", category: "workspace", colors: ["#C9B896"] },

  // Living
  { id: "l1", name: "Stoneware Mug Set", nameZh: "粗陶马克杯套装", price: 64, image: "/product-ceramic-set.jpg", category: "living", colors: ["#E8DCC8", "#C4A882", "#C25E3E"], badge: "New" },
  { id: "l2", name: "Linen Throw Blanket", nameZh: "亚麻毛毯", price: 148, image: "/product-merino-tee.jpg", category: "living", colors: ["#E8DCC8", "#6B6B6B"] },
  { id: "l3", name: "Hand-Poured Candle", nameZh: "手工蜡烛", price: 38, image: "/product-ceramic-set.jpg", category: "living", colors: ["#F5F5F0", "#E8DCC8"] },
  { id: "l4", name: "Ceramic Vase — Tall", nameZh: "陶瓷花瓶 — 高款", price: 92, image: "/product-ceramic-set.jpg", category: "living", colors: ["#E8DCC8", "#121212"] },

  // Wardrobe
  { id: "wr1", name: "Merino Crew Tee", nameZh: "美利奴羊毛T恤", price: 89, image: "/product-merino-tee.jpg", category: "wardrobe", colors: ["#E8DCC8", "#121212", "#6B6B6B"], badge: "Staff Pick" },
  { id: "wr2", name: "Relaxed Linen Shirt", nameZh: "宽松亚麻衬衫", price: 118, image: "/product-merino-tee.jpg", category: "wardrobe", colors: ["#F5F5F0", "#5B6E7A"] },
  { id: "wr3", name: "Organic Cotton Joggers", nameZh: "有机棉运动裤", price: 94, image: "/product-merino-tee.jpg", category: "wardrobe", colors: ["#121212", "#6B6B6B", "#3D3D3D"] },

  // Tech
  { id: "t1", name: "Walnut Wireless Charger", nameZh: "胡桃木无线充电器", price: 68, image: "/product-wireless-charger.jpg", category: "tech", colors: ["#8B6914", "#3D3D3D"], badge: "New" },
  { id: "t2", name: "Aluminum Cable Organizer", nameZh: "铝合金理线器", price: 34, image: "/product-wireless-charger.jpg", category: "tech", colors: ["#C0C0C0", "#121212"] },
  { id: "t3", name: "Leather AirTag Keychain", nameZh: "皮革AirTag钥匙扣", price: 29, image: "/product-wireless-charger.jpg", category: "tech", colors: ["#8B7355", "#121212"] },

  // Care
  { id: "c1", name: "Botanical Face Oil", nameZh: "植物面部精油", price: 56, image: "/product-desk-lamp.jpg", category: "care", colors: ["#7A8B6F", "#F5F5F0"] },
  { id: "c2", name: "Charcoal Bar Soap Set", nameZh: "竹炭手工皂套装", price: 28, image: "/product-desk-lamp.jpg", category: "care", colors: ["#3D3D3D", "#E8DCC8"] },

  // Travel
  { id: "tr1", name: "Canvas Weekender Bag", nameZh: "帆布旅行包", price: 245, image: "/hero-texture.jpg", category: "travel", colors: ["#8B7355", "#121212"] },
  { id: "tr2", name: "Leather Passport Wallet", nameZh: "皮革护照夹", price: 78, image: "/hero-texture.jpg", category: "travel", colors: ["#8B7355", "#C9B896"] },
];
