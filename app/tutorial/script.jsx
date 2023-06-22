"use client"
import { useEffect } from 'react';

function observeElements() {
  // Intersection Observer configuration
  const observerOptions = {
    rootMargin: '0px',
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animation-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Register tutorial cards and h1 for observation
  const tutorialCards = document.querySelectorAll('.tutorial-card');
  tutorialCards.forEach(card => observer.observe(card));

  const h1 = document.querySelectorAll('h1.slide-up');
  h1.forEach(h1 => observer.observe(h1));

  const h2 = document.querySelectorAll('h2.slide-up');
  h2.forEach(h2 => observer.observe(h2));

  const p = document.querySelectorAll('p.slide-up');
  p.forEach(p => observer.observe(p));

  const div = document.querySelectorAll('div.slide-up');
  div.forEach(div => observer.observe(div));

  const li = document.querySelectorAll('li.slide-up');
  li.forEach(li => observer.observe(li));
}

export default function IntersectionObserverComponent() {
  useEffect(() => {
    observeElements(); // Call the function when the component mounts
  }, []);

  return null; // Return null since this component doesn't render anything
}
