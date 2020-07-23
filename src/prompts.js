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
        validate:v=> /^[a-zA-Z-_]+$/.test(v) ? true : 'Use only letters, digits and hyphen',
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