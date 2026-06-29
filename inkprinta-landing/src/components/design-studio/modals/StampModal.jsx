import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FabricImage } from 'fabric';
import { initializeImageObject } from '../utils/helpers.js';

const CATEGORIES = [
  { id: 'emojis', label: 'Emojis' },
  { id: 'spongebob', label: 'SpongeBob' },
  { id: 'pokemon', label: 'Pokémon' },
  { id: 'anime', label: 'Anime' },
  { id: 'animals', label: 'Animals' },
  { id: 'cartoons', label: 'Cartoons' },
  { id: 'memes', label: 'Memes' }
];

const BLACKLIST_KEYWORDS = [
  'twerk', 'eggplant', 'sin', 'pepe', 'ahegao', 'nsfw', 'sex', 'ass', 'butt',
  'finger', 'middle', 'cock', 'vagina', 'penis', 'lewd', 'thigh', 'boob',
  'tits', 'titty', 'sexy', 'naked', 'hentai', 'weed', 'smoke', 'drug',
  'cigar', 'beer', 'wine', 'alcohol', 'bloody', 'kill', 'suicide', 'dead',
  'knife', 'gun', 'weapon', 'fight', 'licking', 'lick', 'tongue', 'sweat',
  'blush', 'flush', 'horny', 'panties', 'skirt', 'waifu', 'loli', 'pant',
  'underwear', 'bra', 'naked', 'hot', 'babe', 'bikini', 'swimsuit', 'crap',
  'poop', 'shit', 'fuck', 'bitch', 'asshole', 'bastard', 'cunt', 'dick',
  'slut', 'whore', 'boobs', 'breast', 'nipple', 'condom', 'contraceptive',
  'sad_squidward_pepe', 'squidward_dab', 'dancingpatrick', 'tittyskittle',
  'smug', 'leering', 'grope', 'strip', 'lingerie', 'panties', 'hump'
];

const POKEMON_NAMES = [
  "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard",
  "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree",
  "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot",
  "Rattata", "Raticate", "Spearow", "Fearow", "Ekans", "Arbok",
  "Pikachu", "Raichu", "Sandshrew", "Sandslash", "Nidoran♀", "Nidorina",
  "Nidoqueen", "Nidoran♂", "Nidorino", "Nidoking", "Clefairy", "Clefable",
  "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff", "Zubat", "Golbat",
  "Oddish", "Gloom", "Vileplume", "Paras", "Parasect", "Venonat",
  "Venomoth", "Diglett", "Dugtrio", "Meowth", "Persian", "Psyduck",
  "Golduck", "Mankey", "Primeape", "Growlithe", "Arcanine", "Poliwag",
  "Poliwhirl", "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop",
  "Machoke", "Machamp", "Bellsprout", "Weepinbell", "Victreebel", "Tentacool",
  "Tentacruel", "Geodude", "Graveler", "Golem", "Ponyta", "Rapidash",
  "Slowpoke", "Slowbro", "Magnemite", "Magneton", "Farfetch'd", "Doduo",
  "Dodrio", "Seel", "Dewgong", "Grimer", "Muk", "Shellder",
  "Cloyster", "Gastly", "Haunter", "Gengar", "Onix", "Drowzee",
  "Hypno", "Krabby", "Kingler", "Voltorb", "Electrode", "Exeggcute",
  "Exeggutor", "Cubone", "Marowak", "Hitmonlee", "Hitmonchan", "Lickitung",
  "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Chansey", "Tangela",
  "Kangaskhan", "Horsea", "Seadra", "Goldeen", "Seaking", "Staryu",
  "Starmie", "Mr. Mime", "Scyther", "Jynx", "Electabuzz", "Magmar",
  "Pinsir", "Tauros", "Magikarp", "Gyarados", "Lapras", "Ditto",
  "Eevee", "Vaporeon", "Jolteon", "Flareon", "Porygon", "Omanyte",
  "Omastar", "Kabuto", "Kabutops", "Aerodactyl", "Snorlax", "Articuno",
  "Zapdos", "Moltres", "Dratini", "Dragonair", "Dragonite", "Mewtwo",
  "Mew"
];

const POKEMON_STICKERS = POKEMON_NAMES.map((name, index) => {
  const id = index + 1;
  return {
    id: `pk_${id}`,
    title: name,
    url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
  };
});

