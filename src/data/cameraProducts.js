import { defaultCatalog1000 } from './catalogGenerator';

// Comprehensive 1,000+ item Photography & Cinema Catalog
export const initialProducts = defaultCatalog1000;

// Top Featured Photography Categories
export const categoriesData = [
  {
    id: "cat-cameras",
    name: "Cameras",
    path: "/cameras",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&h=750&q=80",
    count: 182,
    description: "Mirrorless, 8K Cinema, and Full-Frame Bodies"
  },
  {
    id: "cat-lenses",
    name: "Lenses",
    path: "/lenses",
    image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=1200&h=750&q=80",
    count: 182,
    description: "G-Master Primes, Telephotos & Cinema Glass"
  },
  {
    id: "cat-lighting",
    name: "Lighting",
    path: "/lighting",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&h=750&q=80",
    count: 182,
    description: "Outdoor Strobes, LED Panels & Softboxes"
  },
  {
    id: "cat-tripods",
    name: "Tripods & Support",
    path: "/tripods",
    image: "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?auto=format&fit=crop&w=1200&h=750&q=80",
    count: 182,
    description: "Carbon Fiber Legs, Gimbals & Video Heads"
  },
  {
    id: "cat-bags",
    name: "Camera Bags",
    path: "/bags",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&h=750&q=80",
    count: 182,
    description: "Weatherproof Backpacks & Pelican Flight Cases"
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    path: "/accessories",
    image: "https://images.unsplash.com/photo-1589739900266-43b2843f4c12?auto=format&fit=crop&w=1200&h=750&q=80",
    count: 182,
    description: "V90 SD Cards, VND Filters, OEM Batteries & Cleaning Kits"
  }
];

// Active Discount Coupons
export const activeCoupons = [
  {
    code: "CAM10",
    discountPercent: 10,
    type: "percentage",
    minAmount: 0,
    description: "10% Instant Rebate on entire photography gear cart"
  },
  {
    code: "PROPHOTO",
    discountAmount: 150,
    type: "fixed",
    minAmount: 1000,
    description: "₹150 Instant Rebate on professional orders over ₹1,000"
  },
  {
    code: "FESTIVE20",
    discountPercent: 20,
    type: "percentage",
    minAmount: 500,
    description: "20% Creator Festival discount on orders over ₹500"
  },
  {
    code: "WELCOME5",
    discountPercent: 5,
    type: "percentage",
    minAmount: 0,
    description: "5% Welcome Bonus for new creators"
  }
];

// Top Camera & Optics Brands
export const cameraBrands = [
  { name: "Sony", logo: "SONY", tagline: "Alpha Mirrorless Innovation" },
  { name: "Canon", logo: "Canon", tagline: "EOS R Optical Excellence" },
  { name: "Nikon", logo: "Nikon", tagline: "At the Heart of the Image" },
  { name: "Fujifilm", logo: "FUJIFILM", tagline: "Legendary Color Science" },
  { name: "Leica", logo: "Leica", tagline: "Crafted in Germany" },
  { name: "DJI", logo: "DJI", tagline: "Cinema Gimbals & Aerials" },
  { name: "Sigma", logo: "SIGMA", tagline: "Art Series Prime Glass" },
  { name: "Godox", logo: "Godox", tagline: "Studio Strobe Precision" },
  { name: "Peak Design", logo: "PEAK DESIGN", tagline: "Engineered for Gear" },
  { name: "Manfrotto", logo: "Manfrotto", tagline: "Proven Support Systems" },
  { name: "SanDisk", logo: "SanDisk", tagline: "Cinema V90 Performance" },
  { name: "Aputure", logo: "Aputure", tagline: "Cinema Lighting Systems" },
  { name: "Nanlite", logo: "Nanlite", tagline: "Creative Studio Lighting" }
];

export const productCategories = categoriesData;
export const trendingBrands = cameraBrands;
