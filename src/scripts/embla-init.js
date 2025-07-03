import emblaCarousel from 'embla-carousel';

document.addEventListener('DOMContentLoaded', () => {
  const emblaNode = document.querySelector('.embla');
  if (!emblaNode) {
    return;
  }

  const embla = emblaCarousel(emblaNode.querySelector('.embla__viewport'), {
    loop: false,
    align: 'start',
    containScroll: 'trimSnaps',
  });

  if (!embla) {
    return;
  }

  const prevButton = emblaNode.querySelector('.embla__prev');
  const nextButton = emblaNode.querySelector('.embla__next');

  // Button functionality
  prevButton?.addEventListener('click', () => embla.scrollPrev());
  nextButton?.addEventListener('click', () => embla.scrollNext());

  const disableButtons = () => {
    prevButton?.toggleAttribute('disabled', !embla.canScrollPrev());
    nextButton?.toggleAttribute('disabled', !embla.canScrollNext());
  };
  

  embla.on('select', disableButtons);
  disableButtons(); // Initial button state

  // Auto-slide functionality
  let autoScrollInterval = setInterval(() => {
    embla.scrollNext();
  }, 5000);

  embla.on('pointerDown', () => clearInterval(autoScrollInterval));
  embla.on('pointerUp', () => {
    autoScrollInterval = setInterval(() => {
      embla.scrollNext();
    }, 5000);
  });
});