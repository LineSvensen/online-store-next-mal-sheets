"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/images/Herobanner/room1.jpg",
    foregroundImage: "/images/Herobanner/face.jpg",
    eyebrow: "New collection",
    title: "Simple things, made well.",
    text: "Discover our latest products.",
    href: "/products",
    buttonText: "Shop now",
  },

  {
    id: 2,
    image: "/images/Herobanner/room2.jpg",
    foregroundImage: "/images/Herobanner/shirt.jpg",
    eyebrow: "Featured",
    title: "Designed for everyday use.",
    text: "Timeless products for your home.",
    href: "/products",
    buttonText: "Explore collection",
  },

  {
    id: 3,
    image: "/images/Herobanner/blobs.jpg",
    foregroundImage: "/images/Herobanner/nuts.jpg",
    eyebrow: "Our favourites",
    title: "Find your new favourite.",
    text: "A curated selection of products we love.",
    href: "/products",
    buttonText: "View products",
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const touchStartX = useRef(null);

  function nextSlide() {
    setCurrentSlide((current) =>
      current === slides.length - 1 ? 0 : current + 1,
    );
  }

  function previousSlide() {
    setCurrentSlide((current) =>
      current === 0 ? slides.length - 1 : current - 1,
    );
  }

  function goToSlide(index) {
    setCurrentSlide(index);
    setAutoPlay(false);
  }

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => clearInterval(interval);
  }, [autoPlay, currentSlide]);

  function handleTouchStart(event) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return;

    const difference = touchStartX.current - event.changedTouches[0].clientX;

    if (difference > 50) {
      nextSlide();
      setAutoPlay(false);
    }

    if (difference < -50) {
      previousSlide();
      setAutoPlay(false);
    }

    touchStartX.current = null;
  }

  const slide = slides[currentSlide];

  return (
    <section
      className="relative overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured products"
      onMouseEnter={() => setAutoPlay(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-screen sm:h-[650px]">
        {/* Background */}
        {slides.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
            aria-hidden={index !== currentSlide}
          >
            <img
              src={item.image}
              alt=""
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/20" />
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-start px-12 pb-16 pt-8 sm:px-16 sm:pt-10 md:items-center md:px-24 md:py-12 lg:px-28 xl:px-32">
          <div className="flex w-full flex-col items-center justify-center gap-8 md:grid md:grid-cols-2 md:items-center md:gap-12">
            {/* Foreground images */}
            <div className="relative order-1 flex h-[240px] w-full justify-center sm:h-[280px] md:order-2 md:h-[380px] md:justify-end lg:h-[460px]">
              {slides.map((item, index) => (
                <img
                  key={item.id}
                  src={item.foregroundImage}
                  alt=""
                  className={`absolute h-full max-w-[75%] object-contain transition-opacity duration-300 sm:max-w-[70%] md:max-w-full ${
                    index === currentSlide
                      ? "opacity-100"
                      : "pointer-events-none opacity-0"
                  }`}
                />
              ))}
            </div>

            {/* Text */}
            <div className="order-2 flex w-full max-w-xl flex-col items-center text-center text-white md:order-1 md:items-start md:text-left">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] sm:text-sm">
                {slide.eyebrow}
              </p>

              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {slide.title}
              </h1>

              <p className="mt-4 max-w-md text-sm sm:text-base md:mt-5 md:text-lg">
                {slide.text}
              </p>

              <Link
                href={slide.href}
                className="mt-6 inline-flex border border-white px-5 py-2.5 text-sm font-medium transition hover:bg-white hover:text-black sm:mt-8 sm:px-6 sm:py-3"
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        </div>

        {/* Previous */}
        <button
          type="button"
          onClick={() => {
            previousSlide();
            setAutoPlay(false);
          }}
          aria-label="Previous slide"
          className="absolute cursor-pointer  left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-1.5 transition hover:bg-white sm:left-4 sm:p-2 md:left-6 md:p-3"
        >
          <ChevronLeft className="h-4 w-4  sm:h-5 sm:w-5 md:h-[22px] md:w-[22px]" />
        </button>

        {/* Next */}
        <button
          type="button"
          onClick={() => {
            nextSlide();
            setAutoPlay(false);
          }}
          aria-label="Next slide"
          className="absolute cursor-pointer right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-1.5 transition hover:bg-white sm:right-4 sm:p-2 md:right-6 md:p-3"
        >
          <ChevronRight className="h-4 w-4  cursor-pointer sm:h-5 sm:w-5 md:h-[22px] md:w-[22px]" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 w-2.5 rounded-full border cursor-pointer border-white transition ${
                index === currentSlide ? "bg-white" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
