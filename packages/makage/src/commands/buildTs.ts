import { spawn } from 'node:child_process';

function run(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
    child.on('exit', code => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

export async function runBuildTs(args: string[]) {
  const isDev = args.includes('--dev');

  const tscArgs = isDev ? ['--declarationMap'] : [];
  const esmArgs = ['-p', 'tsconfig.esm.json', ...(isDev ? ['--declarationMap'] : [])];

  console.log(`[makage] tsc (CJS)${isDev ? ' [dev mode]' : ''}`);
  await run('tsc', tscArgs);

  console.log(`[makage] tsc (ESM)${isDev ? ' [dev mode]' : ''}`);
  await run('tsc', esmArgs);
}
