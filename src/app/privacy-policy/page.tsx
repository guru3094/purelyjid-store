'use client';
import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-6">
        <div className="mx-auto max-w-4xl space-y-6 text-sm text-muted-foreground leading-relaxed">

          <p>
            We respect your privacy and are committed to protecting your personal data.
          </p>

          <p>
            We collect basic information such as name, email, and address to process your orders.
          </p>

          <p>
            Your data is never sold and is only shared with trusted partners for order fulfillment and payments.
          </p>

          <p>
            We use secure systems to protect your information.
          </p>

          <p>
            By using our website, you consent to this policy.
          </p>

        </div>
      </section>

      <Footer />
    </main>
  );
}
