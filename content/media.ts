/**
 * Central image manifest. All photos are self-hosted in /public/images
 * (sourced from Pexels, free to use). Swap any path for Oori's real
 * photos when ready — nothing else needs to change.
 */
export const media = {
  hero: '/images/hero.jpg',
  about: '/images/about.jpg',
  craftChisel: '/images/craft-chisel.jpg',
  craftHands: '/images/craft-hands.jpg',
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
