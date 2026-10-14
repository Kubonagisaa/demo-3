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
          {/* Overlay backdrop: Soft Black with subtle blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[95] bg-[#262321]/45 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Drawer Panel: Pure White with Warm Border */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t("bag")}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed top-0 right-0 bottom-0 z-[100] w-full max-w-md bg-white border-l border-[#E7E1DC] shadow-2xl flex flex-col opacity-100"
          >
            {/* Header: Pure White with Dusty Rose / Burgundy badge */}
            <div className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-[#E7E1DC] bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EBD9DC] text-[#8F3040] flex items-center justify-center">
                  <ShoppingBag size={17} />
                </div>
                <h2 className="font-display font-bold text-[#262321] text-base tracking-tight">
                  {t("bag")} <span className="text-[#8F3040]">({items.length})</span>
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="p-2 rounded-lg hover:bg-[#F8F5F0] text-[#736B66] hover:text-[#262321] transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free shipping progress on Chalk surface */}
            {items.length > 0 && (
              <div className="px-6 py-3.5 border-b border-[#E7E1DC] bg-[#F8F5F0]">
                {remaining > 0 ? (
                  <p className="font-body text-xs font-medium text-[#736B66]">
                    <span className="font-bold text-[#8F3040]">${remaining.toFixed(0)}</span>{" "}
                    {t("freeShipProgress")}
                  </p>
                ) : (
                  <p className="font-body text-xs text-[#8F3040] font-bold flex items-center gap-1.5">
                    <span>✓</span> {t("freeShipDone")}
                  </p>
                )}
                {/* Progress bar in Burgundy */}
                <div
                  role="progressbar"
                  aria-valuenow={Math.min(subtotal, freeShipThreshold)}
                  aria-valuemin={0}
                  aria-valuemax={freeShipThreshold}
                  aria-label={remaining > 0 ? `${remaining.toFixed(0)} ${t("freeShipProgress")}` : t("freeShipDone")}
                  className="mt-2 h-1.5 bg-[#E7E1DC] rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full bg-[#8F3040] rounded-full transition-all duration-300 ease-out ${progressWidthClass}`}
                  />
                </div>
              </div>
            )}

            {/* Product list area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-[#F8F5F0] border border-[#E7E1DC] flex items-center justify-center mb-4 text-[#736B66]">
                    <ShoppingBag size={28} />
                  </div>
                  <p className="font-display font-bold text-base text-[#262321]">{t("emptyBag")}</p>
                  <p className="font-body text-xs text-[#736B66] mt-1 max-w-xs">
                    {lang === "en"
                      ? "Explore our curated collection to add items."
                      : "探索我们精心甄选的系列以添加商品。"}
                  </p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-6 inline-flex items-center gap-1.5 font-body text-xs font-bold text-[#8F3040] hover:text-[#792534] transition-colors cursor-pointer"
                  >
                    <span>{t("continueShopping")}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3.5 p-3 rounded-xl bg-[#F8F5F0] border border-[#E7E1DC] hover:border-[#8F3040]/40 transition-colors"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative w-18 h-18 rounded-lg overflow-hidden bg-white border border-[#E7E1DC] shrink-0">
                        <Image
                          src={item.image}
                          alt={lang === "en" ? item.name : item.nameZh}
                          fill
                          className="object-cover"
                          sizes="72px"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="font-body text-xs font-bold text-[#262321] truncate">
                            {lang === "en" ? item.name : item.nameZh}
                          </h4>
                          <p className="font-body text-xs font-extrabold text-[#8F3040] mt-0.5">
                            ${item.price}
                          </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1 mt-2">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="w-6 h-6 rounded-md bg-white border border-[#E7E1DC] text-[#262321] flex items-center justify-center hover:bg-[#EBD9DC] hover:text-[#8F3040] transition-colors cursor-pointer"
                            aria-label={`Decrease quantity for ${lang === "en" ? item.name : item.nameZh}`}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-body text-xs font-bold text-[#262321] w-6 text-center">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-6 h-6 rounded-md bg-white border border-[#E7E1DC] text-[#262321] flex items-center justify-center hover:bg-[#EBD9DC] hover:text-[#8F3040] transition-colors cursor-pointer"
                            aria-label={`Increase quantity for ${lang === "en" ? item.name : item.nameZh}`}
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="ml-auto p-1 text-[#736B66] hover:text-[#8F3040] transition-colors cursor-pointer rounded"
                            aria-label={`Remove ${lang === "en" ? item.name : item.nameZh} from bag`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Burgundy CTA */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-t border-[#E7E1DC] bg-white">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="font-body text-xs font-medium text-[#736B66]">
                    {t("subtotal")}
                  </span>
                  <span className="font-display font-extrabold text-[#262321] text-lg">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  className="w-full bg-[#8F3040] hover:bg-[#792534] active:scale-[0.99] text-white font-body text-xs font-bold tracking-wider uppercase py-3.5 rounded-xl shadow-sm transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{t("checkout")}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
