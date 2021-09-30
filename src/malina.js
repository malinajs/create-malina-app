#!/usr/bin/env node

import sade from 'sade';
import pkg from './../package.json';
import {getAppName,getTemplateRepo} from './prompts';
import {showMalinaBanner} from './banner';
import {loadTemplate,installDependencies} from './files';
import {spinner} from './spinner';
import { bold, italic, yellow, cyan } from 'picocolors';

const cli = sade('malina [name]', true);

cli
  .version(pkg.version)
  .describe('Creates new Malina.js app')
  .example('')
  .example('my-new-app')
  .action(async dir => {
    let stop;

    showMalinaBanner();
    try{
      const name = await getAppName(dir);
      const template = await getTemplateRepo(dir);

      stop = spinner('Downloading template',1);
        await loadTemplate(template,name);
      stop(true);

      stop = spinner('Installing dependencies',2);
        await installDependencies(name);
      stop(true);

      console.log(bold('Congratulations, your app is ready!'));
      console.log(`Just run ${italic(yellow('npm run dev'))} inside app's directory ${italic(cyan(name))}.`);
      process.exit(0);
    }catch(err){
      if(stop) stop(false);
      console.log(`${bold('Something wrong! Got the error:')}\n${err.message}`);
      process.exit(1);
    }
    
  })
.parse(process.argv);