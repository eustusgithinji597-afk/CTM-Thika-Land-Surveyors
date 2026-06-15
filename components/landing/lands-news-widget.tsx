'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface NewsArticle {
  id: number;
  title: string;
  description: string;
  date: string;
  source: string;
}

const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: 'ArdhiSasa Platform Launch in Kiambu County',
    description: 'New digital land registry system now live in Kiambu County, streamlining property documentation and reducing processing times.',
    date: 'Dec 15, 2024',
    source: 'Ministry of Lands & Physical Planning'
  },
  {
    id: 2,
    title: 'Title Deed Processing Accelerated',
    description: 'Recent government initiative aims to process pending title deeds within 30 days. Thika region sees 65% reduction in processing time.',
    date: 'Dec 10, 2024',
    source: 'Kiambu County Government'
  },
  {
    id: 3,
    title: 'New Land Survey Standards Implemented',
    description: 'Enhanced accuracy requirements for cadastral surveys now mandatory. All surveyors must comply with updated technical specifications.',
    date: 'Dec 5, 2024',
    source: 'Surveyors Board of Kenya'
  },
  {
    id: 4,
    title: 'Property Transfer Tax Update',
    description: 'Updated property transfer regulations effective January 2025. New exemptions for first-time homebuyers in Kiambu.',
    date: 'Nov 28, 2024',
    source: 'Kenya Revenue Authority'
  },
  {
    id: 5,
    title: 'Anti-Fraud Measures Strengthened',
    description: 'Ministry implements blockchain technology for deed verification. Counterfeit document detection success rate now 99.8%.',
    date: 'Nov 20, 2024',
    source: 'Ministry of Lands & Physical Planning'
  }
];

export function LandsNewsWidget() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsArticles.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handleOpenMinistryPortal = () => {
    window.open('https://lands.go.ke/', '_blank', 'noopener,noreferrer');
  };

  const goToPrevious = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + newsArticles.length) % newsArticles.length);
    setTimeout(() => setIsAutoPlay(true), 8000);
  };

  const goToNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % newsArticles.length);
    setTimeout(() => setIsAutoPlay(true), 8000);
  };

  const currentArticle = newsArticles[currentIndex];

  return (
    <div className="bg-white rounded-xl shadow-md border border-primary/10">
      <div className="p-6">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
            <span className="text-2xl">📰</span>
            Ministry of Lands News
          </h3>
          <p className="text-sm text-foreground/70 leading-relaxed">
            Real-time regulatory updates and ArdhiSasa announcements tracking across Kiambu County.
          </p>
        </div>

        {/* News Carousel */}
        <div className="w-full rounded-xl overflow-hidden border-2 border-primary/20 bg-primary p-1 mb-4">
          <div className="bg-white h-[350px] flex flex-col justify-between p-6 relative overflow-hidden">
            {/* Article Content with Animation */}
            <div className="flex-1 flex flex-col justify-center">
              <div 
                key={currentArticle.id}
                className="animate-in fade-in-50 slide-in-from-right-1/2 duration-500"
              >
                <div className="mb-3 inline-block">
                  <span className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                    {currentArticle.source}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-primary mb-3 line-clamp-2">
                  {currentArticle.title}
                </h4>
                <p className="text-sm text-foreground/75 mb-4 line-clamp-3 leading-relaxed">
                  {currentArticle.description}
                </p>
                <p className="text-xs text-foreground/50 font-medium">
                  📅 {currentArticle.date}
                </p>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary/10">
              <button
                onClick={goToPrevious}
                className="p-2 hover:bg-primary/10 rounded-full transition-colors duration-200"
                aria-label="Previous article"
              >
                <ChevronLeft className="w-5 h-5 text-primary" />
              </button>

              {/* Article Indicators */}
              <div className="flex gap-1">
                {newsArticles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlay(false);
                      setCurrentIndex(index);
                      setTimeout(() => setIsAutoPlay(true), 8000);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-accent w-6'
                        : 'bg-primary/20 w-2 hover:bg-primary/40'
                    }`}
                    aria-label={`Go to article ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                className="p-2 hover:bg-primary/10 rounded-full transition-colors duration-200"
                aria-label="Next article"
              >
                <ChevronRight className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>
        </div>

        {/* Info Text and Button */}
        <div className="text-center space-y-3">
          <p className="text-xs text-foreground/60">
            Article {currentIndex + 1} of {newsArticles.length} • Auto-rotating every 6 seconds
          </p>
          <button
            onClick={handleOpenMinistryPortal}
            className="w-full px-4 py-2 bg-transparent text-accent font-bold text-sm border-2 border-accent rounded-lg hover:bg-accent hover:text-primary transition-all duration-300"
          >
            Open Official Ministry Portal
          </button>
        </div>
      </div>
    </div>
  );
}
