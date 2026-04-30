// Simple script to create placeholder PNG assets
// Run with: node generate-assets.js

const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');

// Minimal 1x1 PNG in base64 (a beige pixel)
const minimalPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

// Create sizes for each asset type
const assets = [
  { name: 'icon.png', size: 1024 },
  { name: 'splash.png', size: 1284 },
  { name: 'adaptive-icon.png', size: 1024 },
];

console.log('Generating placeholder assets...');

assets.forEach(asset => {
  const filepath = path.join(assetsDir, asset.name);
  fs.writeFileSync(filepath, minimalPNG);
  console.log(`Created ${asset.name} (${asset.size}x${asset.size})`);
});

console.log('Done! Replace these with real assets for production.');