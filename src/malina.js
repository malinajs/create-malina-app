import sade from 'sade';
import pkg from './../package.json';

const cli = sade('malina [dir]', true);

cli
  .version(pkg.version)
  .describe('Creates new MalinaJS')
  .example('')
  .example('my-new-app')
  .action((dir, opts) => {
    console.log(dir,opts);
  })
.parse(process.argv);