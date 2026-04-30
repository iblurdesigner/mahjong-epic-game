// Seeded Random Number Generator (Mulberry32)
// Provides reproducible random sequences for level generation

/**
 * Create a seeded random number generator using mulberry32 algorithm
 * @param seed - String seed to initialize the PRNG
 * @returns Function that returns numbers between 0 and 1
 */
export function createSeededRandom(seed: string): () => number {
  // Convert string seed to number using cyrb53 for better mixing
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  
  // Mix into mulberry32 state
  let a = h >>> 0;
  let b = h >>> 0;
  let c = h >>> 0;
  let d = h >>> 0;
  
  return function(): number {
    // Mulberry32 mixing function
    let t = (a + 0x6D2B79F5) | 0;
    a = b;
    b = b << 9;
    b ^= b >>> 9;
    let c1 = c + (c << 3) | 0;
    c = c << 21;
    c ^= c >>> 7;
    d = (d + t + (c1 ^ c)) | 0;
    t ^= d >>> 14;
    c = (c + (t ^ d >>> 11)) | 0;
    
    // Generate random number [0, 1)
    return ((c ^ (c >>> 15)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a random integer between min (inclusive) and max (exclusive)
 * @param seed - Seed string for reproducibility
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (exclusive)
 * @returns Random integer
 */
export function seededRandom(seed: string, min: number, max: number): number {
  const random = createSeededRandom(seed);
  return Math.floor(random() * (max - min)) + min;
}

/**
 * Shuffle an array using a seeded random generator
 * @param array - Array to shuffle
 * @param seed - Seed for reproducibility
 * @returns New shuffled array
 */
export function shuffleSeeded<T>(array: T[], seed: string): T[] {
  const result = [...array];
  const random = createSeededRandom(seed);
  
  // Fisher-Yates shuffle with seeded random
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}