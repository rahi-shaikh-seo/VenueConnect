export interface City {
  name: string;
  venues: number;
  vendors: number;
  slug: string;
  image: string;
  localities?: string[];
}

export const citiesData: City[] = [
  { 
    name: "Ahmedabad", 
    venues: 450, 
    vendors: 1200, 
    slug: "ahmedabad", 
    image: "https://images.unsplash.com/photo-1621250284428-1b2f4477699f?w=800&q=80",
    localities: ["satellite", "vastrapur", "bopal", "sg-highway", "prahlad-nagar", "paldi", "navrangpura", "chandkheda", "thaltej", "bodakdev", "maninagar", "gota", "science-city", "nikol", "bapunagar"]
  },
  { 
    name: "Surat", 
    venues: 380, 
    vendors: 950, 
    slug: "surat", 
    image: "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?w=800&q=80",
    localities: ["vesu", "adajan", "varachha", "piplod", "dumas-road", "city-light", "bhatar", "katargam", "rander", "udhna", "palsana"]
  },
  { 
    name: "Vadodara", 
    venues: 290, 
    vendors: 800, 
    slug: "vadodara", 
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80",
    localities: ["alkapuri", "gotri", "makarpura", "vasna", "manjalpur", "fatehgunj", "karelibaug", "sama", "waghodia", "ajwa-road"]
  },
  { 
    name: "Rajkot", 
    venues: 210, 
    vendors: 550, 
    slug: "rajkot", 
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
    localities: ["kalawad-road", "university-road", "raiya-road", "mavdi", "150-feet-ring-road", "nana-mava", "amin-marg", "kuvadava-road", "gondal-road"]
  },
  { 
    name: "Gandhinagar", 
    venues: 150, 
    vendors: 400, 
    slug: "gandhinagar", 
    image: "https://images.unsplash.com/photo-1544013919-450bc9170395?w=800&q=80",
    localities: ["sector-21", "sector-11", "kd-circle", "infocity", "gift-city", "raysan", "koba"]
  },
  // The following cities are part of the extended list provided by the user
  { name: "Amreli", venues: 18, vendors: 42, slug: "amreli", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800" },
  { name: "Anand", venues: 75, vendors: 190, slug: "anand", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800" },
  { name: "Aravalli", venues: 12, vendors: 30, slug: "aravalli", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800" },
  { name: "Banaskantha", venues: 22, vendors: 55, slug: "banaskantha", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800" },
  { name: "Bharuch", venues: 35, vendors: 85, slug: "bharuch", image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800" },
  { name: "Bhavnagar", venues: 90, vendors: 250, slug: "bhavnagar", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800" },
  { name: "Botad", venues: 15, vendors: 35, slug: "botad", image: "https://images.unsplash.com/photo-1544013919-450bc9170395?w=800" },
  { name: "Chhota Udaipur", venues: 10, vendors: 25, slug: "chhota-udaipur", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800" },
  { name: "Dahod", venues: 14, vendors: 32, slug: "dahod", image: "https://images.unsplash.com/photo-1585675100414-22d733c2a6f8?w=800" },
  { name: "Dang", venues: 8, vendors: 15, slug: "dang", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800" },
  { name: "Devbhoomi Dwarka", venues: 20, vendors: 45, slug: "devbhoomi-dwarka", image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?w=800" },
  { name: "Gir Somnath", venues: 18, vendors: 40, slug: "gir-somnath", image: "https://images.unsplash.com/photo-1621250284428-1b2f4477699f?w=800" },
  { name: "Jamnagar", venues: 85, vendors: 220, slug: "jamnagar", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800" },
  { name: "Junagadh", venues: 60, vendors: 150, slug: "junagadh", image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800" },
  { name: "Kheda", venues: 25, vendors: 60, slug: "kheda", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800" },
  { name: "Kutch", venues: 30, vendors: 75, slug: "kutch", image: "https://images.unsplash.com/photo-1593642532400-2682810df593?w=800" },
  { name: "Mahisagar", venues: 12, vendors: 28, slug: "mahisagar", image: "https://images.unsplash.com/photo-1544013919-450bc9170395?w=800" },
  { name: "Mehsana", venues: 40, vendors: 90, slug: "mehsana", image: "https://images.unsplash.com/photo-1621250284428-1b2f4477699f?w=800" },
  { name: "Morbi", venues: 40, vendors: 95, slug: "morbi", image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800" },
  { name: "Narmada", venues: 15, vendors: 35, slug: "narmada", image: "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?w=800" },
  { name: "Navsari", venues: 45, vendors: 110, slug: "navsari", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800" },
  { name: "Panchmahal", venues: 18, vendors: 40, slug: "panchmahal", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800" },
  { name: "Patan", venues: 20, vendors: 45, slug: "patan", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800" },
  { name: "Porbandar", venues: 15, vendors: 35, slug: "porbandar", image: "https://images.unsplash.com/photo-1544013919-450bc9170395?w=800" },
  { name: "Sabarkantha", venues: 15, vendors: 35, slug: "sabarkantha", image: "https://images.unsplash.com/photo-1621250284428-1b2f4477699f?w=800" },
  { name: "Surendranagar", venues: 22, vendors: 50, slug: "surendranagar", image: "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?w=800" },
  { name: "Tapi", venues: 10, vendors: 22, slug: "tapi", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800" },
  { name: "Valsad", venues: 25, vendors: 65, slug: "valsad", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800" },
  { name: "Palitana", venues: 20, vendors: 45, slug: "palitana", image: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?w=800" },
  { name: "Bhuj", venues: 25, vendors: 60, slug: "bhuj", image: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800" },
  { name: "Gandhidham", venues: 55, vendors: 140, slug: "gandhidham", image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800" }
];

