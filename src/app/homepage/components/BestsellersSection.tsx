'use client';
import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

interface BestsellerProduct {
  id: string | number;
  name: string;
  category: string;
  price: string;
  originalPrice: string | null;
  rating: number;
  reviews: number;
  badge: string | null;
  badgeColor: string;
  image: string;
  alt: string;
  slug: string;
}

const STATIC_BESTSELLERS: BestsellerProduct[] = [
  {
    id: 1, name: 'Aurora Resin Pendant', category: 'Jewelry', price: '₹38', originalPrice: '₹48',
    rating: 4.9, reviews: 214, badge: 'Bestseller', badgeColor: 'bg-primary',
    image: "https://images.unsplash.com/photo-1676157211877-760c3d400217",
    alt: 'Aurora-colored resin pendant with purple and teal swirls on silver chain',
    slug: 'aurora-resin-pendant'
  },
  {
    id: 2, name: 'Galaxy Geode Tray', category: 'Home Décor', price: '₹64', originalPrice: null,
    rating: 5.0, reviews: 89, badge: 'New', badgeColor: 'bg-secondary',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1545b4ef2-1771900598709.png",
    alt: 'Oval resin serving tray with deep blue and gold galaxy pattern',
    slug: 'galaxy-geode-tray'
  },
  {
    id: 3, name: 'Floral Resin Earrings', category: 'Jewelry', price: '₹24', originalPrice: null,
    rating: 4.8, reviews: 341, badge: 'Popular', badgeColor: 'bg-accent-gold',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1bb068302-1772088252319.png",
    alt: 'Translucent resin earrings with real dried flower inclusions in teardrop shape',
    slug: 'floral-resin-earrings'
  },
  {
    id: 4, name: 'Complete Starter Kit', category: 'DIY Supplies', price: '₹52', originalPrice: '₹68',
    rating: 4.9, reviews: 156, badge: 'Gift Idea', badgeColor: 'bg-primary',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_130a82f81-1772220075768.png",
    alt: 'Resin art starter kit with clear resin bottles, silicone molds, and color pigments',
    slug: 'complete-starter-kit'
  },
  {
    id: 5, name: 'Ocean Wave Coaster', category: 'Home Décor', price: '₹42', originalPrice: null,
    rating: 5.0, reviews: 72, badge: 'New', badgeColor: 'bg-secondary',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1545b4ef2-1771900598709.png",
    alt: 'Round resin coaster with ocean wave pattern in blues and white on marble',
    slug: 'ocean-wave-coaster'
  }
];

export default function BestsellersSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [bestsellers, setBestsellers] = useState<BestsellerProduct[]>([]);

  // ✅ WhatsApp Redirect Function
  const redirectToWhatsApp = (productName: string) => {
    const phone = "919518770073"; // your number
    const message = `Hi PurelyJid, I'm interested in "${productName}". Can you share more details?`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    async function fetchBestsellers() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select('id, name, slug, price, original_price, badge, badge_color, image_url, alt_text, is_active, is_featured, categories(name)')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(8);

        if (error && !data) {
          setBestsellers(STATIC_BESTSELLERS);
          return;
        }

        if (!data || data.length === 0) {
          setBestsellers([]);
          return;
        }

        const mapped: BestsellerProduct[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug || p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          category: p.categories?.name || 'Uncategorized',
          price: `₹${Math.round((p.price || 0) / 100)}`,
          originalPrice: p.original_price ? `₹${Math.round(p.original_price / 100)}` : null,
          rating: 4.8,
          reviews: 0,
          badge: p.badge || null,
          badgeColor: p.badge_color || 'bg-primary',
          image: p.image_url || 'https://images.unsplash.com/photo-1676157211877-760c3d400217',
          alt: p.alt_text || p.name,
        }));

        setBestsellers(mapped);
      } catch {
        setBestsellers(STATIC_BESTSELLERS);
      }
    }

    fetchBestsellers();

    const supabase = createClient();
    const channel = supabase
      .channel('bestsellers-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchBestsellers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="bg-[#F2EBE1]" id="bestsellers">
      <div className="pt-24 pb-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold">Most Loved</p>
            <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-none">
              Bestsellers <span className="italic text-muted-foreground">Archives.</span>
            </h2>
          </div>
        </div>
      </div>

      <div className="px-6 pb-24">
        <div ref={trackRef} className="flex gap-8 overflow-x-auto">

          {bestsellers.map((product, index) => (
            <div
              key={product.id}
              onClick={() => redirectToWhatsApp(product.name)}
              className={`w-[280px] md:w-[360px] cursor-pointer shrink-0 ${index % 2 === 1 ? 'mt-16' : ''}`}
            >
              <div className="space-y-5">

                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-white shadow-card">
                  <AppImage
                    src={product.image}
                    alt={product.alt}
                    fill
                    className="object-cover"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-[9px] text-white ${product.badgeColor}`}>
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Quick Add */}
                  <div className="absolute inset-0 flex items-end justify-center pb-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        redirectToWhatsApp(product.name);
                      }}
                      className="px-6 py-3 rounded-full bg-white text-xs font-bold"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-primary font-bold">{product.price}</p>
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
