import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { PREFECTURES } from "@/lib/prefectures";
import { ARTICLE_LIST } from "@/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/datasets`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/analysis`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE.url}/updates`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE.url}/compare`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/articles`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/about`, changeFrequency: "yearly", priority: 0.3 },
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
