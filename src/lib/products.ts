import lambChopsImg from "@/assets/lamb-chops.jpg";
import groundBeefImg from "@/assets/ground-beef.jpg";
const shanTandooriUrl = "/__l5e/assets-v1/1ecc52ce-c30d-4728-99c8-15e31f89fd44/shan-tandoori.jpg";
import shanBiryaniImg from "@/assets/shan-biryani.jpg";
import shanKarahiImg from "@/assets/shan-karahi.jpg";
import shanNihariImg from "@/assets/shan-nihari.jpg";
import shanBombayImg from "@/assets/shan-bombay.jpg";
import shanHaleemImg from "@/assets/shan-haleem.jpg";
import shanKormaImg from "@/assets/shan-korma.jpg";
import shanKababImg from "@/assets/shan-kabab.jpg";
import shanPilauImg from "@/assets/shan-pilau.jpg";
import shanChanaImg from "@/assets/shan-chana.jpg";
import peakFreansLemonAsset from "@/assets/peak-freans-lemon.png.asset.json";
import luTucImg from "@/assets/lu-tuc.jpg";
import luPetitBeurreImg from "@/assets/lu-petit-beurre.jpg";
import luPrinceImg from "@/assets/lu-prince.jpg";
import peakFreansChocoImg from "@/assets/peak-freans-choco.jpg";
import peakFreansChocChipImg from "@/assets/peak-freans-choc-chip.jpg";

export type Category = "beef" | "lamb" | "goat" | "chicken" | "grocery";
export type Group = "meat" | "grocery";

