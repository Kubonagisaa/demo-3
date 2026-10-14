"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import type { Language } from "@/app/lib/i18n";

interface Article {
  id: string;
  categoryEn: string;
  categoryZh: string;
  readTime: string;
  titleEn: string;
  titleZh: string;
  excerptEn: string;
  excerptZh: string;
  image: string;
  date: string;
}

const articles: Article[] = [
  {
    id: "j1",
    categoryEn: "Living & Spaces",
    categoryZh: "居家与空间",
    readTime: "4 min read",
    titleEn: "The Architecture of Morning Rituals",
    titleZh: "晨间仪式的空间美学",
    excerptEn:
      "How hand-thrown stoneware ceramics and intentional lighting shape the emotional tone of our day before the world wakes.",
    excerptZh:
      "探讨手工粗陶器物与温润照明如何在我们开启新的一天之前，静静构筑内心的平静与专注。",
    image: "/product-ceramic-set.jpg",
    date: "October 2026",
  },
  {
    id: "j2",
    categoryEn: "Craft & Materials",
    categoryZh: "工艺与材质",
    readTime: "6 min read",
    titleEn: "Natural Fibers & Slow Tailoring",
    titleZh: "天然纤维与慢时尚工艺",
    excerptEn:
      "A deep dive into extrafine Merino sheep farms and how regenerative fiber production respects both the artisan and the earth.",
    excerptZh:
      "深入探索超细美利奴羊毛的再生生产旅程，展现对手工艺人与自然生态的双重敬意。",
    image: "/product-merino-tee.jpg",
    date: "September 2026",
  },
  {
    id: "j3",
    categoryEn: "Focus & Tools",
    categoryZh: "专注与工具",
    readTime: "5 min read",
    titleEn: "Designed for Stillness: The Workspace",
    titleZh: "为静心而设：极简工作空间",
    excerptEn:
      "Removing visual noise from the modern desk with solid brass balances, tactile felt, and thoughtful device ergonomics.",
    excerptZh:
      "通过实心黄铜配重、细腻毛毡桌垫与克制的理线设计，拂去工作台上的所有视觉喧嚣。",
    image: "/hero-concept-store.jpg",
    date: "August 2026",
  },
];

export function HavenJournal({ lang }: { lang: Language }) {
  return (
    <section className="bg-[#E8E5DA]/40 border-t border-[#D8D4C7]/60 py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2.5 mb-2"
            >
              <span className="w-5 h-[1.5px] bg-[#7D927C] rounded-full inline-block" />
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-[#7D927C] font-semibold">
                {lang === "en" ? "Editorial & Craft Stories" : "生活志 & 工艺故事"}
              </p>
            </motion.div>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%", opacity: 0 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-bold text-[#292D29] text-3xl md:text-[2.75rem] tracking-[-0.03em]"
              >
                {lang === "en" ? "The Haven Journal" : "Haven 生活志"}
              </motion.h2>
            </div>
          </div>

          <p className="font-body text-xs text-[#292D29]/65 max-w-sm leading-relaxed">
            {lang === "en"
              ? "Reflections on mindful living, artisan workshops, and the philosophy behind single-vendor design."
              : "关于克制生活美学、工匠工坊以及独家甄选理念的深度思考与生活随笔。"}
          </p>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <motion.article
              key={article.id}
              tabIndex={0}
              role="article"
              aria-label={lang === "en" ? article.titleEn : article.titleZh}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 350, damping: 25, delay: idx * 0.1 }}
              className="group flex flex-col rounded-3xl bg-[#F8F7F2] border border-[#D8D4C7]/60 overflow-hidden shadow-xs hover:shadow-md focus-visible:outline-2 focus-visible:outline-[#34483B] focus-visible:outline-offset-4 transition-all duration-300 cursor-pointer"
            >
              {/* Photo Frame */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#E8E5DA]">
                <Image
                  src={article.image}
                  alt={lang === "en" ? article.titleEn : article.titleZh}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-[#292D29]/80 backdrop-blur-xs text-[#F8F7F2] font-body text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {lang === "en" ? article.categoryEn : article.categoryZh}
                  </span>
                </div>
              </div>

              {/* Text Body */}
              <div className="p-6 md:p-7 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-[#7D927C] font-semibold uppercase tracking-wider mb-2.5">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      <span>{article.readTime}</span>
                    </span>
                    <span>·</span>
                    <span>{article.date}</span>
                  </div>

                  <h3 className="font-display font-semibold text-lg text-[#292D29] group-hover:text-[#34483B] tracking-tight mb-2.5 transition-colors line-clamp-2">
                    {lang === "en" ? article.titleEn : article.titleZh}
                  </h3>

                  <p className="font-body text-xs text-[#292D29]/70 leading-relaxed line-clamp-3 mb-6">
                    {lang === "en" ? article.excerptEn : article.excerptZh}
                  </p>
                </div>

                {/* Read story footer link */}
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#34483B] group-hover:text-[#28382E] transition-colors pt-4 border-t border-[#D8D4C7]/40">
                  <BookOpen size={13} />
                  <span>{lang === "en" ? "Read Story" : "阅读专栏"}</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
