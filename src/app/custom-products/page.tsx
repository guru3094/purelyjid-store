'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import { useToast } from '@/contexts/ToastContext';

export const dynamic = 'force-dynamic';

interface CustomProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price_range: string;
  images: {url: string;alt: string;}[];
  catalogue_url: string | null;
  display_order: number;
}

interface EnquiryForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  event_date: string;
  budget: string;
}



const EMPTY_FORM: EnquiryForm = {
  name: '', email: '', phone: '', message: '', event_date: '', budget: ''
};


// Static fallback — only used if Supabase is unreachable
const STATIC_PRODUCTS: CustomProduct[] = [
{
  id: '1',
  name: 'Preserved Wedding Garland - Floating Frames',
  description: 'Your wedding flowers preserved forever in stunning resin art. Each piece is unique, capturing the exact blooms from your special day in a timeless keepsake.',
  category: 'Wedding Keepsakes',
  price_range: '₹4,500 – ₹14,000',
  images: [
  { url: "https://img.rocket.new/generatedImages/rocket_gen_img_1a98163c2-1772088719640.png", alt: 'Preserved wedding flowers encased in clear resin art frame with gold accents' }],

  catalogue_url: null,
  display_order: 1
},
{
  id: '2',
  name: 'Preserved Wedding Garland - Compartment Frames',
  description: 'Your wedding flowers preserved forever in stunning resin art. Each piece is unique, capturing the exact blooms from your special day in a timeless keepsake.',
  category: 'Wedding Keepsakes',
  price_range: '₹8000 – ₹17500',
  images: [
  { url: "https://img.rocket.new/generatedImages/rocket_gen_img_1b3b77d57-1772088720556.png", alt: 'Elegant resin serving tray with embedded dried flowers and gold leaf accents' }],

  catalogue_url: null,
  display_order: 2
},
{
  id: '3',
  name: 'Couple Frames',
  description: 'Your wedding flowers preserved forever in stunning resin art. Each piece is unique, capturing the exact blooms from your special day in a timeless keepsake.',
  category: 'Thin Frames',
  price_range: '₹1,399 – ₹3,699',
  images: [
  { url: "https://img.rocket.new/generatedImages/rocket_gen_img_1c8ebe561-1772088171432.png", alt: 'Delicate resin pendant necklace with tiny preserved pink flowers inside' }],

  catalogue_url: null,
  display_order: 3
},
{
  id: '4',
  name: 'Wall clock, Table Top, Square Lamp',
  description: 'Custom resin wall Clock, Table Top & Square Lamp. Choose your colors, fonts, and embedded elements.',
  category: 'Personalized Gifts',
  price_range: '₹4,300 – ₹9,000',
  images: [
  { url: "https://img.rocket.new/generatedImages/rocket_gen_img_1a9c7db09-1772088172690.png", alt: 'Custom resin name sign with pastel colors and floral decorations for a nursery' }],

  catalogue_url: null,
  display_order: 4
},
{
  id: '5',
  name: 'Table Top-Heart, Hexagon, Arch, Candle Holder',
  description: 'Functional art for your home',
  category: 'Home Décor',
  price_range: '₹799 – ₹5,175',
  images: [
  { url: "https://img.rocket.new/generatedImages/rocket_gen_img_13091368f-1772088172091.png", alt: 'Handmade resin wall clock with blue and gold geode-style pour and Roman numerals' }],

  catalogue_url: null,
  display_order: 5
},
{
  id: '6',
  name: 'Ring/Engagement Platter',
  description: 'Bulk custom resin Engagement Platter',
  category: 'Corporate Gifts',
  price_range: '₹4199 per piece',
  images: [
  { url: "https://img.rocket.new/generatedImages/rocket_gen_img_1f0303e70-1772088718918.png", alt: 'Set of elegant resin paperweights and coasters in matching corporate color scheme' }],

  catalogue_url: null,
  display_order: 6
}];


function StarRating({ rating, size = 14 }: {rating: number;size?: number;}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) =>
      <svg
        key={star}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={star <= Math.round(rating) ? '#C9963A' : 'none'}
        stroke={star <= Math.round(rating) ? '#C9963A' : '#D1D5DB'}
        strokeWidth="1.5">
        
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      )}
    </div>);

}

