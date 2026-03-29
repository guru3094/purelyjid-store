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

const EMPTY_FORM: EnquiryForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
  event_date: '',
  budget: ''
};

export default function CustomProductsPage() {
  const { showToast } = useToast();

  const [products, setProducts] = useState<CustomProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<CustomProduct | null>(null);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [form, setForm] = useState<EnquiryForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('custom_products')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        setProducts(data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const openEnquiry = (product: CustomProduct) => {
    setSelectedProduct(product);
    setForm({
      ...EMPTY_FORM,
      message: `I'm interested in a custom ${product.name}. `
    });
    setShowEnquiryForm(true);
  };

  // ✅ UPDATED FUNCTION (ONLY CHANGE)
  const submitEnquiry = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      showToast('Please fill in your name, email, and phone number.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProduct?.id || null,
          product_name: selectedProduct?.name || '',
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
          event_date: form.event_date || null,
          budget: form.budget || null
        })
      });

      if (!res.ok) throw new Error();

      showToast("Enquiry submitted! We'll get back to you within 24 hours.", 'success');

      setShowEnquiryForm(false);
      setForm(EMPTY_FORM);

    } catch {
      showToast("Something went wrong. Please try again.", 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppLink = (product: CustomProduct) => {
    const msg = encodeURIComponent(
      `Hi PurelyJid! 👋 I'm interested in a custom *${product.name}* (${product.price_range}).`
    );
    return `https://wa.me/919518770073?text=${msg}`;
  };

  return (
    <main className="bg-[#FBF7F2] min-h-screen overflow-x-hidden">
      <Header />

      {/* Products */}
      <section className="pt-32 pb-16 px-6">
        <div className="mx-auto max-w-6xl">

          {loading ? <p>Loading...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {products.map((product) => (
                <div key={product.id} className="bg-white p-6 rounded-2xl">

                  <h3>{product.name}</h3>
                  <p>{product.description}</p>

                  <button onClick={() => openEnquiry(product)}>
                    Send Enquiry
                  </button>

                  <a href={getWhatsAppLink(product)} target="_blank">
                    WhatsApp
                  </a>

                  <a href="tel:+919518770073">
                    Call
                  </a>

                </div>
              ))}

            </div>
          )}
        </div>
      </section>

      {/* ENQUIRY MODAL */}
      {showEnquiryForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">

          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <textarea
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            <button onClick={submitEnquiry} disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Enquiry'}
            </button>

            <button onClick={() => setShowEnquiryForm(false)}>
              Cancel
            </button>

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
