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
} from "@/lib/site";

export default async function HomePage() {
  const [cfg, why, services, works, testimonials] = await Promise.all([
    getSiteConfig(),
    getWhyChooseUs(),
    getServices(),
    getFeaturedProducts(6),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero headline={cfg.heroHeadline} subtext={cfg.heroSubtext} />
      <WhyChooseUs items={why} />
      <ServicesTiles services={services} />
      <WorksGallery products={works} />
      <Testimonials items={testimonials} />
      <LeadBand />
    </>
  );
}
