import prompts from 'prompts';
import { isDir } from './files';

export async function getAppName(dir){

    let opts = {
        onCancel:_=>process.exit(0)
    }

    const name = dir ? dir : (await prompts({
        type: 'text',
        name: 'name',
        message: 'Name of a new Malina.js app',
        validate:v=> /^[a-zA-Z-_0-9]+$/.test(v) ? true : 'Use only letters, digits and hyphen',
        initial: 'malina-app'
    },opts)).name;

    if(isDir(name)) {
        const overwrite = (await prompts({
            type: 'confirm',
            name: 'overwrite',
            message:`Directory '${name}' already exists! Overwrite?`,
            initial: false,
        },opts)).overwrite;

        if(!overwrite) return await getAppName();
    }

    return name;
}

export async function getTemplateRepo(dir){

    const DEFAULT = 'malinajs/template';

    if(dir) return DEFAULT;

    let opts = {
        onCancel:_=>process.exit(0)
    }

    return (await prompts({
        type: 'select',
        name: 'template',
        message: 'Starter template',
        choices: [
            { title: 'Default', description: 'Recomended', value: DEFAULT },
            { title: 'Default (esbuild)', description: 'Based on ESBuild bundler', value: 'malinajs/template#esbuild' },
            { title: 'Desktop (electron)', description: 'Based on Electorn and ESBuild bundler', value: 'malinajs/template#electron' },
        ],
        initial: 0
    },opts)).template;
}