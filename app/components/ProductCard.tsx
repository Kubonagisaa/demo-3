"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Eye } from "lucide-react";
import type { Product } from "@/app/lib/data";
import type { Language } from "@/app/lib/i18n";

interface ProductCardProps {
  product: Product;
  onQuickAdd: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  lang: Language;
}

/* Color swatch mapping to pure Tailwind utility classes - zero inline styles */
const COLOR_CLASS_MAP: Record<string, string> = {
  "#C9B896": "bg-[#C9B896]",
  "#121212": "bg-[#121212]",
  "#F5F5F0": "bg-[#F5F5F0]",
  "#8B6914": "bg-[#8B6914]",
  "#3D3D3D": "bg-[#3D3D3D]",
  "#6B6B6B": "bg-[#6B6B6B]",
  "#8B7355": "bg-[#8B7355]",
  "#E8DCC8": "bg-[#E8DCC8]",
  "#C4A882": "bg-[#C4A882]",
  "#C25E3E": "bg-[#C25E3E]",
  "#5B6E7A": "bg-[#5B6E7A]",
  "#C0C0C0": "bg-[#C0C0C0]",
  "#7A8B6F": "bg-[#7A8B6F]",
};

export function ProductCard({ product, onQuickAdd, onQuickView, lang }: ProductCardProps) {
  const productName = lang === "en" ? product.name : product.nameZh;
  const quickAddLabel = lang === "en" ? "QUICK ADD" : "快速添加";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${productName}`}
      onClick={() => onQuickView?.(product)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onQuickView?.(product);
        }
      }}
      className="group flex flex-col cursor-pointer focus-visible:outline-2 focus-visible:outline-[#34483B] focus-visible:outline-offset-4 rounded-2xl"
    >
      {/* Product Image Frame with Linen (#E8E5DA) surface & rounded-2xl */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#E8E5DA] mb-3.5 border border-[#D8D4C7]/50 shadow-xs transition-shadow duration-300 group-hover:shadow-md">
        <Image
          src={product.image}
          alt={productName}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {/* Badge: Sage (#7D927C) with Warm White (#F8F7F2) text */}
        {product.badge && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="absolute top-3 left-3 bg-[#7D927C] text-[#F8F7F2] font-body text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs pointer-events-none"
          >
            {product.badge}
          </motion.div>
        )}

        {/* Quick View Icon badge in top right on hover */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#F8F7F2]/90 border border-[#D8D4C7]/60 text-[#292D29] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xs pointer-events-none">
          <Eye size={13} />
        </div>

        {/* Quick Add Button: Forest (#34483B) background, spring slide-up on card hover and visible on touch / focus */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => {
            e.stopPropagation();
            onQuickAdd(product);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
            }
          }}
          className="absolute bottom-3 left-3 right-3 bg-[#34483B] hover:bg-[#28382E] active:scale-95 text-[#F8F7F2] font-body text-xs font-semibold tracking-wider uppercase py-3 rounded-xl opacity-100 translate-y-0 md:opacity-0 md:translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0 focus-visible:opacity-100 focus-visible:translate-y-0 transition-all duration-300 ease-out shadow-md flex items-center justify-center gap-1.5 cursor-pointer z-10"
          aria-label={`${quickAddLabel} ${productName}`}
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>{quickAddLabel}</span>
        </motion.button>
      </div>

      {/* Typography: Ink (#292D29) title and price with smooth color shift on card hover */}
      <h3 className="font-body text-sm font-semibold text-[#292D29] group-hover:text-[#34483B] transition-colors duration-200 tracking-[-0.01em] mb-1 line-clamp-1">
        {productName}
      </h3>

      <div className="flex items-center justify-between">
        <span className="font-body text-sm font-medium text-[#292D29]/80">
          ${product.price}
        </span>

        {/* Color Swatches with Hairline (#D8D4C7) border & hover bounce */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1" aria-label={`Available in ${product.colors.length} finishes`}>
            {product.colors.slice(0, 3).map((colorHex, idx) => {
              const bgClass = COLOR_CLASS_MAP[colorHex] ?? "bg-[#292D29]";
              return (
                <span
                  key={idx}
                  className={`w-3 h-3 rounded-full border border-[#D8D4C7] shadow-xs transition-transform duration-200 hover:scale-125 ${bgClass}`}
                  aria-hidden="true"
                />
              );
            })}
          </div>
        )}
      </div>
    </motion.article>
  );
}
