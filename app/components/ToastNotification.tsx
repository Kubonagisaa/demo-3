"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import type { CartItem } from "@/app/lib/cart";
import type { Language } from "@/app/lib/i18n";

interface ToastProps {
  item: Omit<CartItem, "qty"> | null;
  onClose: () => void;
  onOpenCart: () => void;
  lang: Language;
}

export function ToastNotification({ item, onClose, onOpenCart, lang }: ToastProps) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="fixed top-20 right-6 z-[110] max-w-sm w-full bg-white border border-[#E7E1DC] rounded-2xl shadow-xl p-3.5 flex items-center gap-3"
          role="status"
          aria-live="polite"
        >
          {/* Thumbnail */}
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#F8F5F0] flex-shrink-0 border border-[#E7E1DC]">
            <Image
              src={item.image}
              alt={lang === "en" ? item.name : item.nameZh}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[#8F3040] text-[11px] font-bold uppercase tracking-wider mb-0.5">
              <Check size={12} className="stroke-[3]" />
              <span>{lang === "en" ? "Added to Bag" : "已加入购物袋"}</span>
            </div>
            <p className="font-body text-xs font-bold text-[#262321] truncate">
              {lang === "en" ? item.name : item.nameZh}
            </p>
            <p className="font-body text-xs font-extrabold text-[#8F3040]">${item.price}</p>
          </div>

          {/* Action to view bag */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCart();
            }}
            className="flex-shrink-0 bg-[#8F3040] hover:bg-[#792534] text-white font-body text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>{lang === "en" ? "Bag" : "购物袋"}</span>
            <ArrowRight size={11} />
          </button>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#736B66] hover:text-[#262321] transition-colors rounded-lg cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
