/**
 * colorNamer.js
 *
 * Maps an RGB color to the nearest human-readable color name using
 * Euclidean distance in RGB space.
 */

/** @type {Array<{name: string, r: number, g: number, b: number}>} */
const COLOR_LIST = [
  { name: 'Black', r: 0, g: 0, b: 0 },
  { name: 'White', r: 255, g: 255, b: 255 },
  { name: 'Red', r: 255, g: 0, b: 0 },
  { name: 'Lime', r: 0, g: 255, b: 0 },
  { name: 'Blue', r: 0, g: 0, b: 255 },
  { name: 'Yellow', r: 255, g: 255, b: 0 },
  { name: 'Cyan', r: 0, g: 255, b: 255 },
  { name: 'Magenta', r: 255, g: 0, b: 255 },
  { name: 'Silver', r: 192, g: 192, b: 192 },
  { name: 'Gray', r: 128, g: 128, b: 128 },
  { name: 'Dark Gray', r: 64, g: 64, b: 64 },
  { name: 'Light Gray', r: 211, g: 211, b: 211 },
  { name: 'Maroon', r: 128, g: 0, b: 0 },
  { name: 'Olive', r: 128, g: 128, b: 0 },
  { name: 'Dark Green', r: 0, g: 100, b: 0 },
  { name: 'Forest Green', r: 34, g: 139, b: 34 },
  { name: 'Teal', r: 0, g: 128, b: 128 },
  { name: 'Navy', r: 0, g: 0, b: 128 },
  { name: 'Purple', r: 128, g: 0, b: 128 },
  { name: 'Orange', r: 255, g: 165, b: 0 },
  { name: 'Dark Orange', r: 255, g: 140, b: 0 },
  { name: 'Gold', r: 255, g: 215, b: 0 },
  { name: 'Coral', r: 255, g: 127, b: 80 },
  { name: 'Salmon', r: 250, g: 128, b: 114 },
  { name: 'Tomato', r: 255, g: 99, b: 71 },
  { name: 'Crimson', r: 220, g: 20, b: 60 },
  { name: 'Pink', r: 255, g: 192, b: 203 },
  { name: 'Hot Pink', r: 255, g: 105, b: 180 },
  { name: 'Deep Pink', r: 255, g: 20, b: 147 },
  { name: 'Lavender', r: 230, g: 230, b: 250 },
  { name: 'Violet', r: 238, g: 130, b: 238 },
  { name: 'Orchid', r: 218, g: 112, b: 214 },
  { name: 'Plum', r: 221, g: 160, b: 221 },
  { name: 'Indigo', r: 75, g: 0, b: 130 },
  { name: 'Slate Blue', r: 106, g: 90, b: 205 },
  { name: 'Medium Blue', r: 0, g: 0, b: 205 },
  { name: 'Royal Blue', r: 65, g: 105, b: 225 },
  { name: 'Cornflower Blue', r: 100, g: 149, b: 237 },
  { name: 'Sky Blue', r: 135, g: 206, b: 235 },
  { name: 'Light Blue', r: 173, g: 216, b: 230 },
  { name: 'Powder Blue', r: 176, g: 224, b: 230 },
  { name: 'Steel Blue', r: 70, g: 130, b: 180 },
  { name: 'Dodger Blue', r: 30, g: 144, b: 255 },
  { name: 'Deep Sky Blue', r: 0, g: 191, b: 255 },
  { name: 'Aquamarine', r: 127, g: 255, b: 212 },
  { name: 'Turquoise', r: 64, g: 224, b: 208 },
  { name: 'Medium Turquoise', r: 72, g: 209, b: 204 },
  { name: 'Cadet Blue', r: 95, g: 158, b: 160 },
  { name: 'Sea Green', r: 46, g: 139, b: 87 },
  { name: 'Medium Sea Green', r: 60, g: 179, b: 113 },
  { name: 'Spring Green', r: 0, g: 255, b: 127 },
  { name: 'Pale Green', r: 152, g: 251, b: 152 },
  { name: 'Light Green', r: 144, g: 238, b: 144 },
  { name: 'Yellow Green', r: 154, g: 205, b: 50 },
  { name: 'Chartreuse', r: 127, g: 255, b: 0 },
  { name: 'Lawn Green', r: 124, g: 252, b: 0 },
  { name: 'Green Yellow', r: 173, g: 255, b: 47 },
  { name: 'Khaki', r: 240, g: 230, b: 140 },
  { name: 'Dark Khaki', r: 189, g: 183, b: 107 },
  { name: 'Beige', r: 245, g: 245, b: 220 },
  { name: 'Cornsilk', r: 255, g: 248, b: 220 },
  { name: 'Lemon Chiffon', r: 255, g: 250, b: 205 },
  { name: 'Moccasin', r: 255, g: 228, b: 181 },
  { name: 'Peach', r: 255, g: 218, b: 185 },
  { name: 'Bisque', r: 255, g: 228, b: 196 },
  { name: 'Sandy Brown', r: 244, g: 164, b: 96 },
  { name: 'Tan', r: 210, g: 180, b: 140 },
  { name: 'Wheat', r: 245, g: 222, b: 179 },
  { name: 'Burlywood', r: 222, g: 184, b: 135 },
  { name: 'Sienna', r: 160, g: 82, b: 45 },
  { name: 'Brown', r: 165, g: 42, b: 42 },
  { name: 'Saddle Brown', r: 139, g: 69, b: 19 },
  { name: 'Chocolate', r: 210, g: 105, b: 30 },
  { name: 'Peru', r: 205, g: 133, b: 63 },
  { name: 'Rosy Brown', r: 188, g: 143, b: 143 },
  { name: 'Dark Red', r: 139, g: 0, b: 0 },
  { name: 'Firebrick', r: 178, g: 34, b: 34 },
  { name: 'Indian Red', r: 205, g: 92, b: 92 },
  { name: 'Light Coral', r: 240, g: 128, b: 128 },
  { name: 'Misty Rose', r: 255, g: 228, b: 225 },
  { name: 'Thistle', r: 216, g: 191, b: 216 },
  { name: 'Gainsboro', r: 220, g: 220, b: 220 },
  { name: 'Ivory', r: 255, g: 255, b: 240 },
  { name: 'Honeydew', r: 240, g: 255, b: 240 },
  { name: 'Mint Cream', r: 245, g: 255, b: 250 },
  { name: 'Azure', r: 240, g: 255, b: 255 },
  { name: 'Alice Blue', r: 240, g: 248, b: 255 },
  { name: 'Ghost White', r: 248, g: 248, b: 255 },
  { name: 'Snow', r: 255, g: 250, b: 250 },
  { name: 'Seashell', r: 255, g: 245, b: 238 },
  { name: 'Floral White', r: 255, g: 250, b: 240 },
  { name: 'Old Lace', r: 253, g: 245, b: 230 },
  { name: 'Linen', r: 250, g: 240, b: 230 },
  { name: 'Antique White', r: 250, g: 235, b: 215 },
  { name: 'Papaya Whip', r: 255, g: 239, b: 213 },
  { name: 'Blanched Almond', r: 255, g: 235, b: 205 },
  { name: 'Navajo White', r: 255, g: 222, b: 173 },
  { name: 'Dark Salmon', r: 233, g: 150, b: 122 },
  { name: 'Light Salmon', r: 255, g: 160, b: 122 },
  { name: 'Dark Violet', r: 148, g: 0, b: 211 },
  { name: 'Blue Violet', r: 138, g: 43, b: 226 },
  { name: 'Medium Orchid', r: 186, g: 85, b: 211 },
  { name: 'Medium Purple', r: 147, g: 112, b: 219 },
  { name: 'Rebecca Purple', r: 102, g: 51, b: 153 },
  { name: 'Dark Slate Blue', r: 72, g: 61, b: 139 },
  { name: 'Dark Turquoise', r: 0, g: 206, b: 209 },
  { name: 'Dark Cyan', r: 0, g: 139, b: 139 },
  { name: 'Light Cyan', r: 224, g: 255, b: 255 },
  { name: 'Pale Turquoise', r: 175, g: 238, b: 238 },
  { name: 'Dark Slate Gray', r: 47, g: 79, b: 79 },
  { name: 'Dim Gray', r: 105, g: 105, b: 105 },
  { name: 'Slate Gray', r: 112, g: 128, b: 144 },
  { name: 'Light Slate Gray', r: 119, g: 136, b: 153 },
  { name: 'Light Steel Blue', r: 176, g: 196, b: 222 },
  { name: 'Dark Olive Green', r: 85, g: 107, b: 47 },
  { name: 'Olive Drab', r: 107, g: 142, b: 35 },
];

/**
 * Find the closest named color for the given RGB values using Euclidean
 * distance in RGB space.
 *
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string} Human-readable color name
 */
export function getColorName(r, g, b) {
  let closest = COLOR_LIST[0];
  let minDistance = Infinity;

  for (const color of COLOR_LIST) {
    const dr = r - color.r;
    const dg = g - color.g;
    const db = b - color.b;
    const distance = dr * dr + dg * dg + db * db;
    if (distance < minDistance) {
      minDistance = distance;
      closest = color;
    }
  }

  return closest.name;
}
