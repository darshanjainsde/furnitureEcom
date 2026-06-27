import { Hero } from "@/components/home/Hero";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ServicesTiles } from "@/components/home/ServicesTiles";
import { WorksGallery } from "@/components/home/WorksGallery";
import { Testimonials } from "@/components/home/Testimonials";
import { LeadBand } from "@/components/home/LeadBand";
import {
  getSiteConfig,
  getWhyChooseUs,
  getServices,
  getFeaturedProducts,
  getTestimonials,
  getTopCategories,
} from "@/lib/site";
import { parseImages } from "@/lib/utils";

export default async function HomePage() {
  const [cfg, why, services, works, testimonials, cats] = await Promise.all([
    getSiteConfig(),
    getWhyChooseUs(),
    getServices(),
    getFeaturedProducts(6),
    getTestimonials(),
    getTopCategories(),
  ]);

  // Hero collage: owner-set hero images first, else the category images the
  // owner uploaded, else branded placeholders (handled inside <Hero/>).
  const configured = parseImages(cfg.heroImages);
  const heroImages =
    configured.length > 0
      ? configured
      : cats.map((c) => c.imageUrl).filter((u): u is string => !!u).slice(0, 3);

  return (
    <>
      <Hero headline={cfg.heroHeadline} subtext={cfg.heroSubtext} images={heroImages} />
      <WhyChooseUs items={why} />
      <ServicesTiles services={services} />
      <WorksGallery products={works} />
      <Testimonials items={testimonials} />
      <LeadBand />
    </>
  );
}
