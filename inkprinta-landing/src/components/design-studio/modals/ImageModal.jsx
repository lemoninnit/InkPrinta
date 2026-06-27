import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FabricImage } from 'fabric';
import { initializeImageObject } from '../utils/helpers.js';

export default function ImageModal({ isOpen, onClose, fabricRef }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const objectUrl = URL.createObjectURL(file);
      
      FabricImage.fromURL(objectUrl).then((fabricImage) => {
        if (!fabricRef.current) return;
        const canvas = fabricRef.current;
        const zoom = canvas.getZoom();
        const unzoomedWidth = canvas.width / zoom;
        const unzoomedHeight = canvas.height / zoom;

        fabricImage.set({
          left: unzoomedWidth / 2,
          top: unzoomedHeight / 2,
          originX: 'center',
          originY: 'center',
        });
        
        // Scale to max 300x300 while keeping aspect ratio:
        const maxW = 300;
        const maxH = 300;
        let scale = 1;
        if (fabricImage.width > maxW || fabricImage.height > maxH) {
          scale = Math.min(maxW / fabricImage.width, maxH / fabricImage.height);
        }
        fabricImage.set({
          scaleX: scale,
          scaleY: scale
        });
        
        initializeImageObject(fabricImage);
        
        fabricRef.current.add(fabricImage);
        fabricRef.current.setActiveObject(fabricImage);
        fabricRef.current.renderAll();
        
        // Close panel and clean up
        onClose();
        // Do not revoke objectURL immediately so that Undo/Redo can reload it from JSON
        // URL.revokeObjectURL(objectUrl);
      }).catch((err) => {
        console.error('Failed to load image:', err);
      });
    }
  }, [fabricRef, onClose]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': []
    },
    multiple: false
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm z-20"
          />
          <motion.div
            initial={{ y: '120%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '120%', opacity: 0 }}
            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
            className="absolute bottom-20 left-4 right-4 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl z-30 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col gap-5 max-w-lg mx-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex flex-col">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Image Upload</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Supported formats: JPG, PNG, GIF</p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1" type="button">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 min-h-[220px] ${
                isDragActive
                  ? 'border-cyan-500 bg-cyan-500/5'
                  : 'border-slate-200 bg-white/40 hover:border-slate-300 hover:bg-white/60'
              }`}
            >
              <input {...getInputProps()} />
              
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 relative border border-slate-100">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <div className="absolute bottom-1 right-1 bg-cyan-500 text-white rounded-full p-0.5 border-2 border-white">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-bold text-slate-700">Tap to upload</p>
                <p className="text-xs text-slate-400 font-bold mt-1">or drag image here</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
