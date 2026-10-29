import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { PREFECTURES } from "@/lib/prefectures";
import { ARTICLE_LIST } from "@/articles";
import { TOPICS } from "@/lib/topics";
import { GLOSSARY } from "@/lib/glossary";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/datasets`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/analysis`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE.url}/guide`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/methodology`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/feature/population`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/feature/tourism-culture`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/updates`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE.url}/compare`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/articles`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/editorial-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/topics`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE.url}/sitemap`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE.url}/resources`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/glossary`, changeFrequency: "monthly", priority: 0.6 },
    ...GLOSSARY.filter((g) => g.page).map((g) => ({ url: `${SITE.url}/glossary/${g.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
    { url: `${SITE.url}/consulting`, changeFrequency: "monthly", priority: 0.4 },
    ...TOPICS.map((t) => ({ url: `${SITE.url}/topics/${t.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
    { url: `${SITE.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/contact`, changeFrequency: "yearly", priority: 0.2 }
  ];

  // ダッシュボード・ランキングページはnoindex中のため、サイトマップにも含めない
  // （インデックスさせないページをsitemapに載せるのは矛盾したシグナルになるため）

  const prefecturePages: MetadataRoute.Sitemap = PREFECTURES.map((p) => ({
    url: `${SITE.url}/prefecture/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.6
  }));

  const articlePages: MetadataRoute.Sitemap = ARTICLE_LIST.filter((a) => !a.noindex).map((a) => ({
    url: `${SITE.url}/articles/${a.slug}`,
    changeFrequency: "yearly",
    priority: 0.5
  }));

  return [...staticPages, ...prefecturePages, ...articlePages];
}
