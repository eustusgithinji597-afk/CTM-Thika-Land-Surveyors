'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export function PropertyFAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: 'faq-1',
      question: 'How do I know a plot listed by CTM Thika Surveyors is authentic and safe to buy?',
      answer:
        'Every single property listed in our database undergoes an extensive due diligence process. As Licensed & Registered Surveyors, we physically verify the site beacons, trace the registry history, and run an official search through the ArdhiSasa digital platform to guarantee clean, unencumbered freehold or leasehold titles before listing.',
    },
    {
      id: 'faq-2',
      question: 'What is a mutation form, and when do I need one?',
      answer:
        'A mutation form is an official document from the Survey of Kenya required whenever you want to subdivide a piece of land into smaller portions or regularize boundaries. We handle the entire configuration: from pulling the mutation forms, surveying the plot lines, to obtaining official registry approvals.',
    },
    {
      id: 'faq-3',
      question: 'How long does it take to process a title deed transfer in Thika?',
      answer:
        'A standard land title transfer typically takes between 30 to 45 days to complete, depending on the speed of local registry valuations and digital clearances on ArdhiSasa. Our team manages the entire succession, agreement drafting, and transfer paperwork loop to keep the process completely transparent.',
    },
    {
      id: 'faq-4',
      question: 'Do your plots have basic amenities like water and electricity?',
      answer:
        'Yes. Our featured properties around Gatanga Road, Landless, and Thika environs are carefully selected for immediate residential or commercial development. They feature on-site access roads, graded paths, secure perimeter boundaries, and direct connections to local water and electricity grids.',
    },
  ];

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-primary/10 p-6">
      <div>
        {/* Header Section */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
            <span className="text-2xl">🛡️</span>
            Land & Surveying FAQs
          </h3>
          <p className="text-sm text-foreground/70 leading-relaxed">
            Critical answers to safeguard your property investments in Thika.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="border-2 border-primary/20 rounded-lg overflow-hidden bg-white hover:shadow-md transition-all duration-300"
            >
              <button
                onClick={() => toggleAccordion(item.id)}
                className="w-full px-4 py-4 flex items-start justify-between bg-white hover:bg-primary/5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                <h4 className="text-sm font-bold text-primary text-left leading-snug pr-3">{item.question}</h4>
                <ChevronDown
                  className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
                    openId === item.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openId === item.id && (
                <div className="px-4 py-4 bg-gradient-to-br from-white to-primary/2 border-t-2 border-primary/10">
                  <p className="text-sm text-foreground/80 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
