"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Check, ShieldCheck, Truck } from "lucide-react";
import type { Product } from "@/app/lib/data";
import type { Language } from "@/app/lib/i18n";

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number) => void;
  lang: Language;
}

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

export function ProductQuickView({ product, onClose, onAddToCart, lang }: QuickViewProps) {
  const [qty, setQty] = useState(1);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [product, onClose]);

  const productName = product ? (lang === "en" ? product.name : product.nameZh) : "";

  const handleAdd = () => {
    if (!product) return;
    onAddToCart(product, qty);
    setQty(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#292D29]/60 backdrop-blur-sm"
            aria-hidden="true"
          />

        {/* Modal Window */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={productName}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative z-10 w-full max-w-3xl bg-[#F8F7F2] rounded-3xl border border-[#D8D4C7] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#E8E5DA] hover:bg-[#34483B] text-[#292D29] hover:text-[#F8F7F2] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          {/* Left: Product Image */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-[#E8E5DA] min-h-[320px] p-8 flex items-center justify-center">
            <div className="relative w-full h-full max-w-xs aspect-square rounded-2xl overflow-hidden bg-[#F8F7F2] shadow-sm">
              <Image
                src={product.image}
                alt={productName}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Badge */}
            {product.badge && (
              <span className="absolute top-5 left-5 bg-[#7D927C] text-[#F8F7F2] font-body text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Right: Product Details & Controls */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category tag */}
              <p className="font-body text-[11px] font-semibold tracking-[0.2em] uppercase text-[#7D927C] mb-2">
                {product.category}
              </p>

              {/* Title & Price */}
              <h3 className="font-display font-bold text-2xl text-[#292D29] tracking-tight mb-2">
                {productName}
              </h3>
              <p className="font-display font-bold text-xl text-[#34483B] mb-4">
                ${product.price}
              </p>

              {/* Editorial Description */}
              <p className="font-body text-xs text-[#292D29]/75 leading-relaxed mb-6">
                {lang === "en"
                  ? "Crafted from raw, responsibly harvested materials with heirloom durability. Minimalist silhouette designed to elevate your everyday rituals."
                  : "采用责任采伐的原生态材料精工制作，具备传家宝般的耐用品质。极简主义线条设计，提升您的日常生活格调。"}
              </p>

              {/* Color options */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <p className="font-body text-xs font-semibold text-[#292D29] uppercase tracking-wider mb-2.5">
                    {lang === "en" ? "Finish / Tone" : "工艺色调"}
                  </p>
                  <div className="flex items-center gap-2">
                    {product.colors.map((colorHex, idx) => {
                      const bgClass = COLOR_CLASS_MAP[colorHex] ?? "bg-[#292D29]";
                      const isSelected = selectedColorIdx === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedColorIdx(idx)}
                          className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                            isSelected ? "border-[#34483B] scale-110 shadow-xs" : "border-[#D8D4C7] hover:scale-105"
                          }`}
                          aria-label={`Select tone ${colorHex}`}
                        >
                          <span className={`w-5 h-5 rounded-full ${bgClass} flex items-center justify-center`}>
                            {isSelected && <Check size={11} className="text-white drop-shadow-xs" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity selector */}
              <div className="mb-6">
                <p className="font-body text-xs font-semibold text-[#292D29] uppercase tracking-wider mb-2.5">
                  {lang === "en" ? "Quantity" : "数量"}
                </p>
                <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-[#E8E5DA] border border-[#D8D4C7]/60">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-[#F8F7F2] text-[#292D29] flex items-center justify-center hover:bg-[#34483B] hover:text-[#F8F7F2] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="font-body font-semibold text-sm text-[#292D29] w-6 text-center">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="w-8 h-8 rounded-lg bg-[#F8F7F2] text-[#292D29] flex items-center justify-center hover:bg-[#34483B] hover:text-[#F8F7F2] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions & Commitments */}
            <div>
              <button
                type="button"
                onClick={handleAdd}
                className="w-full bg-[#34483B] hover:bg-[#28382E] active:scale-[0.98] text-[#F8F7F2] font-body text-xs font-semibold tracking-wider uppercase py-4 rounded-xl shadow-md transition-all mb-4 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                <span>
                  {lang === "en" ? `Add to Bag — $${product.price * qty}` : `加入购物袋 — $${product.price * qty}`}
                </span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-[#292D29]/65 pt-3 border-t border-[#D8D4C7]/60">
                <span className="flex items-center gap-1.5">
                  <Truck size={13} className="text-[#7D927C]" />
                  <span>{lang === "en" ? "Free shipping over $150" : "满$150免运费"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-[#7D927C]" />
                  <span>{lang === "en" ? "30-day guarantee" : "30天品质保证"}</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
}
