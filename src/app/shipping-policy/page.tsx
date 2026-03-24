'use client';
import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';

export default function ShippingPolicyPage() {
  return (
    <main className="bg-[#FAF6F0] min-h-screen overflow-x-hidden">
      <Header />

      {/* Page Header */}
      <section className="pt-32 pb-10 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/"
              className="text-[11px] uppercase tracking-[0.25em] font-semibold text-muted-foreground hover:text-primary flex items-center gap-1.5"
            >
              <Icon name="ArrowLeftIcon" size={12} />
              Back to Home
            </Link>
          </div>

          <h1 className="font-display italic text-4xl md:text-5xl font-semibold">
            Shipping Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-6">
        <div className="mx-auto max-w-4xl space-y-6 text-sm text-muted-foreground leading-relaxed">

          <p>
            All products at PurelyJid are handcrafted and made with care. Orders are processed within 1–3 business days.
          </p>

          <p>
            Delivery typically takes 5–7 business days across India depending on location.
          </p>

          <p>
            Shipping charges are calculated at checkout and may vary based on order size and delivery address.
          </p>

          <p>
            We are not responsible for delays caused by courier partners or unforeseen circumstances.
          </p>

          <p>
            For queries, contact us at support@purelyjid.com.
          </p>

        </div>
      </section>

      <Footer />
    </main>
  );
}
