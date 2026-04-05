'use client';
import React, { useEffect, useState } from 'react';
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
    description: 'Your wedding flowers preserved forever in stunning resin art.',
    category: 'Wedding Keepsakes',
    price_range: '₹8000 – ₹17500',
    images: [{ url: "https://img.rocket.new/generatedImages/rocket_gen_img_1b3b77d57-1772088720556.png", alt: 'img' }],
    catalogue_url: null,
    display_order: 2
  }
];

export default function CustomProductsPage() {
  const { showToast } = useToast();

  const [products, setProducts] = useState<CustomProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<CustomProduct | null>(null);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [form, setForm] = useState<EnquiryForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // ✅ FIX: Load static products
  useEffect(() => {
    setProducts(STATIC_PRODUCTS);
    setLoading(false);
  }, []);

  const openEnquiry = (product: CustomProduct) => {
    setSelectedProduct(product);
    setForm({
      ...EMPTY_FORM,
      message: `I'm interested in a custom ${product.name}.`
    });
    setShowEnquiryForm(true);
  };

  // ✅ FIX: Proper submit function
  const submitEnquiry = async () => {
    if (!selectedProduct) return;

    setSubmitting(true);

    try {
      const msg = encodeURIComponent(
        `Hi PurelyJid! 👋
Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email}
Product: ${selectedProduct.name}
Budget: ${form.budget}
Event Date: ${form.event_date}

Message:
${form.message}`
      );

      window.open(`https://wa.me/919518770073?text=${msg}`, '_blank');

      showToast("Enquiry submitted! We'll get back to you within 24 hours.", 'success');
      setShowEnquiryForm(false);
      setForm(EMPTY_FORM);

    } catch (err) {
      console.error(err);
      showToast("Something went wrong!", 'error');
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
    <main className="bg-[#FBF7F2] min-h-screen">
      <Header />

      {/* Products */}
      <section className="p-6">
        {loading ? <p>Loading...</p> :
          <div className="grid grid-cols-2 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-xl">
                <img src={product.images[0]?.url} className="h-40 w-full object-cover rounded-lg" />

                <h3 className="mt-3 font-semibold">{product.name}</h3>
                <p className="text-sm">{product.price_range}</p>

                <button
                  onClick={() => openEnquiry(product)}
                  className="mt-3 w-full bg-black text-white py-2 rounded-full"
                >
                  Send Enquiry
                </button>

                <div className="flex gap-2 mt-2">
                  <a href={getWhatsAppLink(product)} target="_blank" className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">
                    WhatsApp
                  </a>
                  <a href="tel:+919518770073" className="border px-3 py-1 rounded-full text-xs">
                    Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        }
      </section>

      {/* Enquiry Modal */}
      {showEnquiryForm && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <h2 className="mb-4 font-semibold">{selectedProduct.name}</h2>

            <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full mb-2 border p-2" />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full mb-2 border p-2" />
            <textarea placeholder="Message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full mb-2 border p-2" />

            <button onClick={submitEnquiry} className="bg-black text-white px-4 py-2 rounded-full w-full">
              Submit Enquiry
            </button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}