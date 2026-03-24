'use client';
import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';

export default function TermsPage() {
  return (
    <main className="bg-[#FAF6F0] min-h-screen overflow-x-hidden">
      <Header />

      {/* Page Header */}
      <section className="pt-32 pb-10 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-[11px] uppercase tracking-[0.25em] font-semibold text-muted-foreground flex items-center gap-1.5">
              <Icon name="ArrowLeftIcon" size={12} />
              Back to Home
            </Link>
          </div>

          <h1 className="font-display italic text-4xl md:text-5xl font-semibold">
            Terms & Conditions
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-6">
        <div className="mx-auto max-w-4xl space-y-6 text-sm text-muted-foreground leading-relaxed">

          <p>
            By accessing this website, you agree to be bound by these terms and conditions.
          </p>

          <p>
            All products are subject to availability and may be discontinued at any time.
          </p>

          <p>
            Prices are subject to change without prior notice.
          </p>

          <p>
            Unauthorized use of this website may result in legal action.
          </p>

          <p>
            We reserve the right to update these terms at any time.
          </p>

        </div>
      </section>

      <Footer />
    </main>
  );
}
