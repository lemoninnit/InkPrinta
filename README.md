# InkPrinta Custom Apparel Platform

InkPrinta is a premium, interactive custom apparel landing page and design studio web application. Users can interact with 3D product previews and customize their own apparel in real-time using a vector/raster canvas design editor.

---

## 🚀 Getting Started & Running the Project

Follow these steps to run the application locally on your computer.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher recommended) and `npm` installed.

### 1. Installation
First, open your terminal, navigate to the `inkprinta-landing` directory, and install the required dependencies:
```bash
cd inkprinta-landing
npm install
```

### 2. Run the Development Server
Start the Vite local development server:
```bash
npm run dev
```
Vite will boot up the local server, usually available at:
* Local: **[http://localhost:5173/](http://localhost:5173/)**
* If port `5173` is in use, Vite will automatically select the next available port (e.g., `http://localhost:5174/`).

### 3. Build for Production
To generate an optimized and minified production bundle in the `dist/` directory:
```bash
npm run build
```

### 4. Preview the Production Build
To test the built production bundle locally:
```bash
npm run preview
```

### 5. Linting
To check and analyze the code for quality, styling guidelines, and potential errors:
```bash
npm run lint
```

---

## 🎨 Features & Capabilities

InkPrinta is packed with advanced design features divided into two main environments: the **Interactive Landing Page** and the **Design Studio**.

### 1. Interactive 3D Landing Page (`/`)
* **Interactive 3D Apparel Preview:** Powered by Three.js and `@react-three/fiber`, the landing page features a interactive 3D model of a T-Shirt (`tshirt.glb`) that floats gently and rotates dynamically to follow the user's mouse cursor.
* **Modern Interface:** Implemented with smooth animations via Framer Motion, glassmorphism UI styling, and a clean, responsive layout.

### 2. Feature-Rich Design Studio (`/design`)
Click **Customize Now** or navigate directly to `/design` to access the customization studio:

* **👕 Product Selection:** Switch between different apparel silhouettes and styles.
* **✍️ Text Manipulation Tools:**
  * Add multi-line custom text items to the canvas.
  * Adjust text styling, including Font Family, Font Size, text opacity, and rotation.
  * Select custom HSL Hue colors, HEX values, or pre-configured brand palettes.
  * Adjust element layers: Lock/Unlock movement, Duplicate elements, or Delete them.
* **🖼️ Image Upload & Formatting:**
  * Upload custom PNG/JPG assets directly to the workspace.
  * **Precision Cropping Tool:** Crop uploaded images with preset aspect ratios (Freeform, Original, 1:1, 4:3, 16:9).
  * **Border & Stroke Styling:** Customize stroke width, stroke color, and stroke types (Solid, Dashed-Large, Dashed-Small).
  * **Image Geometry:** Apply corner rounding, flip horizontally, flip vertically, or adjust overall transparency.
* **🖌️ Vector Drawing & Paint Engine:**
  * **Pencil & Brush Tools:** Draw freely on the canvas with customizable brush size, color, and opacity.
  * **Vector Path Eraser:** An advanced eraser tool utilizing mathematical path-proximity intersection (`isPointerNearPath`) to erase custom brush/pencil lines.
  * **Clear Drawing:** Quickly wipe all freehand strokes from the workspace.
* **🛠️ Canvas Management:**
  * **Multi-Step Undo/Redo History:** Track changes automatically using a canvas state stack.
  * **Zoom Control:** Zoom in, zoom out, or reset zoom back to 100%.
  * **Interactive Clipboard:** Copy and paste elements across the canvas.

---

## ⌨️ Desktop Keyboard Shortcuts

Enhance your productivity in the Design Studio with built-in hotkey support:
| Shortcut | Action |
| --- | --- |
| `Ctrl + Z` | Undo last action |
| `Ctrl + Y` | Redo action |
| `Ctrl + C` | Copy selected item to clipboard |
| `Ctrl + V` | Paste copied item onto canvas |
| `Backspace` / `Delete` | Delete active selection |

---

## 📁 Repository Structure

```
InkPrinta/
├── README.md                           # Main project documentation
└── inkprinta-landing/                  # Frontend react-app folder
    ├── src/
    │   ├── App.jsx                     # Route paths config (/, /design)
    │   ├── main.jsx                    # Application entry point
    │   ├── components/
    │   │   ├── landing-page/           # Header, Hero and 3D Canvas
    │   │   └── design-studio/          # Studio Canvas, Toolbars and Modals
    │   │       ├── canvas/             # Fabric.js Canvas wrappers and crop overlays
    │   │       ├── controls/           # Undo/Redo, Zoom, Text, Image Toolbars
    │   │       ├── hooks/              # Custom hooks for canvas, image, text operations
    │   │       ├── layout/             # Studio Header and Footer
    │   │       └── modals/             # Product, Text, Image, Paint control cards
    │   └── styles/
    │       └── globals.css             # Tailwind imports and base styles
    ├── index.html                      # HTML templates
    ├── package.json                    # Project dependencies and script runner configurations
    └── vite.config.js                  # Vite builder configuration
```

---

## 🌐 Deployment (Render)

This application is ready for production and configured for deployment on [Render](https://inkprinta.onrender.com).

