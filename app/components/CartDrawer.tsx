"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, ArrowRight } from "lucide-react";
import { useLanguage } from "@/app/lib/i18n";
import { useCart } from "@/app/lib/cart";

function getProgressWidthClass(ratio: number): string {
  if (ratio >= 1) return "w-full";
  if (ratio >= 0.9) return "w-[90%]";
  if (ratio >= 0.8) return "w-[80%]";
  if (ratio >= 0.7) return "w-[70%]";
  if (ratio >= 0.6) return "w-[60%]";
  if (ratio >= 0.5) return "w-[50%]";
  if (ratio >= 0.4) return "w-[40%]";
  if (ratio >= 0.3) return "w-[30%]";
  if (ratio >= 0.2) return "w-[20%]";
  if (ratio >= 0.1) return "w-[10%]";
  return "w-0";
}

export function CartDrawer() {
  const { t, lang } = useLanguage();
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal } = useCart();
  const freeShipThreshold = 150;
  const remaining = freeShipThreshold - subtotal;
  const shippingProgressRatio = subtotal / freeShipThreshold;
  const progressWidthClass = getProgressWidthClass(shippingProgressRatio);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay backdrop: Ink (#292D29) at 50% opacity with subtle blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[95] bg-[#292D29]/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer Panel: 100% opaque Warm White (#F8F7F2), Linen (#E8E5DA) left border, z-[100] */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t("bag")}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-0 right-0 bottom-0 z-[100] w-full max-w-md bg-[#F8F7F2] border-l border-[#E8E5DA] shadow-2xl flex flex-col opacity-100"
          >
            {/* Header: Isolated h-20 with fixed padding, Ink (#292D29) text and independent close button */}
            <div className="h-20 flex-shrink-0 flex items-center justify-between px-6 border-b border-[#E8E5DA] bg-[#F8F7F2]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#292D29]" />
                <h2 className="font-display font-semibold text-[#292D29] text-lg tracking-[-0.02em]">
                  {t("bag")} ({items.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="p-2.5 rounded-full hover:bg-[#E8E5DA] text-[#292D29] transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Close cart"
              >
                <X size={20} className="stroke-[2]" />
              </button>
            </div>

            {/* Free shipping progress on Warm White (#F8F7F2) surface */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-b border-[#E8E5DA] bg-[#F8F7F2]">
                {remaining > 0 ? (
                  <p className="font-body text-xs font-medium text-[#292D29]/80">
                    <span className="font-bold text-[#34483B]">${remaining.toFixed(0)}</span>{" "}
                    {t("freeShipProgress")}
                  </p>
                ) : (
                  <p className="font-body text-xs text-[#7D927C] font-semibold flex items-center gap-1.5">
                    <span>✓</span> {t("freeShipDone")}
                  </p>
                )}
                {/* Progress bar container in Linen (#E8E5DA) and indicator in Forest (#34483B) */}
                <div
                  role="progressbar"
                  aria-valuenow={Math.min(subtotal, freeShipThreshold)}
                  aria-valuemin={0}
                  aria-valuemax={freeShipThreshold}
                  aria-label={remaining > 0 ? `${remaining.toFixed(0)} ${t("freeShipProgress")}` : t("freeShipDone")}
                  className="mt-2.5 h-1.5 bg-[#E8E5DA] rounded-full overflow-hidden border border-[#D8D4C7]/50"
                >
                  <div
                    className={`h-full bg-[#34483B] rounded-full transition-all duration-300 ease-out ${progressWidthClass}`}
                  />
                </div>
              </div>
            )}

            {/* Product list area */}
            <div className="flex-1 overflow-y-auto px-6 py-5 bg-[#F8F7F2]">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#E8E5DA] flex items-center justify-center mb-4 text-[#292D29]/60">
                    <ShoppingBag size={28} />
                  </div>
                  <p className="font-body text-base font-semibold text-[#292D29]">{t("emptyBag")}</p>
                  <p className="font-body text-xs text-[#292D29]/60 mt-1 max-w-xs">
                    {lang === "en"
                      ? "Explore our curated collection to add items."
                      : "探索我们精心甄选的系列以添加商品。"}
                  </p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-6 inline-flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-wider text-[#34483B] hover:text-[#28382E] transition-colors"
                  >
                    <span>{t("continueShopping")}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3.5 rounded-2xl bg-[#E8E5DA] border border-[#D8D4C7]/60 shadow-xs"
                    >
                      {/* Product Thumbnail inside Warm White (#F8F7F2) container */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F8F7F2] border border-[#D8D4C7]/50 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={lang === "en" ? item.name : item.nameZh}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Item Details in Ink (#292D29) */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="font-body text-sm font-semibold text-[#292D29] truncate">
                            {lang === "en" ? item.name : item.nameZh}
                          </h4>
                          <p className="font-body text-sm font-medium text-[#292D29]/75 mt-0.5">
                            ${item.price}
                          </p>
                        </div>

                        {/* Quantity and remove controls with enhanced touch target */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="w-8 h-8 rounded-full bg-[#F8F7F2] border border-[#D8D4C7] text-[#292D29] flex items-center justify-center hover:bg-[#34483B] hover:text-[#F8F7F2] hover:border-[#34483B] transition-colors cursor-pointer"
                            aria-label={`Decrease quantity for ${lang === "en" ? item.name : item.nameZh}`}
                          >
                            <Minus size={13} />
                          </button>
                          <span className="font-body text-xs font-semibold text-[#292D29] w-6 text-center">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-8 h-8 rounded-full bg-[#F8F7F2] border border-[#D8D4C7] text-[#292D29] flex items-center justify-center hover:bg-[#34483B] hover:text-[#F8F7F2] hover:border-[#34483B] transition-colors cursor-pointer"
                            aria-label={`Increase quantity for ${lang === "en" ? item.name : item.nameZh}`}
                          >
                            <Plus size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="ml-auto p-2 text-[#292D29]/50 hover:text-red-700 transition-colors cursor-pointer rounded-full"
                            aria-label={`Remove ${lang === "en" ? item.name : item.nameZh} from bag`}
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Checkout CTA: Solid Forest (#34483B) block with Warm White (#F8F7F2) text */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-[#E8E5DA] bg-[#F8F7F2]">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-body text-sm font-medium text-[#292D29]/75">
                    {t("subtotal")}
                  </span>
                  <span className="font-display font-bold text-[#292D29] text-xl">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  className="w-full bg-[#34483B] hover:bg-[#28382E] active:scale-[0.98] text-[#F8F7F2] font-body text-sm font-semibold tracking-wider uppercase py-4 rounded-xl shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{t("checkout")}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
