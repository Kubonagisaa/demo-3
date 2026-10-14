"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Package,
  Heart,
  MapPin,
  HelpCircle,
  LogIn,
  LogOut,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import type { Language } from "@/app/lib/i18n";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export function ProfileDrawer({ isOpen, onClose, lang }: ProfileDrawerProps) {
  const [isSignedIn, setIsSignedIn] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[95] bg-[#292D29]/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer Panel: Warm White (#F8F7F2) with Linen (#E8E5DA) left border, z-[100] */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Account Profile"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-0 right-0 bottom-0 z-[100] w-full max-w-md bg-[#F8F7F2] border-l border-[#E8E5DA] shadow-2xl flex flex-col opacity-100"
          >
            {/* Header: Isolated h-20 with fixed padding */}
            <div className="h-20 flex-shrink-0 flex items-center justify-between px-6 border-b border-[#E8E5DA] bg-[#F8F7F2]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E8E5DA] flex items-center justify-center text-[#34483B]">
                  <User size={16} />
                </div>
                <h2 className="font-display font-semibold text-[#292D29] text-lg tracking-[-0.02em]">
                  {lang === "en" ? "Member Profile" : "会员中心"}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-full hover:bg-[#E8E5DA] text-[#292D29] transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Close profile"
              >
                <X size={20} className="stroke-[2]" />
              </button>
            </div>

            {/* Profile Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#F8F7F2] flex flex-col gap-6">
              {/* Member Card */}
              {isSignedIn ? (
                <div className="p-5 rounded-3xl bg-[#E8E5DA] border border-[#D8D4C7]/70 shadow-xs">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar Monogram */}
                      <div className="w-13 h-13 rounded-2xl bg-[#34483B] text-[#F8F7F2] font-display font-bold text-lg flex items-center justify-center shadow-xs">
                        K
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-[#292D29] tracking-tight">
                          Kiệt Studio
                        </h3>
                        <p className="font-body text-xs text-[#292D29]/70">kiet.studio@haven.luxury</p>
                      </div>
                    </div>

                    <span className="bg-[#7D927C] text-[#F8F7F2] font-body text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
                      Studio Tier
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3.5 border-t border-[#D8D4C7]/60 text-xs">
                    <span className="font-body text-[#292D29]/75 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-[#7D927C]" />
                      <span>{lang === "en" ? "Complimentary Global Express" : "尊享全球极速直邮"}</span>
                    </span>
                    <span className="font-display font-bold text-[#34483B]">VIP 2026</span>
                  </div>
                </div>
              ) : (
                /* Guest welcome box */
                <div className="p-5 rounded-3xl bg-[#E8E5DA] border border-[#D8D4C7]/70 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#F8F7F2] text-[#34483B] flex items-center justify-center mx-auto mb-3 shadow-xs">
                    <User size={20} />
                  </div>
                  <h3 className="font-display font-bold text-base text-[#292D29] mb-1">
                    {lang === "en" ? "Join Haven Concierge" : "加入 Haven 尊享会员"}
                  </h3>
                  <p className="font-body text-xs text-[#292D29]/70 mb-4 max-w-xs mx-auto leading-relaxed">
                    {lang === "en"
                      ? "Track your orders, save curated wishlist items, and unlock complimentary white-glove delivery."
                      : "随时追踪订单进度、保存精选心愿单，尊享专属礼宾服务与免费配送。"}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSignedIn(true)}
                    className="w-full bg-[#34483B] hover:bg-[#28382E] text-[#F8F7F2] font-body text-xs font-semibold tracking-wider uppercase py-3 rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                  >
                    <LogIn size={14} />
                    <span>{lang === "en" ? "Sign In / Register" : "登录 / 注册新账户"}</span>
                  </button>
                </div>
              )}

              {/* Navigation Options Group */}
              <div className="flex flex-col gap-2">
                <p className="font-body text-[11px] font-semibold tracking-[0.2em] uppercase text-[#7D927C] px-1 mb-1">
                  {lang === "en" ? "Quick Management" : "快捷服务"}
                </p>

                {/* Orders */}
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#E8E5DA]/50 hover:bg-[#E8E5DA] border border-[#D8D4C7]/50 transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#F8F7F2] text-[#34483B] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <Package size={17} />
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-[#292D29]">
                        {lang === "en" ? "Orders & Tracking" : "订单历史与物流"}
                      </p>
                      <p className="font-body text-[11px] text-[#7D927C] flex items-center gap-1 mt-0.5 font-medium">
                        <CheckCircle2 size={11} />
                        <span>{lang === "en" ? "1 active shipment (HV-8842)" : "1个进行中的包裹 (HV-8842)"}</span>
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#292D29]/50 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Saved Essentials */}
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#E8E5DA]/50 hover:bg-[#E8E5DA] border border-[#D8D4C7]/50 transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#F8F7F2] text-[#34483B] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <Heart size={17} />
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-[#292D29]">
                        {lang === "en" ? "Curated Wishlist" : "收藏心愿单"}
                      </p>
                      <p className="font-body text-[11px] text-[#292D29]/60 mt-0.5">
                        {lang === "en" ? "4 saved items" : "4件心仪商品"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#292D29]/50 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Shipping Addresses */}
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#E8E5DA]/50 hover:bg-[#E8E5DA] border border-[#D8D4C7]/50 transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#F8F7F2] text-[#34483B] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <MapPin size={17} />
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-[#292D29]">
                        {lang === "en" ? "Delivery Addresses" : "配送地址簿"}
                      </p>
                      <p className="font-body text-[11px] text-[#292D29]/60 mt-0.5">
                        {lang === "en" ? "Default: Ho Chi Minh City" : "默认：胡志明市"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#292D29]/50 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* 24/7 Concierge */}
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#E8E5DA]/50 hover:bg-[#E8E5DA] border border-[#D8D4C7]/50 transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#F8F7F2] text-[#34483B] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <HelpCircle size={17} />
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-[#292D29]">
                        {lang === "en" ? "Haven Concierge Care" : "专属礼宾在线客服"}
                      </p>
                      <p className="font-body text-[11px] text-[#292D29]/60 mt-0.5">
                        {lang === "en" ? "24/7 Priority Assistance" : "24/7 全天候优先响应"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#292D29]/50 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Toggle Sign in / Sign out mock action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignedIn(!isSignedIn)}
                  className="w-full py-3 px-4 rounded-xl border border-[#D8D4C7] bg-[#E8E5DA]/30 hover:bg-[#E8E5DA] text-[#292D29] font-body text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSignedIn ? (
                    <>
                      <LogOut size={14} />
                      <span>{lang === "en" ? "Sign Out (Switch to Guest)" : "退出登录 (切换为访客)"}</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={14} />
                      <span>{lang === "en" ? "Sign In as Kiệt Studio" : "以 Kiệt Studio 身份登录"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#E8E5DA] bg-[#F8F7F2] flex items-center justify-between text-xs text-[#292D29]/60">
              <span>{lang === "en" ? "Region: Global · USD ($)" : "结算地区：全球 · 美元 ($)"}</span>
              <span className="font-semibold text-[#34483B]">Haven Concierge</span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
