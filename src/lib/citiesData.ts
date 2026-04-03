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
  { name: "Bhavnagar", venues: 90, vendors: 250, slug: "bhavnagar", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Takhteshwar_Temple.jpg/800px-Takhteshwar_Temple.jpg" },
  { name: "Jamnagar", venues: 85, vendors: 220, slug: "jamnagar", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Lakhota_lake_Jamnagar%2C_Golden_hours.jpg/800px-Lakhota_lake_Jamnagar%2C_Golden_hours.jpg" },
  { name: "Anand", venues: 75, vendors: 190, slug: "anand", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80" },
  { name: "Junagadh", venues: 60, vendors: 150, slug: "junagadh", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Dattatreya_Temple_of_Girnar.JPG/800px-Dattatreya_Temple_of_Girnar.JPG" },
  { name: "Gandhidham", venues: 55, vendors: 140, slug: "gandhidham", image: "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?w=600&q=80" },
  { name: "Navsari", venues: 45, vendors: 110, slug: "navsari", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80" },
  { name: "Morbi", venues: 40, vendors: 95, slug: "morbi", image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600&q=80" },
  { name: "Bhuj", venues: 25, vendors: 60, slug: "bhuj", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Aina_Mahal%2C_Bhuj.jpg/800px-Aina_Mahal%2C_Bhuj.jpg" },
  { name: "Valsad", venues: 25, vendors: 65, slug: "valsad", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80" },
  { name: "Palanpur", venues: 15, vendors: 40, slug: "palanpur", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80" },
  { name: "Dahod", venues: 14, vendors: 32, slug: "dahod", image: "https://images.unsplash.com/photo-1585675100414-22d733c2a6f8?w=600&q=80" }
];
