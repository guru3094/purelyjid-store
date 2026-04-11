'use client';
import React, { useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const testimonials = [
{
  id: 1,
  name: 'Sumit Jadhav',
  location: 'Pune, India',
  rating: 5,
  text: "I absolutely loved the work! 🌟 The resin clock and the illuminated wedding lamp are both extremely creative and beautifully crafted. The attention to detail—right from the preserved flowers to the embedded pearls and lights—is impressive. It’s clear a lot of love and thought has gone into making these.The clock looks elegant and unique, perfect as a decor piece. And the glowing photo frame is not only visually stunning but also emotionally touching—it truly brings the memory to life! Highly recommended for anyone looking for personalized, and meaningful gifts. Excellent craftsmanship and creativity! 👏",
  avatar: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  product: 'Resin Wall Clock',
  verified: true
},
{
  id: 2,
  name: 'Caroline Joseph',
  location: 'Pune, India',
  rating: 5,
  text: "I had such a lovely experience getting the wedding garland preserved in resin. The consultation felt really easy and comforting, and explaining to us about the after care. Design discussion was so nice, they even incorporated some of the changes I needed and it was done perfectly. The final process was beautiful and elegant. Definitely recommend to get your special moments preserved. Thank you so much Purely Jid 😊😃",
  avatar: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  product: 'Compartment Resin Varmala Frame',
  verified: true
},
{
  id: 3,
  name: 'Neha Nagade',
  location: 'Pune, India',
  rating: 5,
  text: "We had our wedding garlands preserved here, and the results are stunning. She is truly the best at what she does! We are so grateful to have our wedding memories kept alive forever in such a beautiful frame. Thank you so much for this incredible keepsake.",
  avatar: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  product: 'Rectangle Frame',
  verified: true
},
{
  id: 4,
  name: 'Siddharth Kolap',
  location: 'Pune, India',
  rating: 5,
  text: "I recently got some flowers preserved here, and I’m really happy with how the final product turned out. The resin work is clean, clear, and well-finished, and the flowers have been arranged very neatly. The whole process was smooth, and they handled everything professionally and Kept me updated through every step. If you’re looking to preserve something meaningful, this place does a really good job",
  avatar: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  product: 'Square Frame',
  verified: true
}
];

export default function TestimonialsSection() {

  useEffect(() => {
    const init = async () => {
      const gsapModule = await import('gsap');
      const stModule = await import('gsap/ScrollTrigger');
      const gsap = gsapModule?.gsap;
      const ScrollTrigger = stModule?.ScrollTrigger;
      gsap?.registerPlugin(ScrollTrigger);

      gsap?.utils?.toArray<HTMLElement>('.testimonial-card')?.forEach((card, i) => {
        gsap?.fromTo(card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%' }
        });
      });

      gsap?.fromTo('.testi-header',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.testi-header', start: 'top 88%' }
      });
    };
    init();
  }, []);

  return (
    <section className="py-28 px-6 bg-[#FAF6F0]">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="testi-header text-center mb-16 space-y-4" style={{ opacity: 0 }}>
          <p className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold">
            What They Say
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-bold tracking-tighter text-foreground">
            Real People, <span className="italic font-normal text-muted-foreground">Real Joy.</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials?.map((t) => (
            <div
              key={t?.id}
              className="testimonial-card p-8 bg-white rounded-2xl border border-[rgba(196,120,90,0.1)] shadow-card hover:shadow-warm transition-all duration-500 space-y-6"
              style={{ opacity: 0 }}
            >
              
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t?.rating })?.map((_, i) => (
                  <span key={i} className="star-filled text-base">★</span>
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                "{t?.text}"
              </p>

              {/* Product */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[9px] uppercase tracking-[0.3em] text-primary font-bold">
                  Purchased:
                </span>
                <span className="text-[9px] text-muted-foreground">
                  {t?.product}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-[rgba(196,120,90,0.1)]">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <AppImage src={t?.avatar} alt={t?.name} width={40} height={40} className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">{t?.name}</p>
                    {t?.verified && (
                      <Icon name="CheckBadgeIcon" size={14} className="text-primary" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{t?.location}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}