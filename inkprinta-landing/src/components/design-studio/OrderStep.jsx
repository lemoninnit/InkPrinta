import React, { useState, useEffect } from 'react';
import BorderGlow from './BorderGlow';

const PRODUCT_MOCKUP_CONFIGS = {
  tshirt: {
    mockupUrl: '/tshirt_mockup.png',
    price: 350,
    label: 'Basic T-Shirt',
    printArea: {
      top: '25%',
      left: '30%',
      width: '40%',
      height: '50%'
    }
  },
  hoodie: {
    mockupUrl: '/hoodie_mockup.png',
    price: 650,
    label: 'Premium Hoodie',
    printArea: {
      top: '25%',
      left: '32%',
      width: '36%',
      height: '38%'
    }
  },
  tote: {
    mockupUrl: '/tote_mockup.png',
    price: 250,
    label: 'Canvas Tote Bag',
    printArea: {
      top: '38%',
      left: '30%',
      width: '40%',
      height: '42%'
    }
  }
};

export default function OrderStep({ designImage, currentProduct, setStep, onClearCanvas }) {
  const config = PRODUCT_MOCKUP_CONFIGS[currentProduct.id] || PRODUCT_MOCKUP_CONFIGS.tshirt;

  // Step 1: Product & Quantity
  const [size, setSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const price = config.price;
  const total = price * quantity;

  // Step 2: Customer Details & Suggestions
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comments, setComments] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [address, setAddress] = useState('');

  // Field validation and touched states
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Synchronous client-side validation
  const getValidationErrors = () => {
    const newErrors = {};

    if (fullName.trim() === '') {
      newErrors.fullName = 'Full Name is required';
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    if (email.trim() === '') {
      newErrors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const cleanedPhone = phone.replace(/\D/g, '');
    if (phone.trim() === '') {
      newErrors.phone = 'Phone Number is required';
    } else if (cleanedPhone.length !== 11) {
      newErrors.phone = 'Phone number must be exactly 11 digits';
    }

    if (deliveryMethod === 'delivery' && address.trim() === '') {
      newErrors.address = 'Delivery Address is required';
    }

    return newErrors;
  };

  const errors = getValidationErrors();

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isFormValid =
    fullName.trim() !== '' &&
    email.trim() !== '' &&
    phone.trim() !== '' &&
    (deliveryMethod === 'pickup' || address.trim() !== '') &&
    Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setSubmitError(null);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      address: true
    });

    const activeErrors = getValidationErrors();
    if (Object.keys(activeErrors).length > 0 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 1. Create a true merged base64 composition of mockup + design
      const mergedBase64 = await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve('');
        }, 3000); // 3 seconds fallback timeout

        try {
          const canvas = document.createElement('canvas');
          canvas.width = 600;
          canvas.height = 600;
          const ctx = canvas.getContext('2d');

          // Draw mockup image
          const mockupImg = new Image();
          mockupImg.onload = () => {
            try {
              ctx.drawImage(mockupImg, 0, 0, 600, 600);

              // Draw design image on top if present
              if (designImage) {
                const designImg = new Image();
                designImg.onload = () => {
                  try {
                    const parsePct = (val) => parseFloat(val) / 100;
                    const top = parsePct(config.printArea.top) * 600;
                    const left = parsePct(config.printArea.left) * 600;
                    const width = parsePct(config.printArea.width) * 600;
                    const height = parsePct(config.printArea.height) * 600;

                    // Apply slight blend or transparency just like preview CSS
                    ctx.globalAlpha = 0.95;
                    ctx.drawImage(designImg, left, top, width, height);
                    clearTimeout(timeout);
                    resolve(canvas.toDataURL('image/png'));
                  } catch (err) {
                    console.error('Error drawing design image onto canvas:', err);
                    clearTimeout(timeout);
                    resolve(designImage); // fallback to designImage
                  }
                };
                designImg.onerror = () => {
                  clearTimeout(timeout);
                  resolve(canvas.toDataURL('image/png'));
                };
                designImg.src = designImage;
              } else {
                clearTimeout(timeout);
                resolve(canvas.toDataURL('image/png'));
              }
            } catch (err) {
              console.error('Error drawing mockup onto canvas:', err);
              clearTimeout(timeout);
              resolve(designImage || '');
            }
          };

          mockupImg.onerror = () => {
            clearTimeout(timeout);
            resolve(designImage || '');
          };
          mockupImg.src = config.mockupUrl;
        } catch (err) {
          console.error('Canvas creation error:', err);
          clearTimeout(timeout);
          resolve(designImage || '');
        }
      });

      // 2. Build order object with safe UUID check
      const orderId = (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function')
        ? window.crypto.randomUUID()
        : 'ord_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);

      // Store design image SEPARATELY to avoid localStorage quota errors.
      // The orders list only holds lightweight metadata + a reference key.
      const designImageKey = `inkprinta_design_img_${orderId}`;
      const finalDesignImage = mergedBase64 || designImage || '';

      // Attempt to save the design image (may still fail if truly out of space — handled gracefully)
      try {
        localStorage.setItem(designImageKey, finalDesignImage);
      } catch (imgErr) {
        console.warn('Could not store design image (quota), proceeding without it:', imgErr);
      }

      const newOrder = {
        id: orderId,
        designImageKey,                         // reference only — no raw base64 in the list
        garment: config.label,
        size,
        quantity,
        total,
        customerName: fullName,
        email,
        phone,
        comments,
        deliveryMethod,
        address: deliveryMethod === 'delivery' ? address : '',
        status: 'pending',
        submittedAt: new Date().toISOString()
      };

      // 3. Save order metadata to localStorage safely
      let existingOrders = [];
      try {
        const existingOrdersStr = localStorage.getItem('inkprinta_orders');
        if (existingOrdersStr) {
          existingOrders = JSON.parse(existingOrdersStr);
          if (!Array.isArray(existingOrders)) {
            existingOrders = [];
          }
        }
      } catch (parseErr) {
        console.error('Failed to parse existing orders, resetting store:', parseErr);
        existingOrders = [];
      }

      // Prune old design images for orders beyond the most recent 3 to free up space
      if (existingOrders.length >= 3) {
        const toRemove = existingOrders.slice(0, existingOrders.length - 2);
        toRemove.forEach((old) => {
          if (old.designImageKey) {
            try { localStorage.removeItem(old.designImageKey); } catch (_) {}
          }
        });
      }

      existingOrders.push(newOrder);
      try {
        localStorage.setItem('inkprinta_orders', JSON.stringify(existingOrders));
      } catch (saveErr) {
        // Last-resort: clear all orders and save just this one
        console.error('Order list save failed, clearing old orders:', saveErr);
        existingOrders = [newOrder];
        localStorage.setItem('inkprinta_orders', JSON.stringify(existingOrders));
      }

      // 4. Clear the canvas design draft
      localStorage.removeItem('inkprinta_design_draft');
      onClearCanvas?.();

      setSubmittedOrder(newOrder);
    } catch (err) {
      console.error('Failed to submit order:', err);
      setSubmitError(err.message || 'An error occurred while placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(val);
  };

  // Success view rendering
  if (submittedOrder) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center p-6 bg-slate-50 select-none">
        <div className="w-full max-w-[520px] bg-white border border-slate-200/60 rounded-3xl p-10 shadow-[0_15px_50px_rgba(0,0,0,0.04)] flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-sm border border-emerald-100/50">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>

          <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider mb-2">Order Submitted!</h2>
          <p className="text-xs text-slate-400 font-bold mb-6">Design submitted for review</p>

          <div className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-5 mb-8 text-left">
            <div className="flex justify-between border-b border-slate-100 pb-3 mb-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
              <span>Order Summary</span>
              <span className="text-slate-600 text-[9px] font-bold">ID: {submittedOrder.id.substring(0, 8)}...</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Product</span>
                <span>{submittedOrder.garment} ({submittedOrder.size})</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Quantity</span>
                <span>{submittedOrder.quantity}x</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Customer</span>
                <span>{submittedOrder.customerName}</span>
              </div>
              {submittedOrder.comments && (
                <div className="flex flex-col text-[10px] text-slate-500 font-bold mt-1 border-t border-slate-100 pt-2">
                  <span>Comments:</span>
                  <p className="font-medium text-slate-600 mt-0.5 max-h-12 overflow-y-auto italic">"{submittedOrder.comments}"</p>
                </div>
              )}
              <div className="flex justify-between text-xs font-black text-cyan-600 border-t border-dashed border-slate-200/80 pt-3 mt-1.5">
                <span>Total Amount</span>
                <span>{formatCurrency(submittedOrder.total)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onClearCanvas?.();
              setStep('design');
            }}
            className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-cyan-600 hover:to-cyan-500 text-white font-black text-xs uppercase tracking-widest rounded-full shadow-md hover:shadow-cyan-200/50 transition-all duration-300 active:scale-95 cursor-pointer"
            type="button"
          >
            Design another garment
          </button>
        </div>
      </div>
    );
  }

  const submitButtonClass = `w-full py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-transparent text-white ${
    isFormValid && !isSubmitting
      ? 'bg-slate-900 hover:bg-cyan-600 shadow-lg hover:-translate-y-0.5 hover:shadow-cyan-200/50 active:translate-y-0 active:scale-95 text-white'
      : 'bg-slate-100 text-slate-400 border border-slate-200/50 shadow-none cursor-not-allowed'
  }`;

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-start p-6 bg-slate-50 overflow-y-auto select-none">
      <div className="w-full max-w-[1024px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12 mt-4">
        
        {/* Left Column: Forms */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Step 1: Product & Quantity */}
          <BorderGlow
            edgeSensitivity={30}
            glowColor="190 90 50"
            backgroundColor="#ffffff"
            borderRadius={24}
            glowRadius={30}
            glowIntensity={0.8}
            colors={['#06b6d4', '#0891b2', '#22d3ee']}
            className="w-full"
          >
            <div className="w-full p-6 flex flex-col">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-white font-extrabold flex items-center justify-center text-[10px]">1</span>
                Product &amp; Quantity
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Product Design Thumbnail Stack - outline and corner rounding directly on the image with no padding */}
                <div className="relative w-36 h-36 border-[0.5px] border-cyan-400 rounded-2xl flex items-center justify-center select-none flex-shrink-0 overflow-hidden shadow-sm">
                  <img
                    src={config.mockupUrl}
                    alt={config.label}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: config.printArea.top,
                      left: config.printArea.left,
                      width: config.printArea.width,
                      height: config.printArea.height,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}
                  >
                    {designImage && (
                      <img
                        src={designImage}
                        alt="Design Print"
                        className="w-full h-full object-cover mix-blend-multiply opacity-90 pointer-events-none"
                      />
                    )}
                  </div>
                </div>

                {/* Product Configurations */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">{config.label}</h4>
                    <p className="text-xs font-extrabold text-cyan-600 mt-1">{formatCurrency(price)} <span className="text-[10px] text-slate-400 font-medium">/ unit</span></p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {/* Size Dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Garment Size</label>
                      <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="h-10 px-3 bg-slate-50 hover:bg-slate-100/75 border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 rounded-xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all cursor-pointer"
                      >
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </select>
                    </div>

                    {/* Quantity Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="h-10 px-3 bg-slate-50 hover:bg-slate-100/75 border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 rounded-xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all"
                      />
                    </div>
                  </div>

                  <div className="border-t border-dashed border-slate-100 mt-4 pt-3 flex justify-between items-center">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Subtotal</span>
                    <span className="text-sm font-black text-slate-800">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </BorderGlow>

          {/* Step 2: Customer Details Form */}
          <BorderGlow
            edgeSensitivity={30}
            glowColor="190 90 50"
            backgroundColor="#ffffff"
            borderRadius={24}
            glowRadius={30}
            glowIntensity={0.8}
            colors={['#06b6d4', '#0891b2', '#22d3ee']}
            className="w-full"
          >
            <div className="w-full p-6 flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 mb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-white font-extrabold flex items-center justify-center text-[10px]">2</span>
                Customer Details
              </h3>

              {/* Delivery Method Selector (moved to the top for UX flow) */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Delivery Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'border-cyan-500 bg-cyan-50/10 shadow-[0_0_12px_rgba(6,182,212,0.08)] font-bold text-slate-800'
                      : 'border-slate-200 bg-slate-50/20 hover:bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="pickup"
                        checked={deliveryMethod === 'pickup'}
                        onChange={() => setDeliveryMethod('pickup')}
                        className="accent-cyan-500 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-700">Store Pickup</span>
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Free</span>
                  </label>

                  <label className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all ${
                    deliveryMethod === 'delivery'
                      ? 'border-cyan-500 bg-cyan-50/10 shadow-[0_0_12px_rgba(6,182,212,0.08)] font-bold text-slate-800'
                      : 'border-slate-200 bg-slate-50/20 hover:bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="delivery"
                        checked={deliveryMethod === 'delivery'}
                        onChange={() => setDeliveryMethod('delivery')}
                        className="accent-cyan-500 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-700">Delivery</span>
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Standard</span>
                  </label>
                </div>
              </div>

              {/* Customer Contact Details (moved to the bottom of the card) */}
              <div className="border-t border-slate-100/80 pt-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Juan Dela Cruz"
                      value={fullName}
                      onBlur={() => handleBlur('fullName')}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`h-11 px-4 bg-slate-50 border rounded-xl outline-none transition-all text-xs font-bold ${
                        touched.fullName && errors.fullName
                          ? 'border-rose-400 bg-rose-50/10 text-rose-800 placeholder-rose-400/60 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:shadow-[0_0_15px_rgba(244,63,94,0.12)]'
                          : 'border-slate-200 text-slate-700 placeholder-slate-400/80 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.12)]'
                      }`}
                    />
                    {touched.fullName && errors.fullName && (
                      <span className="text-[9px] text-rose-500 font-extrabold uppercase tracking-wide mt-0.5 ml-1">{errors.fullName}</span>
                    )}
                  </div>

                  {/* Email input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="juan@gmail.com"
                      value={email}
                      onBlur={() => handleBlur('email')}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`h-11 px-4 bg-slate-50 border rounded-xl outline-none transition-all text-xs font-bold ${
                        touched.email && errors.email
                          ? 'border-rose-400 bg-rose-50/10 text-rose-800 placeholder-rose-400/60 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:shadow-[0_0_15px_rgba(244,63,94,0.12)]'
                          : 'border-slate-200 text-slate-700 placeholder-slate-400/80 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.12)]'
                      }`}
                    />
                    {touched.email && errors.email && (
                      <span className="text-[9px] text-rose-500 font-extrabold uppercase tracking-wide mt-0.5 ml-1">{errors.email}</span>
                    )}
                  </div>
                </div>

                {/* Phone Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0917 123 4567"
                    value={phone}
                    onBlur={() => handleBlur('phone')}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`h-11 px-4 bg-slate-50 border rounded-xl outline-none transition-all text-xs font-bold ${
                      touched.phone && errors.phone
                        ? 'border-rose-400 bg-rose-50/10 text-rose-800 placeholder-rose-400/60 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:shadow-[0_0_15px_rgba(244,63,94,0.12)]'
                        : 'border-slate-200 text-slate-700 placeholder-slate-400/80 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.12)]'
                    }`}
                  />
                  {touched.phone && errors.phone && (
                    <span className="text-[9px] text-rose-500 font-extrabold uppercase tracking-wide mt-0.5 ml-1">{errors.phone}</span>
                  )}
                </div>

                {/* Delivery Address Input */}
                {deliveryMethod === 'delivery' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Delivery Address *</label>
                    <textarea
                      required
                      placeholder="Enter complete shipping address (House No., Street, Barangay, City, Province)"
                      value={address}
                      onBlur={() => handleBlur('address')}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className={`p-4 bg-slate-50 border rounded-xl outline-none transition-all text-xs font-bold resize-none ${
                        touched.address && errors.address
                          ? 'border-rose-400 bg-rose-50/10 text-rose-800 placeholder-rose-400/60 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 focus:shadow-[0_0_15px_rgba(244,63,94,0.12)]'
                          : 'border-slate-200 text-slate-700 placeholder-slate-400/80 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.12)]'
                      }`}
                    />
                    {touched.address && errors.address && (
                      <span className="text-[9px] text-rose-500 font-extrabold uppercase tracking-wide mt-0.5 ml-1">{errors.address}</span>
                    )}
                  </div>
                )}

                {/* Comments & Suggestions TextBox */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Comments / Design Instructions (Optional)</label>
                  <textarea
                    placeholder="E.g., Please align the design exactly 2 inches below the neck line or specify customized print preferences..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={3}
                    className="p-4 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 placeholder-slate-400/80 rounded-xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </BorderGlow>
        </form>

        {/* Right Column: Order Summary & Info card */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
          
          {/* Step 3: Recap & Submit */}
          <BorderGlow
            edgeSensitivity={30}
            glowColor="190 90 50"
            backgroundColor="#ffffff"
            borderRadius={24}
            glowRadius={30}
            glowIntensity={0.8}
            colors={['#06b6d4', '#0891b2', '#22d3ee']}
            className="w-full"
          >
            <div className="w-full p-6 flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                Order Summary
              </h3>

              <div className="flex flex-col gap-3 text-xs font-medium text-slate-500">
                <div className="flex justify-between">
                  <span>Product</span>
                  <span className="font-bold text-slate-700">{config.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size &amp; Qty</span>
                  <span className="font-bold text-slate-700">{size} × {quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-bold text-slate-700 capitalize">{deliveryMethod === 'pickup' ? 'Store Pickup' : 'Delivery'}</span>
                </div>
                
                {fullName && (
                  <div className="flex justify-between border-t border-slate-100 pt-3">
                    <span>Customer</span>
                    <span className="font-bold text-slate-700 truncate max-w-[150px]">{fullName}</span>
                  </div>
                )}

                <div className="border-t border-slate-200 border-double pt-4 mt-2 flex justify-between items-center text-sm font-black text-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Amount</span>
                  <span className="text-cyan-600 text-lg">{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className={submitButtonClass}
                type="button"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Submit Order for Approval'
                )}
              </button>

              {submitError && (
                <div className="mt-3 p-3 bg-rose-50 border border-rose-100 rounded-xl text-[10px] font-bold text-rose-600 leading-normal flex items-start gap-2 shadow-[0_2px_8px_rgba(244,63,94,0.04)]">
                  <svg className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                  <span>{submitError}</span>
                </div>
              )}
            </div>
          </BorderGlow>

          {/* Store Info Footer Card - White background for consistency, with BorderGlow */}
          <BorderGlow
            edgeSensitivity={30}
            glowColor="190 90 50"
            backgroundColor="#ffffff"
            borderRadius={24}
            glowRadius={30}
            glowIntensity={0.8}
            colors={['#06b6d4', '#0891b2', '#22d3ee']}
            className="w-full"
          >
            <div className="w-full p-6 flex flex-col gap-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-600 flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                Store Information
              </h4>
              
              <div className="flex flex-col gap-3.5 text-xs font-bold text-slate-700">
                <div className="flex gap-2.5 items-start">
                  <div className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0 shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <span className="pt-0.5 leading-relaxed text-slate-600">Old Bonifacio Street, Cebu City, Philippines, 6000</span>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0 shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 0 1-7.108-7.108c-.458-.452-.342-1.028.082-1.416l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                  </div>
                  <span className="pt-1 text-slate-600">0966 614 4945</span>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0 shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.626a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <span className="pt-1 text-slate-600">inkprintacebu@gmail.com</span>
                </div>
              </div>

              <div className="flex gap-4 border-t border-slate-100 pt-4 mt-1">
                <a
                  href="https://www.facebook.com/inkprintacebu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-cyan-600 transition-colors"
                >
                  Facebook
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>

                <a
                  href="https://www.instagram.com/inkprintacebu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-cyan-600 transition-colors"
                >
                  Instagram
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </div>
          </BorderGlow>

        </div>
      </div>
    </div>
  );
}
