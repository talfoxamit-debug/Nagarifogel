import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/content/dictionaries';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import About from '@/components/About';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import BeforeAfter from '@/components/BeforeAfter';
import Process from '@/components/Process';
import CtaBand from '@/components/CtaBand';
import Values from '@/components/Values';
import Testimonials from '@/components/Testimonials';
import Faq from '@/components/Faq';
import QuoteForm from '@/components/QuoteForm';
import Contact from '@/components/Contact';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  return (
    <>
      <Hero dict={dict} />
      <Marquee dict={dict} />
      <About dict={dict} />
      <Services dict={dict} />
      <Gallery dict={dict} />
      <BeforeAfter dict={dict} />
      <Process dict={dict} />
      <CtaBand dict={dict} />
      <Values dict={dict} />
      <Testimonials dict={dict} />
      <Faq dict={dict} />
      <QuoteForm dict={dict} locale={locale} />
      <Contact dict={dict} />
    </>
  );
}