export interface Product {
  id: string;
  name: string;
  category: Category;
  group: Group;
  subcategory: string; // e.g. Steaks, Roasts, Spices
  price: number; // per unit (lb for meat, item for grocery)
  unit: string;
  image: string;
  description: string;
  weights?: number[]; // available weight options in lb (meat)
  preparations?: string[]; // for meat
  tags?: string[];
}

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=80`;

export const PREPARATIONS = [
  "Whole",
  "Cubed",
  "Sliced",
  "Minced / Ground",
  "Bone-in",
  "Boneless",
] as const;

export const PRODUCTS: Product[] = [
  // BEEF
  { id: "beef-ribeye", name: "Ribeye Steak", category: "beef", group: "meat", subcategory: "Steaks", price: 22.99, unit: "lb",
    image: img("photo-1588168333986-5078d3ae3976"),
    description: "Richly marbled ribeye, dry-aged 21 days. The chef's favorite.",
    weights: [0.5, 1, 2, 3], preparations: ["Whole", "Sliced", "Cubed"], tags: ["premium", "bbq"] },
  { id: "beef-tbone", name: "T-Bone Steak", category: "beef", group: "meat", subcategory: "Steaks", price: 19.99, unit: "lb",
    image: img("photo-1607623814075-e51df1bdc82f"),
    description: "Classic T-bone with tenderloin and strip on the bone.",
    weights: [1, 2, 3], preparations: ["Whole", "Bone-in"], tags: ["bbq"] },
  { id: "beef-brisket", name: "Whole Brisket", category: "beef", group: "meat", subcategory: "Roasts", price: 14.5, unit: "lb",
    image: img("photo-1544025162-d76694265947"),
    description: "Slow-cook ready brisket, perfect for smoking.",
    weights: [4, 6, 8, 10], preparations: ["Whole", "Trimmed"] },
  { id: "beef-mince", name: "Ground Beef (Lean)", category: "beef", group: "meat", subcategory: "Diced", price: 8.99, unit: "lb",
    image: groundBeefImg,
    description: "Freshly ground 85/15 lean beef, daily.",
    weights: [1, 2, 5], preparations: ["Minced / Ground"] },
  { id: "beef-shortrib", name: "Beef Short Ribs", category: "beef", group: "meat", subcategory: "BBQ Specials", price: 16.99, unit: "lb",
    image: img("photo-1558030006-450675393462"),
    description: "Bone-in short ribs, cross-cut Korean style available.",
    weights: [1, 2, 3], preparations: ["Bone-in", "Sliced"] },

  // LAMB / GOAT (mutton)
  { id: "lamb-chops", name: "Lamb Chops", category: "lamb", group: "meat", subcategory: "Steaks", price: 24.99, unit: "lb",
    image: lambChopsImg,
    description: "Frenched lamb rib chops, milk-fed.",
    weights: [0.5, 1, 2], preparations: ["Whole", "Bone-in"] },
  { id: "lamb-leg", name: "Whole Leg of Lamb", category: "lamb", group: "meat", subcategory: "Roasts", price: 17.5, unit: "lb",
    image: img("photo-1432139509613-5c4255815697"),
    description: "Bone-in leg, beautifully marbled for slow roasting.",
    weights: [3, 5, 7], preparations: ["Whole", "Boneless", "Cubed"] },
  { id: "goat-curry", name: "Goat Curry Cut", category: "goat", group: "meat", subcategory: "Diced", price: 13.99, unit: "lb",
    image: img("photo-1551183053-bf91a1d81141"),
    description: "Bone-in goat cut for traditional curries and biryani.",
    weights: [1, 2, 3, 5], preparations: ["Cubed", "Bone-in"] },

  // CHICKEN / POULTRY
  { id: "chicken-whole", name: "Whole Free-Range Chicken", category: "chicken", group: "meat", subcategory: "Roasts", price: 6.99, unit: "lb",
    image: img("photo-1587593810167-a84920ea0781"),
    description: "Pasture-raised, hand-slaughtered halal whole bird.",
    weights: [3, 4, 5], preparations: ["Whole", "Cut in 8", "Skinless"] },
  { id: "chicken-thigh", name: "Boneless Chicken Thighs", category: "chicken", group: "meat", subcategory: "Diced", price: 5.99, unit: "lb",
    image: img("photo-1604908176997-125f25cc6f3d"),
    description: "Skinless, boneless thighs — kebab and curry ready.",
    weights: [1, 2, 5], preparations: ["Boneless", "Cubed", "Minced / Ground"] },
  { id: "chicken-wings", name: "Chicken Wings", category: "chicken", group: "meat", subcategory: "BBQ Specials", price: 4.99, unit: "lb",
    image: img("photo-1527477396000-e27163b481c2"),
    description: "Party-size jumbo wings, perfect for grilling.",
    weights: [2, 3, 5], preparations: ["Whole", "Split"] },

  // GROCERY — Shan Masala range
  { id: "shan-tandoori", name: "Shan Tandoori Masala", category: "grocery", group: "grocery", subcategory: "BBQ & Tandoori", price: 3.99, unit: "50g box",
    image: shanTandooriUrl,
    description: "Authentic Shan Tandoori recipe & seasoning mix — the classic smoky-red marinade for chicken, lamb chops, and paneer." },
  { id: "shan-biryani", name: "Shan Biryani Masala", category: "grocery", group: "grocery", subcategory: "Biryani & Rice", price: 4.49, unit: "50g box",
    image: shanBiryaniImg,
    description: "The signature Sindhi-style biryani spice mix — fragrant, layered, and perfectly balanced." },
  { id: "shan-bombay", name: "Shan Bombay Biryani Masala", category: "grocery", group: "grocery", subcategory: "Biryani & Rice", price: 4.49, unit: "60g box",
    image: shanBombayImg,
    description: "Tangy, aromatic Bombay-style biryani blend with a subtle hint of dried plum." },
  { id: "shan-pilau", name: "Shan Pilau Rice Masala", category: "grocery", group: "grocery", subcategory: "Biryani & Rice", price: 3.29, unit: "50g box",
    image: shanPilauImg,
    description: "Delicate whole-spice blend for that classic pulao aroma and taste." },
  { id: "shan-karahi", name: "Shan Chicken Karahi Masala", category: "grocery", group: "grocery", subcategory: "Curry Mixes", price: 3.99, unit: "50g box",
    image: shanKarahiImg,
    description: "Bold, tomato-forward karahi mix — restaurant-style chicken in 20 minutes." },
  { id: "shan-korma", name: "Shan Korma Masala", category: "grocery", group: "grocery", subcategory: "Curry Mixes", price: 3.99, unit: "50g box",
    image: shanKormaImg,
    description: "Rich, creamy korma blend perfect for chicken, lamb, or beef with yogurt and onions." },
  { id: "shan-nihari", name: "Shan Nihari Masala", category: "grocery", group: "grocery", subcategory: "Curry Mixes", price: 4.29, unit: "60g box",
    image: shanNihariImg,
    description: "The classic slow-cooked beef nihari mix — deeply spiced, silky, and slow-braise ready." },
  { id: "shan-haleem", name: "Shan Special Haleem Mix", category: "grocery", group: "grocery", subcategory: "Curry Mixes", price: 6.99, unit: "300g box",
    image: shanHaleemImg,
    description: "Includes lentils, wheat, barley and the signature Shan haleem spice sachet." },
  { id: "shan-kabab", name: "Shan Kabab BBQ Masala", category: "grocery", group: "grocery", subcategory: "BBQ & Tandoori", price: 3.99, unit: "50g box",
    image: shanKababImg,
    description: "Seekh and shami kabab masala — smoky, garlicky, made for the grill." },
  { id: "shan-chana", name: "Shan Chana Masala", category: "grocery", group: "grocery", subcategory: "Curry Mixes", price: 3.29, unit: "50g box",
    image: shanChanaImg,
    description: "Tangy chickpea curry mix with dried pomegranate and roasted cumin." },

  // BISCUITS — LU & Peak Freans
  { id: "peak-freans-lemon", name: "Peak Freans Original Sandwich Lemon", category: "grocery", group: "grocery", subcategory: "Biscuits & Cookies", price: 4.99, unit: "16 snack packs",
    image: peakFreansLemonAsset.url,
    description: "Crisp sandwich biscuits with a zesty lemon cream filling — a teatime classic." },
  { id: "peak-freans-choco", name: "Peak Freans Original Sandwich Chocolate", category: "grocery", group: "grocery", subcategory: "Biscuits & Cookies", price: 4.99, unit: "16 snack packs",
    image: peakFreansChocoImg,
    description: "Rich chocolate cream sandwiched between crunchy Peak Freans biscuits." },
  { id: "peak-freans-choc-chip", name: "Peak Freans Chocolate Chip Cookies", category: "grocery", group: "grocery", subcategory: "Biscuits & Cookies", price: 3.99, unit: "200g box",
    image: peakFreansChocChipImg,
    description: "Baked with real chocolate chips for a buttery, melt-in-the-mouth treat." },
  { id: "lu-tuc", name: "LU Tuc Original Salty Crackers", category: "grocery", group: "grocery", subcategory: "Biscuits & Cookies", price: 3.49, unit: "100g box",
    image: luTucImg,
    description: "Light, oven-baked salty crackers with a subtle crunch — perfect with cheese or dips." },
  { id: "lu-petit-beurre", name: "LU Petit Beurre Butter Biscuits", category: "grocery", group: "grocery", subcategory: "Biscuits & Cookies", price: 3.99, unit: "200g box",
    image: luPetitBeurreImg,
    description: "Pure butter French biscuits with the iconic scalloped edge and 4x4 design." },
  { id: "lu-prince", name: "LU Prince Chocolate Cream Biscuits", category: "grocery", group: "grocery", subcategory: "Biscuits & Cookies", price: 4.49, unit: "300g box",
    image: luPrinceImg,
    description: "Whole wheat biscuits filled with smooth chocolate cream — a lunchbox favorite." },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
