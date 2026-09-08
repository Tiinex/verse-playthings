import {runRelease} from '@tiinex/core/node/release';
if(process.argv.includes('--help'))console.log('Master-only auto publish. Before 1.0, automatic breaking changes use minor; [release:major] explicitly opts in. Local preview: npm run release:preview.');
else await runRelease({argv:['preview']});
