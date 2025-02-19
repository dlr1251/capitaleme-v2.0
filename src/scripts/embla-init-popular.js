import EmblaCarousel from 'embla-carousel';

document.addEventListener('DOMContentLoaded', () => {
  
  const emblaNode = document.querySelector('.embla-popular');
  const prevBtn = document.querySelector('.embla-popular__button--prev');
  const nextBtn = document.querySelector('.embla-popular__button--next');

  if (emblaNode && prevBtn && nextBtn) {
    const embla = EmblaCarousel(emblaNode, { loop: true });
    prevBtn.addEventListener('click', () => embla.scrollPrev(), false);
    nextBtn.addEventListener('click', () => embla.scrollNext(), false);
  }
});