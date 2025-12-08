#!/usr/bin/env node

/**
 * Dashboard Generator CLI
 *
 * Usage:
 *   npx dashboard-gen create    - Create a new dashboard project
 *   npx dashboard-gen entity    - Add an entity to an existing project
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Get command and args
const args = process.argv.slice(2);
const command = args[0] || 'create';

// Build plop command
const plopBin = join(rootDir, 'node_modules', '.bin', 'plop');
const plopfile = join(rootDir, 'plopfile.js');

try {
  // Run plop with the specified generator
  execSync(`node ${plopBin} --plopfile ${plopfile} ${command}`, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
} catch (error) {
  // Plop handles its own errors, just exit
  process.exit(error.status || 1);
}
