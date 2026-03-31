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
  name: '', email: '', phone: '', message: '', event_date: '', budget: ''
};

export default function CustomProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<CustomProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<CustomProduct | null>(null);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [form, setForm] = useState<EnquiryForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('custom_products').select('*');
      setProducts(data || []);
    };
    fetchProducts();
  }, []);

  const openEnquiry = (product: CustomProduct) => {
    setSelectedProduct(product);
    setForm({ ...EMPTY_FORM, message: `I'm interested in ${product.name}` });
    setShowEnquiryForm(true);
  };

  // ✅ UPDATED FUNCTION
  const submitEnquiry = async () => {
    if (!form.name || !form.email || !form.phone) {
      showToast('Fill required fields', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();

      // ✅ Save to DB
      await supabase.from('custom_enquiries').insert({
        product_id: selectedProduct?.id,
        ...form,
        status: 'new'
      });

      // ✅ Send Email
      await fetch('/api/send-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, productName: selectedProduct?.name })
      });

      // ✅ WhatsApp fallback
      window.open(
        `https://wa.me/919518770073?text=${encodeURIComponent(
          `Hi, I submitted enquiry\nName: ${form.name}\nProduct: ${selectedProduct?.name}`
        )}`,
        '_blank'
      );

      showToast('Enquiry sent!', 'success');
      setShowEnquiryForm(false);
      setForm(EMPTY_FORM);

    } catch (err) {
      showToast('Error sending enquiry', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <Header />

      <section className="p-10">
        <h1 className="text-3xl mb-6">Custom Products</h1>

        <div className="grid grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="border p-4">
              <h3>{p.name}</h3>
              <button onClick={() => openEnquiry(p)}>
                Send Enquiry
              </button>

              {/* ✅ Call button (working) */}
              <a href="tel:+919518770073">Call</a>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL */}
      {showEnquiryForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 w-[400px]">
            <h2>Enquiry</h2>

            <input placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />

            <input placeholder="Email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />

            <input placeholder="Phone" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />

            <textarea placeholder="Message" value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })} />

            <button onClick={submitEnquiry} disabled={submitting}>
              {submitting ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
