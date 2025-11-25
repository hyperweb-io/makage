import fs from 'node:fs/promises';
import path from 'node:path';

interface CopyOptions {
  flat: boolean;
  footer: boolean;
}

// Very simple arg parser: last non-flag is dest, the rest are sources
export async function runCopy(args: string[]) {
  const opts: CopyOptions = { flat: false, footer: false };
  const positional: string[] = [];

  for (const arg of args) {
    if (arg === '--flat') {
      opts.flat = true;
    } else if (arg === '--footer') {
      opts.footer = true;
    } else {
      positional.push(arg);
    }
  }

  if (positional.length < 2) {
    throw new Error('copy requires at least one source and one destination');
  }

  const dest = positional[positional.length - 1];
  const sources = positional.slice(0, -1);

  await fs.mkdir(dest, { recursive: true });

  for (const src of sources) {
    const stat = await fs.stat(src);
    if (stat.isDirectory()) {
      throw new Error(`Directories not yet supported as sources: ${src}`);
    }

    const baseName = path.basename(src);
    const target = opts.flat
      ? path.join(dest, baseName)
      : path.join(dest, src);

    const targetDir = path.dirname(target);
    await fs.mkdir(targetDir, { recursive: true });

    // If --footer is specified and this is README.md, concatenate with footer
    if (opts.footer && baseName === 'README.md') {
      await copyReadmeWithFooter(src, target);
    } else {
      await fs.copyFile(src, target);
      console.log(`[makage] copied ${src} -> ${target}`);
    }
  }
}

async function copyReadmeWithFooter(readmePath: string, target: string) {
  const readme = await fs.readFile(readmePath, 'utf8');

  // Look for FOOTER.md in the monorepo root (../../FOOTER.md relative to current dir)
  const footerPath = path.join('../../FOOTER.md');

  let footer: string | null = null;
  try {
    footer = await fs.readFile(footerPath, 'utf8');
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      console.log(`[makage] warning: ${footerPath} not found, copying README without footer`);
    } else {
      throw err;
    }
  }

  const combined = footer
    ? `${readme.trimEnd()}\n\n---\n\n${footer.trim()}\n`
    : readme;

  await fs.writeFile(target, combined, 'utf8');

  if (footer) {
    console.log(`[makage] copied README with footer: ${readmePath} + ${footerPath} -> ${target}`);
  } else {
    console.log(`[makage] copied ${readmePath} -> ${target}`);
  }
}
