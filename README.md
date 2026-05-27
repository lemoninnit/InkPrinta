# InkPrinta Immersive Landing Page

A high-performance, WebGL-driven immersive landing page built for **InkPrinta Custom Printing**. This project features a 3D interactive t-shirt model, advanced scroll-tied physics, and a modern "brutalist glassmorphism" aesthetic themed around the CMYK color palette.

## 🌟 Key Features
- **WebGL Interactive Background:** A 3D `.glb` T-Shirt model that dynamically scales, rotates, and floats based on the user's scroll position.
- **Cinematic Post-Processing:** Built-in Chromatic Aberration and Bloom effects using `@react-three/postprocessing`.
- **0-Lag Custom Cursor:** A highly optimized `mix-blend-difference` cursor built natively on Framer Motion physics springs to completely bypass React render lag.
- **Dynamic Aesthetic UI:** Glassy hover cards with sweeping light reflections, branded CMYK shadow casting, and floating ambient background orbs.
- **Fully Responsive:** Perfectly optimized layout for both mobile and desktop viewports.

## 🛠️ Tech Stack
- **Framework:** React + Vite
- **Styling:** Tailwind CSS (v4)
- **Animation:** Framer Motion
- **3D Engine:** Three.js
- **React 3D Integrations:** `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`

---

## 🚀 Getting Started

Follow these instructions to install and run the project locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine. (Version 18+ is recommended).

### 1. Installation
Clone the repository or navigate to the project folder, then install all required dependencies:

```bash
cd inkprinta-landing
npm install
```

### 2. Running the Development Server
To run the website locally in development mode:

```bash
npm run dev
```
After running the command, open your browser and navigate to `http://localhost:5173`. 
*Note: Any changes you make to the code will hot-reload instantly in the browser.*

### 3. Building for Production
When you are ready to deploy the website (e.g., to Vercel, Netlify, or a VPS), generate an optimized production build:

```bash
npm run build
```
This will output the highly minified, production-ready files into the `dist/` directory.

To locally preview the production build before deploying:
```bash
npm run preview
```

## 🎨 Asset Structure
- **3D Model:** The central 3D model is located at `public/tshirt.glb`. Replacing this file will update the 3D model rendered on the page.
- **Images:** Brand imagery and cover photos are located in `src/assets/`.

## ⚙️ Performance Notes
- The 3D Canvas pixel ratio is clamped between `[1, 1.5]` to guarantee stable 60FPS performance on high-DPI displays and mobile devices without causing thermal throttling.
- The custom cursor specifically utilizes `useMotionValue` to bypass React state, guaranteeing 0 millisecond render latency during mouse movements.