// Curated Twemoji codes: https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/<hex>.png
const TW = (hex, title, prefix) => ({
  id: `${prefix}_${hex}`,
  url: `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${hex}.png`,
  title
});

const FALLBACK_STICKERS = {
  emojis: [
    TW('1f600', 'Grinning', 'e'), TW('1f601', 'Beaming', 'e'), TW('1f602', 'Joy', 'e'),
    TW('1f603', 'Big Smile', 'e'), TW('1f604', 'Grin', 'e'), TW('1f605', 'Sweat Smile', 'e'),
    TW('1f606', 'Laughing', 'e'), TW('1f607', 'Innocent', 'e'), TW('1f608', 'Smiling Devil', 'e'),
    TW('1f609', 'Wink', 'e'), TW('1f60a', 'Blush', 'e'), TW('1f60b', 'Yum', 'e'),
    TW('1f60c', 'Relieved', 'e'), TW('1f60d', 'Heart Eyes', 'e'), TW('1f60e', 'Sunglasses', 'e'),
    TW('1f60f', 'Smirk', 'e'), TW('1f610', 'Neutral', 'e'), TW('1f612', 'Unamused', 'e'),
    TW('1f613', 'Downcast Sweat', 'e'), TW('1f614', 'Pensive', 'e'), TW('1f615', 'Confused', 'e'),
    TW('1f617', 'Kissing', 'e'), TW('1f618', 'Kissing Heart', 'e'), TW('1f619', 'Kissing Smiling', 'e'),
    TW('1f61a', 'Kissing Closed', 'e'), TW('1f61b', 'Tongue', 'e'), TW('1f61c', 'Winking Tongue', 'e'),
    TW('1f61d', 'Squinting Tongue', 'e'), TW('1f61e', 'Disappointed', 'e'), TW('1f61f', 'Worried', 'e'),
    TW('1f620', 'Angry', 'e'), TW('1f621', 'Pouting', 'e'), TW('1f622', 'Cry', 'e'),
    TW('1f623', 'Persevering', 'e'), TW('1f624', 'Steam Nose', 'e'), TW('1f625', 'Sad Relief', 'e'),
    TW('1f626', 'Frowning Open', 'e'), TW('1f627', 'Anguished', 'e'), TW('1f628', 'Fearful', 'e'),
    TW('1f629', 'Weary', 'e'), TW('1f62a', 'Sleepy', 'e'), TW('1f62b', 'Tired', 'e'),
    TW('1f62c', 'Grimacing', 'e'), TW('1f62d', 'Loudly Crying', 'e'), TW('1f62e', 'Mouth Open', 'e'),
    TW('1f92f', 'Exploding Head', 'e'), TW('1f973', 'Partying', 'e'), TW('1f970', 'Smiling Hearts', 'e'),
    TW('1f97a', 'Pleading', 'e'), TW('1f929', 'Star Struck', 'e'), TW('1f921', 'Clown', 'e'),
    TW('1f525', 'Fire', 'e'), TW('2728', 'Sparkles', 'e'), TW('1f389', 'Party Popper', 'e'),
    TW('1f4af', '100', 'e'), TW('2764', 'Red Heart', 'e'), TW('1f496', 'Sparkling Heart', 'e'),
    TW('1f49b', 'Yellow Heart', 'e'), TW('1f49a', 'Green Heart', 'e'), TW('1f49c', 'Purple Heart', 'e'),
    TW('1f44d', 'Thumbs Up', 'e'), TW('1f44e', 'Thumbs Down', 'e'), TW('1f44c', 'OK Hand', 'e'),
    TW('270c', 'Victory', 'e'), TW('1f91e', 'Crossed Fingers', 'e'), TW('1f680', 'Rocket', 'e')
  ],
  spongebob: [
    { id: 'sb1', url: 'https://cdn3.emoji.gg/emojis/8678_blob_sb_spongebob.png', title: 'Blob SpongeBob' },
    { id: 'sb2', url: 'https://cdn3.emoji.gg/emojis/4599_blob_sb_patrick.png', title: 'Blob Patrick' },
    { id: 'sb3', url: 'https://cdn3.emoji.gg/emojis/1282_blob_sb_squidward.png', title: 'Blob Squidward' },
    { id: 'sb4', url: 'https://cdn3.emoji.gg/emojis/8084_SquidwardPing.png', title: 'Squidward Ping' },
    { id: 'sb5', url: 'https://cdn3.emoji.gg/emojis/SpongebobCaveman.png', title: 'Spongebob Caveman' },
    { id: 'sb6', url: 'https://cdn3.emoji.gg/emojis/5813_blob_sb_patricksrock.png', title: 'Patrick Rock' }
  ],
  anime: [
    TW('1f977', 'Ninja', 'an'), TW('1f479', 'Ogre', 'an'), TW('1f47a', 'Goblin', 'an'),
    TW('1f35c', 'Ramen', 'an'), TW('1f363', 'Sushi', 'an'), TW('1f351', 'Peach', 'an'),
    TW('1f338', 'Cherry Blossom', 'an'), TW('1f31f', 'Glowing Star', 'an'), TW('1f30a', 'Wave', 'an'),
    TW('1f5e1', 'Dagger', 'an'), TW('2694', 'Swords', 'an'), TW('1f3af', 'Direct Hit', 'an')
  ],
  animals: [
    TW('1f431', 'Cat', 'a'), TW('1f436', 'Dog', 'a'), TW('1f43c', 'Panda', 'a'),
    TW('1f981', 'Lion', 'a'), TW('1f42f', 'Tiger', 'a'), TW('1f430', 'Rabbit', 'a'),
    TW('1f428', 'Koala', 'a'), TW('1f427', 'Penguin', 'a'), TW('1f438', 'Frog', 'a'),
    TW('1f422', 'Turtle', 'a'), TW('1f98a', 'Fox', 'a'), TW('1f43b', 'Bear', 'a'),
    TW('1f414', 'Chicken', 'a'), TW('1f434', 'Horse', 'a'), TW('1f42c', 'Dolphin', 'a'),
    TW('1f40d', 'Snake', 'a'), TW('1f98b', 'Butterfly', 'a'), TW('1f426', 'Bird', 'a'),
    TW('1f994', 'Hedgehog', 'a'), TW('1f98c', 'Deer', 'a'), TW('1f43a', 'Wolf', 'a'),
    TW('1f984', 'Unicorn', 'a'), TW('1f409', 'Dragon', 'a'), TW('1f992', 'Giraffe', 'a')
  ],
  cartoons: [
    { id: 'ct1', url: 'https://cdn3.emoji.gg/emojis/8678_blob_sb_spongebob.png', title: 'SpongeBob' },
    TW('1f47b', 'Ghost', 'ct'), TW('1f916', 'Robot', 'ct'), TW('1f383', 'Jack-O-Lantern', 'ct'),
    TW('1f984', 'Unicorn', 'ct'), TW('1f409', 'Dragon', 'ct'), TW('1f47d', 'Alien', 'ct'),
    TW('1f920', 'Cowboy', 'ct'), TW('1f9d9', 'Mage', 'ct'), TW('1f9dc', 'Merperson', 'ct'),
    TW('1f9da', 'Fairy', 'ct'), TW('1f9b8', 'Superhero', 'ct'), TW('1f9b9', 'Supervillain', 'ct')
  ],
  memes: [
    TW('1f914', 'Thinking', 'm'), TW('1f926', 'Facepalm', 'm'), TW('1f921', 'Clown', 'm'),
    TW('1f910', 'Zipper Mouth', 'm'), TW('1f928', 'Raised Eyebrow', 'm'), TW('1f644', 'Eye Roll', 'm'),
    TW('1f62c', 'Grimacing', 'm'), TW('1f92e', 'Vomiting', 'm'), TW('1f624', 'Steam Nose', 'm'),
    TW('1f621', 'Pouting', 'm'), TW('1f92a', 'Zany', 'm'), TW('1f97a', 'Pleading', 'm')
  ]
};

