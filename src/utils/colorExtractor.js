/**
 * colorExtractor.js
 *
 * Uses the HTML5 Canvas API to extract dominant colors from an image.
 * Algorithm:
 *  1. Draw the image onto a hidden canvas (scaled down for performance)
 *  2. Read pixel data with getImageData()
 *  3. Sample every Nth pixel to keep processing fast
 *  4. Bucket similar colors together using quantization (each RGB channel
 *     divided into BUCKET_SIZE bins)
 *  5. Sort buckets by pixel count and return the top N results
 */

const SAMPLE_STEP = 5;        // sample every 5th pixel in each dimension
const BUCKET_SIZE = 32;       // bin size for each RGB channel (256 / 32 = 8 buckets per channel)
const MAX_CANVAS_DIMENSION = 200; // scale image down to at most 200×200 for speed
const MIN_ALPHA = 128;        // ignore near-transparent pixels

/**
 * Extract dominant colors from an image element or data URL.
 *
 * @param {HTMLImageElement|string} source - An already-loaded <img> element or a data URL.
 * @param {number} [topN=8] - How many dominant colors to return.
 * @returns {Promise<Array<{hex: string, rgb: {r,g,b}, percentage: number}>>}
 */
export function extractColors(source, topN = 8) {
  return new Promise((resolve, reject) => {
    const img = source instanceof HTMLImageElement ? source : new Image();

    const process = () => {
      try {
        const canvas = document.createElement('canvas');
        const scale = Math.min(
          1,
          MAX_CANVAS_DIMENSION / img.naturalWidth,
          MAX_CANVAS_DIMENSION / img.naturalHeight,
        );
        canvas.width = Math.max(1, Math.floor(img.naturalWidth * scale));
        canvas.height = Math.max(1, Math.floor(img.naturalHeight * scale));

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Map from bucket key → pixel count
        const buckets = new Map();
        let sampledPixels = 0;

        for (let y = 0; y < height; y += SAMPLE_STEP) {
          for (let x = 0; x < width; x += SAMPLE_STEP) {
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];

            if (a < MIN_ALPHA) continue; // skip transparent

            const br = Math.floor(r / BUCKET_SIZE);
            const bg = Math.floor(g / BUCKET_SIZE);
            const bb = Math.floor(b / BUCKET_SIZE);
            const key = `${br},${bg},${bb}`;

            if (!buckets.has(key)) {
              buckets.set(key, { count: 0, rSum: 0, gSum: 0, bSum: 0 });
            }
            const bucket = buckets.get(key);
            bucket.count++;
            bucket.rSum += r;
            bucket.gSum += g;
            bucket.bSum += b;
            sampledPixels++;
          }
        }

        if (sampledPixels === 0) {
          resolve([]);
          return;
        }

        // Sort by count descending
        const sorted = Array.from(buckets.values()).sort((a, b) => b.count - a.count);

        const results = sorted.slice(0, topN).map((bucket) => {
          const r = Math.round(bucket.rSum / bucket.count);
          const g = Math.round(bucket.gSum / bucket.count);
          const b = Math.round(bucket.bSum / bucket.count);
          const percentage = parseFloat(((bucket.count / sampledPixels) * 100).toFixed(1));
          return {
            rgb: { r, g, b },
            hex: rgbToHex(r, g, b),
            percentage,
          };
        });

        // Normalize percentages so they add up to 100
        const total = results.reduce((sum, c) => sum + c.percentage, 0);
        results.forEach((c) => {
          c.percentage = parseFloat(((c.percentage / total) * 100).toFixed(1));
        });

        resolve(results);
      } catch (err) {
        reject(err);
      }
    };

    if (source instanceof HTMLImageElement) {
      if (img.complete) {
        process();
      } else {
        img.onload = process;
        img.onerror = reject;
      }
    } else {
      // source is a data URL string
      img.crossOrigin = 'anonymous';
      img.onload = process;
      img.onerror = reject;
      img.src = source;
    }
  });
}

/**
 * Convert r, g, b (0–255) to a CSS hex string like "#a3f2c1".
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}