export default function CustomProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<CustomProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<CustomProduct | null>(null);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [form, setForm] = useState<EnquiryForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [activeImage, setActiveImage] = useState<Record<string, number>>({});

  
  const openEnquiry = (product: CustomProduct) => {
    setSelectedProduct(product);
    setForm({ ...EMPTY_FORM, message: I'm interested in a custom ${product.name}.  });
    setShowEnquiryForm(true);
  };

      showToast("Enquiry submitted! We'll get back to you within 24 hours.", 'success');
      setShowEnquiryForm(false);
      setForm(EMPTY_FORM);
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppLink = (product: CustomProduct) => {
    const msg = encodeURIComponent(
      Hi PurelyJid! 👋 I'm interested in a custom *${product.name}* (${product.price_range}). Could you share more details and availability? 🌸
    );
    return https://wa.me/919518770073?text=${msg};
  };

  return (
    <main className="bg-[#FBF7F2] min-h-screen overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Icon name="SparklesIcon" size={14} className="text-primary" />
            <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-primary">Custom Creations</span>
          </div>
          <h1 className="font-display italic text-5xl md:text-6xl font-semibold text-foreground mb-4">
            Personalized for You
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            From preserved wedding garlands to custom resin art — every piece is made to order, just for you. Browse our catalogue and reach out to begin your custom journey.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <a
              href="https://wa.me/919518770073?text=Hi%20PurelyJid!%20I%27d%20like%20to%20enquire%20about%20a%20custom%20product."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-green-500 text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-green-600 transition-colors">
              
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
            <a
              href="tel:+919518770073"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-[rgba(184,92,56,0.3)] text-foreground text-xs font-semibold uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-colors">
              
              <Icon name="PhoneIcon" size={14} />
              Call to Discuss
            </a>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-24 px-6">
        <div className="mx-auto max-w-6xl">
          {loading ?
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) =>
            <div key={i} className="bg-white rounded-3xl border border-[rgba(184,92,56,0.12)] overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-100" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-5/6" />
                  </div>
                </div>
            )}
            </div> :

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
              const imgIdx = activeImage[product.id] || 0;
              const images = product.images || [];
              const currentImg = images[imgIdx];
              return (
                <div key={product.id} className="bg-white rounded-3xl border border-[rgba(184,92,56,0.12)] overflow-hidden hover:shadow-card transition-shadow group">
                    {/* Image */}
                    <div className="relative h-64 bg-gradient-to-br from-[#FBF7F2] to-[#EDE4D8] overflow-hidden">
                      {currentImg ?
                    <img
                      src={currentImg.url}
                      alt={currentImg.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> :


                    <div className="w-full h-full flex items-center justify-center">
                          <Icon name="SparklesIcon" size={40} className="text-primary/30" />
                        </div>
                    }
                      {images.length > 1 &&
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {images.map((_, i) =>
                      <button
                        key={i}
                        onClick={() => setActiveImage((prev) => ({ ...prev, [product.id]: i }))}
                        className={w-1.5 h-1.5 rounded-full transition-colors ${i === imgIdx ? 'bg-white' : 'bg-white/50'}} />

                      )}
                        </div>
                    }
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-[0.15em] text-primary px-3 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-display italic text-xl font-semibold text-foreground mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">{product.description}</p>
                      {product.price_range &&
                    <div className="flex items-center gap-2 mb-4">
                          <Icon name="CurrencyRupeeIcon" size={14} className="text-primary" />
                          <span className="text-sm font-bold text-foreground">{product.price_range}</span>
                          <span className="text-xs text-muted-foreground">(custom pricing)</span>
                        </div>
                    }

                      {/* Actions */}
                      <div className="space-y-2">
                        <button
                        onClick={() => openEnquiry(product)}
                        className="w-full h-10 rounded-full bg-foreground text-[#FBF7F2] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-primary transition-colors flex items-center justify-center gap-2">
                        
                          <Icon name="EnvelopeIcon" size={13} />
                          Send Enquiry
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <a
                          href={getWhatsAppLink(product)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 h-9 rounded-full bg-green-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-green-600 transition-colors">
                          
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp
                          </a>
                          <a
                          href="tel:+919518770073"
                          className="flex-1 h-9 rounded-full border border-[rgba(184,92,56,0.2)] text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 hover:border-primary hover:text-primary transition-colors">
                          
                            <Icon name="PhoneIcon" size={13} />
                            Call
                          </a>
                        </div>
                        {product.catalogue_url &&
                      <a
                        href={product.catalogue_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-9 rounded-full border border-[rgba(184,92,56,0.2)] text-muted-foreground text-xs font-semibold flex items-center justify-center gap-1.5 hover:border-primary hover:text-primary transition-colors">
                        
                            <Icon name="DocumentArrowDownIcon" size={13} />
                            Download Catalogue
                          </a>
                      }
                      </div>
                    </div>
                  </div>);

            })}
            </div>
          }

          {/* Process Section */}
          <div className="mt-20">
            <h2 className="font-display italic text-3xl font-semibold text-foreground text-center mb-10">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
              { step: '01', title: 'Browse & Choose', desc: 'Explore our catalogue and pick the type of custom piece you want.', icon: 'MagnifyingGlassIcon' },
              { step: '02', title: 'Send Enquiry', desc: 'Fill in the form or WhatsApp us with your requirements and event details.', icon: 'ChatBubbleLeftRightIcon' },
              { step: '03', title: 'Get a Quote', desc: "We'll send you a personalized quote within 24 hours.", icon: 'DocumentTextIcon' },
              { step: '04', title: 'Receive Your Art', desc: 'Your custom piece is handcrafted and delivered to your door.', icon: 'GiftIcon' }].
              map((item) =>
              <div key={item.step} className="bg-white rounded-2xl border border-[rgba(184,92,56,0.12)] p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon name={item.icon} size={20} className="text-primary" />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2">{item.step}</div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      
      {/* Enquiry Modal */}
      {showEnquiryForm &&
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={(e) => {if (e.target === e.currentTarget) setShowEnquiryForm(false);}}>
        
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-5 border-b border-[rgba(184,92,56,0.12)] flex items-center justify-between rounded-t-3xl z-10">
              <div>
                <h3 className="font-display italic text-xl font-semibold text-foreground">Custom Enquiry</h3>
                {selectedProduct &&
              <p className="text-xs text-muted-foreground mt-0.5">{selectedProduct.name}</p>
              }
              </div>
              <button onClick={() => setShowEnquiryForm(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#FBF7F2] transition-colors">
                <Icon name="XMarkIcon" size={18} className="text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Your Name *</label>
                  <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full h-10 px-4 rounded-xl border border-[rgba(184,92,56,0.2)] bg-[#FBF7F2] text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="Priya Sharma" />
                
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Phone *</label>
                  <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full h-10 px-4 rounded-xl border border-[rgba(184,92,56,0.2)] bg-[#FBF7F2] text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="+91 98765 43210" />
                
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Email *</label>
                <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full h-10 px-4 rounded-xl border border-[rgba(184,92,56,0.2)] bg-[#FBF7F2] text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                placeholder="priya@example.com" />
              
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Event Date</label>
                  <input
                  type="date"
                  value={form.event_date}
                  onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
                  className="w-full h-10 px-4 rounded-xl border border-[rgba(184,92,56,0.2)] bg-[#FBF7F2] text-sm text-foreground focus:outline-none focus:border-primary transition-colors" />
                
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Budget Range</label>
                  <select
                  value={form.budget}
                  onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                  className="w-full h-10 px-4 rounded-xl border border-[rgba(184,92,56,0.2)] bg-[#FBF7F2] text-sm text-foreground focus:outline-none focus:border-primary transition-colors">
                  
                    <option value="">Select budget</option>
                    <option value="Under ₹2,000">Under ₹2,000</option>
                    <option value="₹2,000 – ₹5,000">₹2,000 – ₹5,000</option>
                    <option value="₹5,000 – ₹10,000">₹5,000 – ₹10,000</option>
                    <option value="₹10,000+">₹10,000+</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Your Requirements</label>
                <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-[rgba(184,92,56,0.2)] bg-[#FBF7F2] text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Describe what you're looking for — size, colors, occasion, any special requests…" />
              
              </div>

              <div className="bg-[#FBF7F2] rounded-2xl p-4">
                <p className="text-xs font-semibold text-foreground mb-3">Or reach us directly:</p>
                <div className="flex gap-2">
                  <a
                  href={selectedProduct ? getWhatsAppLink(selectedProduct) : 'https://wa.me/919518770073'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-9 rounded-full bg-green-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-green-600 transition-colors">
                  
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                  <a
                  href="tel:+919518770073"
                  className="flex-1 h-9 rounded-full border border-[rgba(184,92,56,0.2)] text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 hover:border-primary hover:text-primary transition-colors">
                  
                    <Icon name="PhoneIcon" size={13} />
                    Call Us
                  </a>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-[rgba(184,92,56,0.12)] flex items-center justify-end gap-3 rounded-b-3xl">
              <button
              onClick={() => setShowEnquiryForm(false)}
              className="h-10 px-6 rounded-full border border-[rgba(184,92,56,0.2)] text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              
                Cancel
              </button>
              <button
              onClick={submitEnquiry}
              disabled={submitting}
              className="h-10 px-6 rounded-full bg-foreground text-[#FBF7F2] text-xs font-semibold uppercase tracking-[0.15em] hover:bg-primary transition-colors disabled:opacity-50 flex items-center gap-2">
              
                {submitting ?
              <><div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />Sending…</> :

              <><Icon name="PaperAirplaneIcon" size={14} />Send Enquiry</>
              }
              </button>
            </div>
          </div>
        </div>
      }

      <Footer />
    </main>);

}