// Custom StickerCard to load images and display GIFs as static first frames
function StickerCard({ url, title, onSelect }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [staticUrl, setStaticUrl] = useState('');
  const [freezing, setFreezing] = useState(false);

  useEffect(() => {
    if (!url) return;

    setLoaded(false);
    setError(false);

    const isGif = url.toLowerCase().endsWith('.gif');
    if (!isGif) {
      setStaticUrl(url);
      return;
    }

    setFreezing(true);
    let active = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!active) return;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 72;
        canvas.height = img.height || 72;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        setStaticUrl(canvas.toDataURL('image/png'));
      } catch (err) {
        setStaticUrl(url); // fallback
      }
      setFreezing(false);
    };
    img.onerror = () => {
      if (active) {
        setStaticUrl(url);
        setFreezing(false);
      }
    };
    img.src = url;

    return () => {
      active = false;
    };
  }, [url]);

  if (error) return null;

  return (
    <button
      onClick={() => onSelect(url)}
      className="group aspect-square rounded-2xl bg-white border border-slate-100 hover:border-cyan-500/50 p-2 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 shadow-sm active:scale-95 cursor-pointer relative overflow-hidden"
      type="button"
    >
      {(!loaded || freezing) && (
        <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-slate-200 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      )}
      {staticUrl && (
        <img
          src={staticUrl}
          alt={title || 'stamp'}
          className={`max-h-full max-w-full object-contain group-hover:scale-105 transition-all duration-300 ${loaded && !freezing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </button>
  );
}

// Shimmering Skeleton Loader
const StickerSkeleton = () => (
  <div className="grid grid-cols-3 gap-3">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="aspect-square rounded-2xl bg-slate-100 animate-pulse border border-slate-100"
      />
    ))}
  </div>
);

export default function StampModal({ isOpen, onClose, fabricRef, saveStateToHistory }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('emojis');
  const [emojiGgData, setEmojiGgData] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce query input to avoid lag
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch Emoji.gg database with caching
  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        const cached = sessionStorage.getItem('inkprinta_emoji_gg_cache');
        if (cached) {
          setEmojiGgData(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const res = await fetch('https://emoji.gg/api');
        const data = await res.json();
        if (Array.isArray(data)) {
          setEmojiGgData(data);
          sessionStorage.setItem('inkprinta_emoji_gg_cache', JSON.stringify(data));
        }
      } catch (err) {
        console.error('Failed to fetch Emoji.gg stickers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmojis();
  }, []);

  // Filter stickers based on selectedCategory and debouncedQuery
  useEffect(() => {
    const getStickersByCategory = () => {
      if (selectedCategory === 'pokemon') {
        return POKEMON_STICKERS;
      }

      const fallbackList = FALLBACK_STICKERS[selectedCategory] || [];
      if (emojiGgData.length === 0) {
        return fallbackList;
      }

      let filtered = [];
      switch (selectedCategory) {

        case 'emojis':
          filtered = emojiGgData
            .filter(item => [1, 6, 20, 22].includes(item.category))
            .map(item => ({
              id: `gg_${item.id}`,
              title: item.title,
              url: item.image
            }));
          break;

        case 'spongebob':
          filtered = emojiGgData
            .filter(item => {
              const t = item.title.toLowerCase();
              return t.includes('spongebob') ||
                t.includes('patrick') ||
                t.includes('squidward') ||
                t.includes('mrkrabs') ||
                t.includes('sandy') ||
                t.includes('plankton') ||
                t.includes('krusty');
            })
            .map(item => ({
              id: `gg_${item.id}`,
              title: item.title,
              url: item.image
            }));
          break;

        case 'anime':
          filtered = emojiGgData
            .filter(item => item.category === 4)
            .map(item => ({
              id: `gg_${item.id}`,
              title: item.title,
              url: item.image
            }));
          break;

        case 'animals':
          filtered = emojiGgData
            .filter(item => item.category === 17)
            .map(item => ({
              id: `gg_${item.id}`,
              title: item.title,
              url: item.image
            }));
          break;

        case 'cartoons':
          filtered = emojiGgData
            .filter(item => [2, 15].includes(item.category))
            .map(item => ({
              id: `gg_${item.id}`,
              title: item.title,
              url: item.image
            }));
          break;

        case 'memes':
          filtered = emojiGgData
            .filter(item => [3, 13].includes(item.category))
            .map(item => ({
              id: `gg_${item.id}`,
              title: item.title,
              url: item.image
            }));
          break;

        default:
          filtered = fallbackList;
      }

      // Merge and remove duplicates + blacklist filters
      const merged = [...fallbackList];
      const seenUrls = new Set(fallbackList.map(s => s.url));
      filtered.forEach(item => {
        const titleLower = item.title.toLowerCase();
        const isSafe = !BLACKLIST_KEYWORDS.some(kw => titleLower.includes(kw));

        if (isSafe && !seenUrls.has(item.url)) {
          seenUrls.add(item.url);
          merged.push(item);
        }
      });

      return merged;
    };

    const categoryStickers = getStickersByCategory();
    const q = debouncedQuery.trim().toLowerCase();

    if (!q) {
      setStickers(categoryStickers);
      return;
    }

    // Filter within active category first
    let searchResults = categoryStickers.filter(s => {
      const isSafe = !BLACKLIST_KEYWORDS.some(kw => s.title.toLowerCase().includes(kw));
      return isSafe && s.title.toLowerCase().includes(q);
    });

    // If no results in active category, search globally
    if (searchResults.length === 0) {
      const allStickers = [
        ...POKEMON_STICKERS,
        ...FALLBACK_STICKERS.emojis,
        ...FALLBACK_STICKERS.spongebob,
        ...FALLBACK_STICKERS.anime,
        ...FALLBACK_STICKERS.animals,
        ...FALLBACK_STICKERS.cartoons,
        ...FALLBACK_STICKERS.memes
      ];

      emojiGgData.forEach(item => {
        allStickers.push({
          id: `gg_${item.id}`,
          title: item.title,
          url: item.image
        });
      });

      const unique = [];
      const seen = new Set();
      allStickers.forEach(s => {
        const titleLower = s.title.toLowerCase();
        const isSafe = !BLACKLIST_KEYWORDS.some(kw => titleLower.includes(kw));

        if (isSafe && !seen.has(s.url) && titleLower.includes(q)) {
          seen.add(s.url);
          unique.push(s);
        }
      });
      searchResults = unique;
    }

    setStickers(searchResults);
  }, [debouncedQuery, selectedCategory, emojiGgData]);

  const handleSelectStamp = (url) => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;

    FabricImage.fromURL(url, { crossOrigin: 'anonymous' })
      .then((fabricImage) => {
        const zoom = canvas.getZoom();
        const unzoomedWidth = canvas.width / zoom;
        const unzoomedHeight = canvas.height / zoom;

        fabricImage.set({
          left: unzoomedWidth / 2,
          top: unzoomedHeight / 2,
          originX: 'center',
          originY: 'center'
        });

        // Scale to max 200x200 while keeping aspect ratio
        const maxW = 200;
        const maxH = 200;
        let scale = 1;
        if (fabricImage.width > maxW || fabricImage.height > maxH) {
          scale = Math.min(maxW / fabricImage.width, maxH / fabricImage.height);
        }
        fabricImage.set({
          scaleX: scale,
          scaleY: scale
        });

        initializeImageObject(fabricImage);

        canvas.add(fabricImage);
        canvas.setActiveObject(fabricImage);
        canvas.renderAll();

        saveStateToHistory(true);
        // Panel stays open so user can add more stickers
      })
      .catch((err) => {
        console.error('Failed to load stamp from URL:', err);
      });
  };

  const scrollRef = useRef(null);

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setQuery('');
    // Reset scroll position to top when switching categories
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  const isCurrentlyLoading = loading;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '-120%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-120%', opacity: 0 }}
          transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl z-30 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col gap-4 w-[380px] max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex flex-col">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Stamp Gallery</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Choose fun stickers powered by Emoji.gg & PokéAPI</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer" type="button">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search stamps..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-200"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Preset Category Chips — 2-row grid, all visible */}
          <div className="grid grid-cols-4 gap-1.5 select-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-2.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wide transition-all duration-200 cursor-pointer text-center truncate ${isSelected
                      ? 'bg-cyan-600 text-white shadow-sm border border-cyan-600'
                      : 'bg-slate-50 text-slate-400 border border-slate-100 hover:text-slate-600 hover:bg-slate-100/50'
                    }`}
                  type="button"
                  title={cat.label}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Grid Container */}
          <div className="relative border border-slate-100 bg-slate-50/40 rounded-2xl p-4 min-h-[220px]">
            {isCurrentlyLoading ? (
              <StickerSkeleton />
            ) : stickers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No stamps found</span>
              </div>
            ) : (
              <div ref={scrollRef} className="grid grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
                {stickers.map((item) => {
                  if (!item.url) return null;
                  return (
                    <StickerCard
                      key={item.id}
                      url={item.url}
                      title={item.title}
                      onSelect={handleSelectStamp}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
