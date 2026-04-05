'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import { useToast } from '@/contexts/ToastContext';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

interface CustomProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price_range: string;
  images: { url: string; alt: string }[];
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
  name: '',
  email: '',
  phone: '',
  message: '',
  event_date: '',
  budget: ''
};

const STORAGE_KEY_API = 'gplaces_api_key';
const STORAGE_KEY_PLACE = 'gplaces_place_id';

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? '#C9963A' : 'none'}
          stroke={star <= Math.round(rating) ? '#C9963A' : '#D1D5DB'}
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
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

  const [savedApiKey, setSavedApiKey] = useState('');
  const [savedPlaceId, setSavedPlaceId] = useState('');
  const [placeData, setPlaceData] = useState<PlaceData | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('custom_products')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error || !data || data.length === 0) {
          setProducts([]);
        } else {
          setProducts(data);
        }
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const fetchReviews = useCallback(async (key: string, pid: string) => {
    if (!key || !pid) return;

    setReviewsLoading(true);
    setReviewsError('');

    try {
      const res = await fetch(
        `/api/google-places?apiKey=${encodeURIComponent(key)}&placeId=${encodeURIComponent(pid)}`
      );

      const data = await res.json();

      if (!res.ok) {
        setReviewsError(data.error || 'Failed to load reviews.');
      } else {
        setPlaceData(data);
      }
    } catch {
      setReviewsError('Network error.');
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  const openEnquiry = (product: CustomProduct) => {
    setSelectedProduct(product);
    setForm({
      ...EMPTY_FORM,
      message: `I'm interested in a custom ${product.name}.`
    });
    setShowEnquiryForm(true);
  };

  const getWhatsAppLink = (product: CustomProduct) => {
    const msg = encodeURIComponent(
      `Hi PurelyJid! 👋 I'm interested in a custom *${product.name}* (${product.price_range}). Could you share more details?`
    );
    return `https://wa.me/919518770073?text=${msg}`;
  };

  return (
    <main>
      <Header />

      <div className="p-10 grid grid-cols-3 gap-6">
        {products.map((product) => {
          const imgIdx = activeImage[product.id] || 0;
          const currentImg = product.images?.[imgIdx];

          return (
            <div key={product.id}>
              {currentImg && (
                <img
                  src={currentImg.url}
                  alt={currentImg.alt}
                />
              )}

              <h3>{product.name}</h3>

              <button onClick={() => openEnquiry(product)}>
                Enquire
              </button>

              <a href={getWhatsAppLink(product)} target="_blank">
                WhatsApp
              </a>
            </div>
          );
        })}
      </div>

      <Footer />
    </main>
  );
}