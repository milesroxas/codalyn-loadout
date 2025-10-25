import type { SwiperOptions } from 'swiper/types';

export type CarouselEffect = 'slide' | 'fade';

export interface CarouselDataset {
  sliderInstance?: string;
  effect?: string;
  crossfade?: string;
  slidesPerView?: string;
  spaceBetween?: string;
}

export type CarouselConfig = SwiperOptions;

export interface CarouselInstance {
  element: HTMLElement;
  destroy: () => void;
}
