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

interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  profile_photo_url?: string;
  relative_time_description?: string;
}

interface PlaceData {
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: GoogleReview[];
}

const EMPTY_FORM: EnquiryForm = {
  name: '', email: '', phone: '', message: '', event_date: '', budget: ''
};

const STORAGE_KEY_API = 'gplaces_api_key';
const STORAGE_KEY_PLACE = 'gplaces_place_id';

/* ✅ STATIC PRODUCTS ONLY */
const STATIC_PRODUCTS: CustomProduct[] = [
  {
    id: '1',
    name: 'Preserved Wedding Garland - Floating Frames',
    description: 'Your wedding flowers preserved forever in stunning resin art.',
    category: 'Wedding Keepsakes',
    price_range: '₹4,500 – ₹14,000',
    images: [{ url: "https://img.rocket.new/generatedImages/rocket_gen_img_1a98163c2-1772088719640.png", alt: 'img' }],
    catalogue_url: null,
    display_order: 1
  },
  {
    id: '2',
    name: 'Preserved Wedding Garland - Compartment Frames',
    description: 'Your wedding flowers preserved forever.',
    category: 'Wedding Keepsakes',
    price_range: '₹8000 – ₹17500',
    images: [{ url: "https://img.rocket.new/generatedImages/rocket_gen_img_1b3b77d57-1772088720556.png", alt: 'img' }],
    catalogue_url: null,
    display_order: 2
  },
  {
    id: '3',
    name: 'Couple Frames',
    description: 'Custom resin frames.',
    category: 'Thin Frames',
    price_range: '₹1,399 – ₹3,699',
    images: [{ url: "https://img.rocket.new/generatedImages/rocket_gen_img_1c8ebe561-1772088171432.png", alt: 'img' }],
    catalogue_url: null,
    display_order: 3
  },
  {
    id: '4',
    name: 'Wall clock, Table Top, Square Lamp',
    description: 'Custom resin décor.',
    category: 'Personalized Gifts',
    price_range: '₹4,300 – ₹9,000',
    images: [{ url: "https://img.rocket.new/generatedImages/rocket_gen_img_1a9c7db09-1772088172690.png", alt: 'img' }],
    catalogue_url: null,
    display_order: 4
  },
  {
    id: '5',
    name: 'Table Top-Heart, Hexagon, Arch',
    description: 'Functional art.',
    category: 'Home Décor',
    price_range: '₹799 – ₹5,175',
    images: [{ url: "https://img.rocket.new/generatedImages/rocket_gen_img_13091368f-1772088172091.png", alt: 'img' }],
    catalogue_url: null,
    display_order: 5
  },
  {
    id: '6',
    name: 'Ring/Engagement Platter',
    description: 'Bulk custom platter.',
    category: 'Corporate Gifts',
    price_range: '₹4199 per piece',
    images: [{ url: "https://img.rocket.new/generatedImages/rocket_gen_img_1f0303e70-1772088718918.png", alt: 'img' }],
    catalogue_url: null,
    display_order: 6
  }
];

function StarRating({ rating, size = 14 }: {rating: number;size?: number;}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((star) => (
        <svg key={star} width={size} height={size} viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? '#C9963A' : 'none'}
          stroke={star <= Math.round(rating) ? '#C9963A' : '#D1D5DB'}>
          <path d="M11.48 3.5l2.125 5.111 5.518.442-4.204 3.602 1.285 5.385-4.725-2.885-4.725 2.885 1.285-5.385-4.204-3.602 5.518-.442z"/>
        </svg>
      ))}
    </div>
  );
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

  // ✅ STATIC LOAD
  useEffect(() => {
    setProducts(STATIC_PRODUCTS);
    setLoading(false);
  }, []);

  const openEnquiry = (product: CustomProduct) => {
    setSelectedProduct(product);
    setForm({ ...EMPTY_FORM, message: `I'm interested in a custom ${product.name}. ` });
    setShowEnquiryForm(true);
  };

  // ✅ WHATSAPP SUBMIT (FINAL)
  const submitEnquiry = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      showToast('Please fill in your name, email, and phone number.', 'error');
      return;
    }

    setSubmitting(true);

    const message = `
Hi PurelyJid! 👋

🛍 Product: ${selectedProduct?.name || 'N/A'}
💰 Price: ${selectedProduct?.price_range || 'N/A'}

👤 Name: ${form.name}
📞 Phone: ${form.phone}
📧 Email: ${form.email}

📅 Event Date: ${form.event_date || 'Not specified'}
💸 Budget: ${form.budget || 'Not specified'}

📝 Requirements:
${form.message || 'N/A'}
`;

    window.open(`https://wa.me/919518770073?text=${encodeURIComponent(message)}`, '_blank');

    showToast("Redirecting to WhatsApp...", 'success');
    setShowEnquiryForm(false);
    setForm(EMPTY_FORM);
    setSubmitting(false);
  };

  return (
    <main className="bg-[#FBF7F2] min-h-screen overflow-x-hidden">
      <Header />

      {/* 🔥 IMPORTANT:
          KEEP YOUR ORIGINAL UI SECTIONS EXACTLY HERE
          (Hero, Products Grid, Reviews, Modal etc.)
          DO NOT REMOVE THEM
      */}

      <Footer />
    </main>
  );
}