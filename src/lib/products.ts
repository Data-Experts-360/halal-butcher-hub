import lambChopsImg from "@/assets/lamb-chops.jpg";
import groundBeefImg from "@/assets/ground-beef.jpg";

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

  // GROCERY
  { id: "g-basmati", name: "Premium Basmati Rice", category: "grocery", group: "grocery", subcategory: "Rice & Grains", price: 24.99, unit: "10 lb bag",
    image: img("photo-1586201375761-83865001e31c"),
    description: "Aged long-grain basmati. Aromatic, fluffy every time." },
  { id: "g-redlentil", name: "Red Lentils (Masoor Dal)", category: "grocery", group: "grocery", subcategory: "Lentils & Pulses", price: 6.49, unit: "2 lb",
    image: img("photo-1515543904379-3d757afe72e4"),
    description: "Quick-cooking split red lentils." },
  { id: "g-garam", name: "House Garam Masala", category: "grocery", group: "grocery", subcategory: "Spices", price: 7.99, unit: "100g jar",
    image: img("photo-1596040033229-a9821ebd058d"),
    description: "Hand-blended in store, toasted whole spices." },
  { id: "g-tikka", name: "Tikka Marinade", category: "grocery", group: "grocery", subcategory: "Halal Marinades", price: 5.99, unit: "350ml",
    image: img("photo-1574484284002-952d92456975"),
    description: "Yogurt-based marinade, ready to coat chicken or lamb." },
  { id: "g-tahini", name: "Stone-Ground Tahini", category: "grocery", group: "grocery", subcategory: "Sauces", price: 9.99, unit: "500g" ,
    image: img("photo-1599909533735-7e88e93f1c9c"),
    description: "Single-origin Ethiopian sesame, no additives." },
  { id: "g-laban", name: "Fresh Laban Yogurt", category: "grocery", group: "grocery", subcategory: "Dairy", price: 4.49, unit: "1 quart",
    image: img("photo-1571212515416-fca325c4b8e2"),
    description: "Traditional drinking yogurt, locally made." },
  { id: "g-saffron", name: "Persian Saffron Threads", category: "grocery", group: "grocery", subcategory: "Spices", price: 18.99, unit: "2g tin",
    image: img("photo-1599909533735-7e88e93f1c9c"),
    description: "Grade A+ super negin saffron threads." },
  { id: "g-ghee", name: "Pure Cow Ghee", category: "grocery", group: "grocery", subcategory: "Dairy", price: 12.49, unit: "500g jar",
    image: img("photo-1628689469838-524a4a973b8e"),
    description: "Slow-clarified, grass-fed cow ghee." },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
