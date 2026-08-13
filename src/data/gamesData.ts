export interface GameCode {
  id: string;
  code: string;
  reward: string;
  status: 'active' | 'expired';
  isNew?: boolean;
  addedDate?: string;
}

export interface GameFAQ {
  question: string;
  answer: string;
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  category: 'Anime' | 'Simulator' | 'RPG' | 'Action' | 'Tower Defense';
  developer: string;
  likes: string;
  activePlayers: string;
  imageUrl: string;
  bannerUrl: string;
  description: string;
  howToRedeem: string[];
  updatedAt: string;
  isTrending?: boolean;
  codes: GameCode[];
  faqs: GameFAQ[];
}

export const GAMES_DATA: Game[] = [
  {
    id: "blox-fruits",
    title: "Blox Fruits",
    slug: "blox-fruits",
    category: "Anime",
    developer: "Gamer Robot Inc",
    likes: "97.8%",
    activePlayers: "350K",
    imageUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    description: "Blox Fruits is one of the most popular anime RPG games on Roblox inspired by One Piece. Master swordsmanship, unlock mythical Devil Fruits, and sail across sea realms to become the strongest warrior.",
    howToRedeem: [
      "Launch Blox Fruits in Roblox on your device.",
      "Select your side (Pirate or Marine).",
      "Look for the blue Twitter bird icon on the left side of the screen.",
      "Click the icon to open the Code redemption window.",
      "Type or paste a working code into the box and press Redeem."
    ],
    updatedAt: "August 2026",
    isTrending: true,
    codes: [
      { id: "bf-1", code: "REWARDSET", reward: "2x EXP Boost for 20 Minutes", status: "active", isNew: true, addedDate: "2026-08-10" },
      { id: "bf-2", code: "KITT_RESET", reward: "Free Stat Reset", status: "active", isNew: true, addedDate: "2026-08-08" },
      { id: "bf-3", code: "BLUXXY", reward: "20 Minutes 2x EXP Boost", status: "active" },
      { id: "bf-4", code: "SUB2GAMERROBOT_RESET1", reward: "Free Stat Reset", status: "active" },
      { id: "bf-5", code: "Sub2GamerRobot_EXP1", reward: "30 Minutes 2x EXP Boost", status: "active" },
      { id: "bf-6", code: "Sub2OfficialNoobie", reward: "20 Minutes 2x EXP Boost", status: "active" },
      { id: "bf-7", code: "BIGNEWS", reward: "In-Game Title 'BIGNEWS'", status: "active" },
      { id: "bf-8", code: "FUDD10", reward: "$1 Beli", status: "active" },
      { id: "bf-9", code: "OLDEXPCODE2024", reward: "15 Mins 2x EXP", status: "expired" },
      { id: "bf-10", code: "DRAGONUPDATE", reward: "Free Stat Reset", status: "expired" },
    ],
    faqs: [
      { question: "How often are Blox Fruits codes updated?", answer: "Codes are updated whenever the developers hit subscriber milestones, release major updates, or celebrate event holidays." },
      { question: "Why is my Blox Fruits code not working?", answer: "Codes are case-sensitive. Make sure you copy the exact capitalization and check whether the code has expired." }
    ]
  },
  {
    id: "blade-ball",
    title: "Blade Ball",
    slug: "blade-ball",
    category: "Action",
    developer: "Wiggity",
    likes: "96.5%",
    activePlayers: "120K",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80",
    description: "Blade Ball is a high-octane battle arena game where timing, deflect skills, and sword abilities determine who stays alive against a homing ball of death.",
    howToRedeem: [
      "Open Blade Ball on Roblox.",
      "Click the EXTRA / CODES button at the top left corner of the screen.",
      "Select the 'Codes' tab from the menu.",
      "Enter your code in the text field and click the green Checkmark button."
    ],
    updatedAt: "August 2026",
    isTrending: true,
    codes: [
      { id: "bb-1", code: "FREEGEMS2026", reward: "1,000 Free Gems", status: "active", isNew: true, addedDate: "2026-08-11" },
      { id: "bb-2", code: "SPINBOOST", reward: "1x Wheel Spin", status: "active", isNew: true, addedDate: "2026-08-09" },
      { id: "bb-3", code: "UPDATESWORD", reward: "Exclusive Sword Skin", status: "active" },
      { id: "bb-4", code: "SUMMERTIME", reward: "500 Coins & Ticket", status: "active" },
      { id: "bb-5", code: "OLD_WHEEL_SPIN", reward: "Free Spin", status: "expired" },
    ],
    faqs: [
      { question: "Where can I get new Blade Ball codes?", answer: "New codes are posted on the official Wiggity Discord server and Twitter account when updates drop." }
    ]
  },
  {
    id: "king-legacy",
    title: "King Legacy",
    slug: "king-legacy",
    category: "Anime",
    developer: "Venture Lagoons",
    likes: "95.1%",
    activePlayers: "85K",
    imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80",
    description: "Sail the seas in King Legacy! Explore islands, battle sea monsters, eat Devil Fruits, and master Haki powers to rise as the Pirate King.",
    howToRedeem: [
      "Start King Legacy in Roblox.",
      "Click the Menu gear icon under your Health bar at top left.",
      "Click the 'CODE' option in the drop-down menu.",
      "Paste your active code into the box and press Accept."
    ],
    updatedAt: "August 2026",
    isTrending: true,
    codes: [
      { id: "kl-1", code: "UPDATE6", reward: "10 Copper Keys & 5 Gems", status: "active", isNew: true, addedDate: "2026-08-05" },
      { id: "kl-2", code: "STATRESET2026", reward: "1x Free Stat Reset", status: "active" },
      { id: "kl-3", code: "PEODIZ", reward: "100,000 Beli", status: "active" },
      { id: "kl-4", code: "DINODINO", reward: "2x EXP for 15 minutes", status: "active" },
      { id: "kl-5", code: "FREESKILLP", reward: "Stat Reset", status: "expired" }
    ],
    faqs: [
      { question: "What are Copper Keys in King Legacy?", answer: "Keys allow you to open treasure chests for rare sword drops and crafting ingredients." }
    ]
  },
  {
    id: "anime-defenders",
    title: "Anime Defenders",
    slug: "anime-defenders",
    category: "Tower Defense",
    developer: "Anime Defenders Team",
    likes: "98.2%",
    activePlayers: "210K",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
    description: "Summon legendary anime heroes, strategically position tower defenders, upgrade skills, and conquer waves of challenging enemies in Anime Defenders.",
    howToRedeem: [
      "Open Anime Defenders on Roblox.",
      "Click the three dots (...) menu button on the top left.",
      "Select 'Codes' from the dropdown menu.",
      "Enter your code in the pop-up text box and click Redeem."
    ],
    updatedAt: "August 2026",
    isTrending: true,
    codes: [
      { id: "ad-1", code: "DEFENDERS2026", reward: "500 Gems & Wish Tickets", status: "active", isNew: true, addedDate: "2026-08-12" },
      { id: "ad-2", code: "SUMMONMASTER", reward: "500 Gems", status: "active", isNew: true },
      { id: "ad-3", code: "THANKS500K", reward: "1,000 Gems & Trait Reroll", status: "active" },
      { id: "ad-4", code: "RELEASE", reward: "250 Gems", status: "active" },
      { id: "ad-5", code: "BETACODE", reward: "100 Gems", status: "expired" }
    ],
    faqs: [
      { question: "How do I get more Gems in Anime Defenders?", answer: "Redeem active promo codes, complete daily quests, and win story mode chapter stages." }
    ]
  },
  {
    id: "pet-simulator-99",
    title: "Pet Simulator 99",
    slug: "pet-simulator-99",
    category: "Simulator",
    developer: "BIG Games",
    likes: "94.8%",
    activePlayers: "180K",
    imageUrl: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=600&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
    description: "Hatch, collect, and trade thousands of adorable pets, unlock new worlds, and hoard massive mountains of coins and diamonds in Pet Simulator 99!",
    howToRedeem: [
      "Launch Pet Simulator 99 on Roblox.",
      "Click the Pet icon at the bottom center of your screen.",
      "Click the Exclusive Shop icon (the Shopping Cart).",
      "Scroll down to the bottom and click 'Redeem Merch Code' or 'Redeem Codes'.",
      "Input your code and press Submit."
    ],
    updatedAt: "August 2026",
    isTrending: false,
    codes: [
      { id: "ps99-1", code: "PETDIAMONDS", reward: "10,000 Free Diamonds", status: "active", isNew: true },
      { id: "ps99-2", code: "HUGEUPDATE", reward: "2x Coin Boost (30 Mins)", status: "active" },
      { id: "ps99-3", code: "FREEBOOST99", reward: "Triple Damage Boost", status: "active" },
      { id: "ps99-4", code: "FIRSTCODE", reward: "5,000 Coins", status: "expired" }
    ],
    faqs: [
      { question: "Are physical merchandise codes usable in PS99?", answer: "Yes, plushie and toy codes can be redeemed in the Exclusive Shop." }
    ]
  },
  {
    id: "shindo-life",
    title: "Shindo Life",
    slug: "shindo-life",
    category: "RPG",
    developer: "RELL World",
    likes: "97.2%",
    activePlayers: "65K",
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80",
    description: "Explore massive open ninja worlds, spin rare Bloodlines, train jutsu abilities, and dominate in intense PvP shinobi combat.",
    howToRedeem: [
      "Open Shindo Life and go to the Edit / Character Customization screen.",
      "Look for the 'YouTube Code' text box at the top right of your screen.",
      "Enter the code exactly including exclamation marks (!) if applicable.",
      "The reward will be automatically applied to your account."
    ],
    updatedAt: "August 2026",
    isTrending: false,
    codes: [
      { id: "sl-1", code: "RELLSpins2026!", reward: "200 Free Spins & 20K RELL Coins", status: "active", isNew: true, addedDate: "2026-08-01" },
      { id: "sl-2", code: "ShinobiBoost!", reward: "100 Spins", status: "active" },
      { id: "sl-3", code: "RELLCoinSurge!", reward: "50,000 RELL Coins", status: "active" },
      { id: "sl-4", code: "OldNinjaCode!", reward: "25 Spins", status: "expired" }
    ],
    faqs: [
      { question: "Do Shindo Life codes require an exclamation point at the end?", answer: "Yes, most RELL World codes require an exclamation point ! at the end to be valid." }
    ]
  },
  {
    id: "all-star-tower-defense",
    title: "All Star Tower Defense",
    slug: "all-star-tower-defense",
    category: "Tower Defense",
    developer: "Top Down Games",
    likes: "96.9%",
    activePlayers: "75K",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    description: "Deploy famous anime towers, fight hordes of fiends, evolve characters to 6-star and 7-star power, and dominate infinite mode rankings.",
    howToRedeem: [
      "Start All Star Tower Defense.",
      "Click the Settings gear icon at the bottom right corner.",
      "Enter the code into the text box and press Enter or submit."
    ],
    updatedAt: "August 2026",
    isTrending: false,
    codes: [
      { id: "astd-1", code: "ASTD2026UPDATE", reward: "500 Gems & 1,000 Stardust", status: "active", isNew: true },
      { id: "astd-2", code: "STARDUSTBOOST", reward: "500 Stardust", status: "active" },
      { id: "astd-3", code: "FREEGEMS500", reward: "500 Gems", status: "active" },
      { id: "astd-4", code: "ANNIVERSARYCODE", reward: "100 Stardust", status: "expired" }
    ],
    faqs: [
      { question: "What level do I need to be to use codes in ASTD?", answer: "Certain codes require your account to be at least Level 10 or 15 to prevent alt spamming." }
    ]
  },
  {
    id: "peroxide",
    title: "Peroxide",
    slug: "peroxide",
    category: "Anime",
    developer: "Peroxide Studio",
    likes: "97.0%",
    activePlayers: "45K",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
    description: "Inspired by Bleach, Peroxide lets you become a Soul Reaper, Quincy, or Hollow. Master Bankai, Resurrección, or Vollständig powers in an intense anime combat RPG.",
    howToRedeem: [
      "Press the 'M' key to open the main menu.",
      "Click the Settings (gear) icon.",
      "Type the code into the box at the top and press Enter."
    ],
    updatedAt: "August 2026",
    isTrending: false,
    codes: [
      { id: "px-1", code: "PEAKFICTION", reward: "30 Product Essence", status: "active", isNew: true },
      { id: "px-2", code: "FREEPRODUCTS", reward: "15 Product Essence", status: "active" },
      { id: "px-3", code: "BLEACHBOOST", reward: "10 Product Essence", status: "expired" }
    ],
    faqs: [
      { question: "What is Product Essence used for?", answer: "Product Essence is used to reroll clan traits, Shikai elements, and character appearances." }
    ]
  }
];

export function getAllGames(): Game[] {
  return GAMES_DATA;
}

export function getGameByIdOrSlug(idOrSlug: string): Game | undefined {
  return GAMES_DATA.find((g) => g.id === idOrSlug || g.slug === idOrSlug);
}

export function getTrendingGames(): Game[] {
  return GAMES_DATA.filter((g) => g.isTrending);
}

export function getGamesByCategory(category: string): Game[] {
  if (!category || category === "All") return GAMES_DATA;
  return GAMES_DATA.filter((g) => g.category.toLowerCase() === category.toLowerCase());
}

export function searchGames(query: string): Game[] {
  if (!query || query.trim() === "") return GAMES_DATA;
  const q = query.toLowerCase().trim();
  return GAMES_DATA.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.developer.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.codes.some((c) => c.code.toLowerCase().includes(q) || c.reward.toLowerCase().includes(q))
  );
}

export function getTotalActiveCodesCount(): number {
  return GAMES_DATA.reduce(
    (acc, game) => acc + game.codes.filter((c) => c.status === "active").length,
    0
  );
}
