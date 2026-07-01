/**
 * Central image manifest. All photos are self-hosted in /public/images
 * (sourced from Pexels, free to use — none show identifiable people so
 * nothing is falsely presented as Oori or his clients). Swap any path
 * for Oori's real photos when ready — nothing else needs to change.
 */
export const media = {
  hero: '/images/hero.jpg', // chisel & mallet on wood
  about: '/images/about.jpg', // hands at work (no face)
  ctaBg: '/images/craft-shavings.jpg', // wood shavings on a bench
  // Gallery images, in display order (mapped onto dict.gallery.items).
  gallery: [
    '/images/work-furniture.jpg',
    '/images/work-art.jpg',
    '/images/work-kitchen.jpg',
    '/images/work-restoration.jpg',
    '/images/work-door.jpg',
    '/images/work-details.jpg',
  ],
} as const;
