import HeroBanner from "@/components/Herobanner";
import ProductGrid from "@/components/ProductGrid";
import TrustSection from "@/components/TrustSection";
import ContactSection from "@/components/ContactSection";
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="">
      <main className="">
        <HeroBanner />
        <ProductGrid />
        <TrustSection />
        <ContactSection />
      </main>
    </div>
  );
}
