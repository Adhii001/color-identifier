# 🎨 Color Identifier

A React-based web application that lets you upload any image and instantly identifies its dominant colors — complete with HEX codes, RGB values, human-readable color names, and percentage breakdowns.

---

## ✨ Features

- **Drag & Drop / File Picker** – upload images by dragging them onto the drop zone or clicking to browse
- **Image Preview** – see your uploaded image alongside the extracted palette
- **Dominant Color Extraction** – canvas-based pixel sampling and color quantization algorithm
- **Top 8 Colors** – ranked swatches with percentage bars showing how much of the image each color covers
- **HEX & RGB Values** – one-click copy for HEX codes
- **Human-Readable Names** – closest named color from a list of 110+ named colors (e.g. "Sky Blue", "Forest Green", "Crimson")
- **Responsive Design** – works great on desktop, tablet, and mobile

---

## 🖼️ Demo

> Upload a photo and the app analyzes each pixel to produce a color palette like the one below.

```
┌──────────────────────────────────┐
│  [image preview]  [Upload New]   │
│                                  │
│  🎨 Most Dominant                │
│  ████████  Sky Blue   #87ceeb    │
│            rgb(135, 206, 235)    │
│            42.3% of image        │
│                                  │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ …      │
│  │   │ │   │ │   │ │   │        │
│  └───┘ └───┘ └───┘ └───┘        │
└──────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- npm ≥ 9
- [Visual Studio Code](https://code.visualstudio.com/) (recommended editor)

### Opening in VS Code

**Option 1 – from the terminal:**
```bash
# Clone the repository, then open the folder in VS Code
git clone https://github.com/Adhii001/color-identifier.git
cd color-identifier
code .
```

**Option 2 – from VS Code directly:**
1. Launch **Visual Studio Code**.
2. Go to **File → Open Folder…** (or press `Ctrl+K Ctrl+O` on Windows/Linux, `Cmd+K Cmd+O` on macOS).
3. Navigate to and select the `color-identifier` folder.
4. Click **Open**.

> **Tip:** When VS Code opens the project it will prompt you to install the recommended extensions (ESLint, Prettier, React snippets, etc.). Click **Install** when prompted, or open the Extensions panel (`Ctrl+Shift+X` / `Cmd+Shift+X`) and look for workspace recommendations.

### Installation & Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/Adhii001/color-identifier.git
cd color-identifier

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **VS Code tip:** You can open the integrated terminal with `` Ctrl+` `` (Windows/Linux) or `` Cmd+` `` (macOS) and run the commands above without leaving the editor.

### Build for Production

```bash
npm run build
# Output is in the dist/ directory
npm run preview   # preview the production build locally
```

---

## 📖 How to Use

1. Open the app in your browser.
2. Drag an image file onto the drop zone **or** click it to open the file picker.
3. Supported formats: **PNG, JPG/JPEG, GIF, BMP, WebP**.
4. The app automatically extracts and displays the top 8 dominant colors.
5. Click any HEX code on a color card to copy it to your clipboard.
6. Click **Upload New Image** to analyze a different photo.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 (Vite) |
| Color extraction | HTML5 Canvas API (pure JS) |
| Color naming | Custom Euclidean-distance lookup |
| Styling | Plain CSS with CSS custom properties |
| Build tool | Vite 5 |

---

## 🔬 How the Color Extraction Algorithm Works

1. **Scale down** – the uploaded image is drawn onto a hidden `<canvas>` capped at 200×200 pixels.  This keeps pixel-reading fast regardless of the original file size.

2. **Pixel sampling** – instead of reading every pixel, the algorithm samples every 5th pixel in both the X and Y axes.  This gives a statistically representative sample at a fraction of the cost.

3. **Quantization / bucketing** – each RGB channel (0–255) is divided into bins of size 32, producing `8 × 8 × 8 = 512` possible buckets.  Each sampled pixel is placed in the bucket that corresponds to its (R, G, B) values.  Pixels with an alpha value below 128 are ignored.

4. **Averaging** – within each bucket the algorithm accumulates the exact R, G, B values and the pixel count.  The representative color for a bucket is the *average* of all the pixels that fell into it, not just the bucket center.  This makes the resulting colors more accurate.

5. **Ranking** – buckets are sorted by pixel count (most pixels first).  The top 8 buckets become the dominant color palette.

6. **Color naming** – each extracted RGB triple is matched to the nearest entry in a hand-curated list of 110+ named colors using **Euclidean distance** in RGB space:
   ```
   distance = √((r₁−r₂)² + (g₁−g₂)² + (b₁−b₂)²)
   ```

---

## 📁 Project Structure

```
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Root component & state management
│   ├── App.css               # App-level styles
│   ├── index.css             # Global reset & CSS variables
│   ├── components/
│   │   ├── ImageUploader.jsx # Drag-and-drop / file picker
│   │   ├── ImageUploader.css
│   │   ├── ColorPalette.jsx  # Hero swatch + color grid
│   │   ├── ColorPalette.css
│   │   ├── ColorCard.jsx     # Individual color swatch card
│   │   └── ColorCard.css
│   └── utils/
│       ├── colorExtractor.js # Canvas API extraction algorithm
│       └── colorNamer.js     # RGB → color name mapping
└── public/
    └── vite.svg
```

---

## 📄 License

MIT