'use client';
import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

interface StoryFeature {
  icon: string;
  title: string;
  desc: string;
}

interface StoryContent {
  title: string;
  subtitle: string;
  body: string;
  image_url: string;
  image_alt: string;
  quote: string;
  quote_author: string;
  extra_data: {
    founder_image?: string;
    founder_image_alt?: string;
    founder_title?: string;
    features?: StoryFeature[];
  };
}

const DEFAULT_STORY: StoryContent = {
  title: 'Art born from Pure Intention.',
  subtitle: 'The Perspective',
  body: 'PurelyJid started in Pune in 2023. Jidnyasa, a self-taught resin artist, began pouring her creativity into custom pieces — and never stopped. Today, every item ships directly from her studio, still made by hand.',
  image_url: 'https://img.rocket.new/generatedImages/rocket_gen_img_131e1516a-1771900598704.png',
  image_alt: 'Artisan hands carefully pouring tinted resin into a circular mold with gold leaf',
  quote: 'Every piece holds the exact moment I poured it — no two will ever be the same.',
  quote_author: 'Jidnyasa',
  extra_data: {
    founder_image: 'https://res.cloudinary.com/dgfulodch/image/upload/v1775901472/1_ew7mfp.png',
    founder_image_alt: 'Jidnyasa, founder of PurelyJid, smiling woman with warm expression',
    founder_title: 'Founder, PurelyJid',
    features: [
      { icon: 'SparklesIcon', title: 'Hand-Poured', desc: 'Every piece made in small batches — never mass produced.' },
      { icon: 'GlobeAltIcon', title: 'Eco Pigments', desc: 'Non-toxic, skin-safe resin and natural mineral pigments.' },
      { icon: 'HeartIcon', title: 'Gift Ready', desc: 'Arrives in a signature PurelyJid keepsake box.' },
      { icon: 'StarIcon', title: '5-Star Studio', desc: 'Rated 5.0 across verified purchases.' },
    ],
  },
};

export default function CraftStorySection() {
  const imgRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [story, setStory] = useState<StoryContent>(DEFAULT_STORY);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('story_content')
          .select('*')
          .eq('section_key', 'craft_story')
          .single();

        if (data) {
          setStory({
            title: data.title || DEFAULT_STORY.title,
            subtitle: data.subtitle || DEFAULT_STORY.subtitle,
            body: data.body || DEFAULT_STORY.body,
            image_url: data.image_url || DEFAULT_STORY.image_url,
            image_alt: data.image_alt || DEFAULT_STORY.image_alt,
            quote: data.quote || DEFAULT_STORY.quote,
            quote_author: data.quote_author || DEFAULT_STORY.quote_author,
            extra_data: data.extra_data || DEFAULT_STORY.extra_data,
          });
        }
      } catch {}
    };

    fetchStory();

    const supabase = createClient();
    const channel = supabase
      .channel('craft-story-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'story_content', filter: 'section_key=eq.craft_story' }, (payload) => {
        const d = payload.new as any;
        if (d) {
          setStory({
            title: d.title || DEFAULT_STORY.title,
            subtitle: d.subtitle || DEFAULT_STORY.subtitle,
            body: d.body || DEFAULT_STORY.body,
            image_url: d.image_url || DEFAULT_STORY.image_url,
            image_alt: d.image_alt || DEFAULT_STORY.image_alt,
            quote: d.quote || DEFAULT_STORY.quote,
            quote_author: d.quote_author || DEFAULT_STORY.quote_author,
            extra_data: d.extra_data || DEFAULT_STORY.extra_data,
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      const gsapModule = await import('gsap');
      const stModule = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.gsap;
      const ScrollTrigger = stModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      if (imgRef.current) {
        gsap.fromTo(imgRef.current,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.6,
            ease: 'power4.inOut',
            scrollTrigger: { trigger: imgRef.current, start: 'top 70%' }
          }
        );
      }

      if (quoteRef.current) {
        gsap.fromTo(quoteRef.current,
          { opacity: 0, x: 40, y: 20 },
          {
            opacity: 1, x: 0, y: 0, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: quoteRef.current, start: 'top 80%' }
          }
        );
      }

      gsap.utils.toArray<HTMLElement>('.story-reveal').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 1, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' }
          }
        );
      });
    };
    init();
  }, []);

  const features = story.extra_data?.features || DEFAULT_STORY.extra_data.features || [];

  return (
    <section className="py-32 md:py-48 px-6 relative overflow-hidden" id="story">
      <div className="absolute -top-4 -left-4 opacity-[0.03] font-display italic font-normal text-primary leading-none pointer-events-none select-none tracking-tighter z-0"
        style={{ fontSize: '22vw' }}>
        Story.
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left */}
          <div className="lg:col-span-7 relative">
            <div ref={imgRef} className="aspect-[16/10] rounded-sm overflow-hidden shadow-warm">
              <AppImage
                src={story.image_url}
                alt={story.image_alt}
                fill
                className="object-cover saturate-[0.7] sepia-[0.15] hover:saturate-100 hover:sepia-0 transition-all duration-1000"
              />
            </div>

            <div ref={quoteRef} className="absolute -bottom-12 md:-bottom-8 right-0 md:right-12 glass-card p-8 md:p-10 rounded-xl max-w-xs shadow-warm-lg">
              <p className="font-display italic text-xl md:text-2xl text-foreground">
                “{story.quote}”
              </p>
              <p className="text-xs font-bold mt-3">{story.quote_author}</p>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-5 lg:pl-10 pt-20 lg:pt-0 space-y-14">
            
            <div className="space-y-6 story-reveal">
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold">
                {story.subtitle}
              </p>

              <h2 className="font-display text-5xl md:text-6xl font-bold tracking-tighter text-foreground">
                {story.title}
              </h2>

              <p className="text-base text-muted-foreground leading-relaxed max-w-md">
                {story.body}
              </p>
            </div>

            {features.length > 0 && (
              <div className="grid grid-cols-2 gap-10 story-reveal">
                {features.map((item) => (
                  <div key={item.title}>
                    <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
  <Icon
    name={item.icon as Parameters<typeof Icon>[0]['name']}
    size={18}
    className="text-primary group-hover:text-white transition-colors"
  />
</div>
<h4 className="text-[11px] uppercase tracking-[0.35em] font-semibold text-foreground mt-4">
  {item.title}
</h4>

<p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-[220px]">
  {item.desc}
</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}