#!/usr/bin/env node

import { buildTokens } from './build-tokens.mjs';
import { generateStories } from './generate-stories.mjs';
import { watch } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRIMITIVES_DIR = join(__dirname, '../packages/tokens/src/primitives');
const COMPONENTS_DIR = join(__dirname, '../packages/tokens/src/components');

/**
 * Build all tokens and stories
 */
async function buildAll() {
  console.log('🚀 Building all design tokens and stories...\n');
  
  try {
    await buildTokens();
    console.log('');
    await generateStories();
    console.log('\n✨ All builds complete!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

/**
 * Watch mode for development
 */
function startWatchMode() {
  console.log('👀 Watching for token changes...\n');
  
  let timeout;
  const debounce = (fn, delay) => {
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };
  
  const debouncedBuild = debounce(async () => {
    console.log('\n📝 Token files changed, rebuilding...');
    await buildAll();
    console.log('👀 Watching for changes...\n');
  }, 300);
  
  // Watch both primitives and components directories
  watch(PRIMITIVES_DIR, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.json')) {
      debouncedBuild();
    }
  });
  
  watch(COMPONENTS_DIR, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.json')) {
      debouncedBuild();
    }
  });
  
  console.log('Press Ctrl+C to stop watching\n');
}

// Parse command line arguments
const args = process.argv.slice(2);
const watchMode = args.includes('--watch') || args.includes('-w');

if (watchMode) {
  // Initial build then watch
  buildAll().then(() => {
    startWatchMode();
  });
} else {
  // Single build
  buildAll();
}
