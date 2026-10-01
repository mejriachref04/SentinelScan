// Mock Data and Restaurant Information for KAITIND RESTAURANT

export const RESTAURANT_INFO = {
  name: 'KAITIND RESTAURANT',
  tagline: 'Authentic Indian Cuisine, Crafted With Tradition',
  domain: 'KAITINDRESTAURANT.COM',
  address: '[RESTAURANT ADDRESS]',
  phone: '[PHONE NUMBER]',
  email: '[RESTAURANT EMAIL]',
  hours: {
    weekdays: '11:30 AM – 10:00 PM',
    weekends: '11:30 AM – 11:00 PM',
    lunchBuffet: '11:30 AM – 3:00 PM (Mon-Fri)'
  },
  social: {
    instagram: '#',
    facebook: '#'
  }
};

export const MENU_CATEGORIES = [
  'ALL',
  'STARTERS',
  'TANDOORI',
  'CHICKEN',
  'LAMB',
  'SEAFOOD',
  'VEGETARIAN',
  'BIRYANI',
  'BREADS',
  'DESSERTS',
  'DRINKS'
];

export const MENU_ITEMS = [
  {
    id: 's1',
    name: 'Samosa Chaat',
    category: 'STARTERS',
    price: 10.95,
    description: 'Crispy spiced pastry filled with potato and green peas, topped with chickpeas, yogurt, tamarind & mint chutney.',
    dietary: ['Vegetarian'],
    isSignature: false,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's2',
    name: 'Lasooni Gobhi',
    category: 'STARTERS',
    price: 11.95,
    description: 'Crisp cauliflower florets tossed in a garlic sesame chili reduction with spring onions.',
    dietary: ['Vegetarian', 'Vegan'],
    isSignature: true,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 't1',
    name: 'Paneer Tikka Shashlik',
    category: 'TANDOORI',
    price: 18.95,
    description: 'Cottage cheese cubes marinated in yogurt, hung curd & carom seeds, clay oven roasted with bell peppers.',
    dietary: ['Vegetarian', 'Gluten-Free'],
    isSignature: true,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 't2',
    name: 'Tandoori Murgh (Half/Full)',
    category: 'TANDOORI',
    price: 21.95,
    description: 'Bone-in chicken marinated for 24 hours in degi mirch, mustard oil, yogurt and hand-pounded royal spices.',
    dietary: ['Gluten-Free'],
    isSignature: false,
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c1',
    name: 'Old Delhi Butter Chicken',
    category: 'CHICKEN',
    price: 22.95,
    description: 'Tender tandoori chicken simmered in an opulent velvet tomato cream sauce with dried fenugreek leaves.',
    dietary: ['Gluten-Free'],
    isSignature: true,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c2',
    name: 'Chicken Tikka Masala',
    category: 'CHICKEN',
    price: 22.95,
    description: 'Charbroiled chicken breast morsels cooked in a spiced onion tomato masala infused with fresh ginger.',
    dietary: ['Gluten-Free'],
    isSignature: true,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'l1',
    name: 'Kashmiri Lamb Rogan Josh',
    category: 'LAMB',
    price: 24.95,
    description: 'Slow-cooked grass-fed tender lamb in an aromatic Kashmiri chili gravy infused with fennel and dry ginger.',
    dietary: ['Gluten-Free'],
    isSignature: true,
    image: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'sf1',
    name: 'Goan Fish Curry',
    category: 'SEAFOOD',
    price: 25.95,
    description: 'Wild sea bass simmered in a tangy coconut milk broth infused with kokum and roasted Goan spices.',
    dietary: ['Gluten-Free'],
    isSignature: false,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'v1',
    name: 'Dal Makhani',
    category: 'VEGETARIAN',
    price: 17.95,
    description: 'Black lentils slow-cooked overnight on charcoal, finished with butter, cream and gentle herbs.',
    dietary: ['Vegetarian', 'Gluten-Free'],
    isSignature: true,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b1',
    name: 'Hyderabadi Dum Biryani (Chicken / Lamb)',
    category: 'BIRYANI',
    price: 23.95,
    description: 'Long-grain Basmati rice layered with marinated meat, saffron, mint and fried onions, cooked under dough seal (dum).',
    dietary: ['Gluten-Free'],
    isSignature: true,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'br1',
    name: 'Garlic Butter Naan',
    category: 'BREADS',
    price: 4.95,
    description: 'Leavened flatbread brushed with garlic butter and fresh cilantro, baked in tandoor.',
    dietary: ['Vegetarian'],
    isSignature: false,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'd1',
    name: 'Saffron Gulab Jamun',
    category: 'DESSERTS',
    price: 8.95,
    description: 'Warm milk solid dumplings soaked in green cardamom and saffron scented syrup, served with pistachio.',
    dietary: ['Vegetarian'],
    isSignature: false,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'dr1',
    name: 'Mango Lassi',
    category: 'DRINKS',
    price: 5.95,
    description: 'Refreshing yogurt smoothie blended with Alphonso mango pulp and cardamom.',
    dietary: ['Vegetarian', 'Gluten-Free'],
    isSignature: false,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=800'
  }
];

export const GALLERY_ITEMS = [
  {
    id: 'g1',
    title: 'Heritage Butter Chicken',
    category: 'FOOD',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'g2',
    title: 'Main Dining Atmosphere',
    category: 'RESTAURANT',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'g3',
    title: 'Royal Biryani Dum Preparation',
    category: 'FOOD',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'g4',
    title: 'Private Banquet Dining',
    category: 'EVENTS',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'g5',
    title: 'Fresh Tandoori Breads',
    category: 'FOOD',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'g6',
    title: 'Warm Ambient Interior',
    category: 'ATMOSPHERE',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200'
  }
];

export const TESTIMONIAL_PLACEHOLDERS = [
  {
    quote: "[CUSTOMER REVIEW - 'An extraordinary culinary journey. The depth of flavor in the Rogan Josh and Dal Makhani is unmatched in the city. Truly world-class hospitality.']",
    author: "[CUSTOMER NAME]",
    role: "Regular Guest"
  },
  {
    quote: "[CUSTOMER REVIEW - 'Hosted our private anniversary dinner in their dining room. Impeccable attention to detail, warm atmosphere, and exceptional Indian dishes.']",
    author: "[CUSTOMER NAME]",
    role: "Private Event Client"
  },
  {
    quote: "[CUSTOMER REVIEW - 'The most authentic flavor profiles I have experienced outside of Delhi. Flawless presentation and rich culinary heritage on every plate.']",
    author: "[CUSTOMER NAME]",
    role: "Food Enthusiast"
  }
];
