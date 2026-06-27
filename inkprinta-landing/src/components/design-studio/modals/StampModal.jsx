import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FabricImage } from 'fabric';
import { initializeImageObject } from '../utils/helpers.js';

const CATEGORIES = [
  { id: 'trending', label: '⚡ Trending', query: '' },
  { id: 'love', label: '💖 Love', query: 'love' },
  { id: 'funny', label: '😂 Funny', query: 'funny' },
  { id: 'happy', label: '🎉 Happy', query: 'happy' },
  { id: 'cute', label: '✨ Cute', query: 'cute' },
  { id: 'cool', label: '😎 Cool', query: 'cool' },
  { id: 'animal', label: '🐱 Animal', query: 'animal' }
];

const FALLBACK_STICKERS = {
  trending: [
    { id: 't1', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f60d.png' },
    { id: 't2', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f602.png' },
    { id: 't3', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f525.png' },
    { id: 't4', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/2728.png' },
    { id: 't5', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f60e.png' },
    { id: 't6', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f44c.png' },
    { id: 't7', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f431.png' },
    { id: 't8', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f920.png' },
    { id: 't9', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f680.png' },
    { id: 't10', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f389.png' },
    { id: 't11', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f496.png' },
    { id: 't12', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f3a8.png' }
  ],
  love: [
    { id: 'l1', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f60d.png' },
    { id: 'l2', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f496.png' },
    { id: 'l3', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/2764.png' },
    { id: 'l4', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f48b.png' },
    { id: 'l5', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f618.png' },
    { id: 'l6', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f49d.png' }
  ],
  funny: [
    { id: 'f1', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f602.png' },
    { id: 'f2', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f923.png' },
    { id: 'f3', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f61c.png' },
    { id: 'f4', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f92a.png' },
    { id: 'f5', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f605.png' },
    { id: 'f6', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f601.png' }
  ],
  happy: [
    { id: 'h1', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f389.png' },
    { id: 'h2', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f973.png' },
    { id: 'h3', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f600.png' },
    { id: 'h4', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f604.png' },
    { id: 'h5', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f638.png' },
    { id: 'h6', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f60a.png' }
  ],
  cute: [
    { id: 'cu1', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/2728.png' },
    { id: 'cu2', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f97a.png' },
    { id: 'cu3', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f970.png' },
    { id: 'cu4', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f338.png' },
    { id: 'cu5', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f49f.png' },
    { id: 'cu6', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f43c.png' }
  ],
  cool: [
    { id: 'co1', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f60e.png' },
    { id: 'co2', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f920.png' },
    { id: 'co3', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f525.png' },
    { id: 'co4', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f680.png' },
    { id: 'co5', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f4af.png' },
    { id: 'co6', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f918.png' }
  ],
  animal: [
    { id: 'a1', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f431.png' },
    { id: 'a2', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f436.png' },
    { id: 'a3', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f43c.png' },
    { id: 'a4', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f981.png' },
    { id: 'a5', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f42f.png' },
    { id: 'a6', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f430.png' },
    { id: 'a7', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f428.png' },
    { id: 'a8', url: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f994.png' }
  ]
};

export default function StampModal({ isOpen, onClose, fabricRef, saveStateToHistory }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('trending');
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    let active = true;
    const fetchStickers = async () => {
      setLoading(true);
      try {
        let targetUrl = '';
        if (selectedCategory === 'trending' && !debouncedQuery) {
          targetUrl = `https://api.mojilala.com/v1/stickers/trending?api_key=dc6zaTOxFJmzC&limit=24`;
        } else {
          const catObj = CATEGORIES.find((c) => c.id === selectedCategory);
          const searchTerm = debouncedQuery || catObj?.query || selectedCategory;
          targetUrl = `https://api.mojilala.com/v1/stickers/search?q=${encodeURIComponent(searchTerm)}&api_key=dc6zaTOxFJmzC&limit=24`;
        }

        // Fetching through AllOrigins CORS proxy to avoid cross-origin request blocking
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
        const res = await fetch(proxyUrl);
        const data = await res.json();

        if (active) {
          if (data && data.data && data.data.length > 0) {
            setStickers(data.data);
          } else {
            // Use fallback stickers if API response is empty
            const currentCat = selectedCategory === 'search' ? 'trending' : selectedCategory;
            setStickers(FALLBACK_STICKERS[currentCat] || FALLBACK_STICKERS.trending);
          }
        }
      } catch (err) {
        console.error('Failed to fetch stickers from MojiLaLa API, using Twemoji fallbacks:', err);
        if (active) {
          const currentCat = (selectedCategory === 'search' || selectedCategory === 'trending') ? 'trending' : selectedCategory;
          setStickers(FALLBACK_STICKERS[currentCat] || FALLBACK_STICKERS.trending);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchStickers();
    return () => {
      active = false;
    };
  }, [debouncedQuery, selectedCategory]);

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

        // Scale to max 200x200 while keeping aspect ratio:
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

        saveStateToHistory();
        onClose();
      })
      .catch((err) => {
        console.error('Failed to load stamp from URL:', err);
      });
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setQuery('');
  };

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
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Choose fun stickers powered by MojiLaLa</p>
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
              onChange={(e) => {
                setQuery(e.target.value);
                if (selectedCategory !== 'search') {
                  setSelectedCategory('search');
                }
              }}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-200"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Preset Category Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin select-none max-w-full">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-600 text-white shadow-sm border border-cyan-600'
                      : 'bg-slate-50 text-slate-400 border border-slate-100 hover:text-slate-600 hover:bg-slate-100/50'
                  }`}
                  type="button"
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Grid Container */}
          <div className="relative border border-slate-100 bg-slate-50/40 rounded-2xl p-4 min-h-[220px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Stamps...</span>
              </div>
            ) : stickers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No stamps found</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
                {stickers.map((item) => {
                  // MojiLaLa structure holds the URL in item.images.fixed_height.url, fallback structure has item.url
                  const stampUrl = item.images?.fixed_height?.url || item.images?.original?.url || item.url || '';
                  if (!stampUrl) return null;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectStamp(stampUrl)}
                      className="group aspect-square rounded-2xl bg-white border border-slate-100 hover:border-cyan-500/50 p-2 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 shadow-sm active:scale-95 cursor-pointer"
                      type="button"
                    >
                      <img
                        src={stampUrl}
                        alt="stamp"
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </button>
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
