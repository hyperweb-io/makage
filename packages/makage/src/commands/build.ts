import { runClean } from './clean';
import { runBuildTs } from './buildTs';
import { runAssets } from './assets';

export async function runBuild(args: string[]) {
  console.log('[makage] starting full build...\n');

  await runClean([]);
  await runBuildTs(args);
  await runAssets([]);

  console.log('\n[makage] build complete!');
}
