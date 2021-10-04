const path = require('path');
const fs = require('fs-extra');
const { test } = require('uvu');
const { ok } = require('uvu/assert');
const storyCLI = require('./cli');

const TEST_DIR = path.resolve(path.join(__dirname,'__tmp'));
const BIN = 'node '+path.resolve(path.join('bin','malina'));

test('Prepare', async () => {
    fs.removeSync(TEST_DIR);
    fs.mkdirSync(TEST_DIR);
    ok(fs.existsSync(TEST_DIR),'Tmp test dir created');
});

test('Default run', async () => {

    const name = 'test-malina-default';
    const appdir = path.join(TEST_DIR,name);
    const somefile = path.join(appdir,'package.json');
    const somemodule = path.join(appdir,'node_modules','malinajs');

    const result = await storyCLI(`${BIN}`,[
        { 
            wait:'Name of a new Malina.js app',
            reply: [name,'\x0D']
        },
        { 
            wait:'Starter template',
            reply:'\x0D',
        },
        { 
            wait:'1. Downloading template. ✔ Done!'
        },
        { 
            wait:'2. Installing dependencies. ✔ Done!'
        },
        { 
            wait:'Congratulations, your app is ready!'
        },
    ],{cwd:TEST_DIR});
    ok(result.err !== 'Incomplete story','Story is ok');

    ok(fs.existsSync(appdir),'App directory created');
    ok(fs.existsSync(somefile),'Template downloaded');
    ok(fs.existsSync(somemodule),'Dependencies installed');
});

test('Select another template', async () => {

    const name = 'test-malina-app-tpl';
    const appdir = path.join(TEST_DIR,name);
    const somefile = path.join(appdir,'package.json');
    const somemodule = path.join(appdir,'node_modules','esbuild');

    const result = await storyCLI(`${BIN}`,[
        { 
            wait:'Name of a new Malina.js app',
            reply: [name,'\x0D']
        },
        { 
            wait:'Starter template',
            reply:['\033[B','\x0D'],
        },
        { 
            wait:'1. Downloading template. ✔ Done!'
        },
        { 
            wait:'2. Installing dependencies. ✔ Done!'
        },
        { 
            wait:'Congratulations, your app is ready!'
        },
    ],{cwd:TEST_DIR});
    ok(result.err !== 'Incomplete story','Story is ok');

    ok(fs.existsSync(appdir),'App directory created');
    ok(fs.existsSync(somefile),'Template downloaded');
    ok(fs.existsSync(somemodule),'Dependencies installed');
});

test('Invalid name', async () => {

    const name = '%invalid%';

    const result = await storyCLI(`${BIN}`,[
        { 
            wait:'Name of a new Malina.js app',
            reply:[name,'\x0D'],
        },
        { 
            wait:'Use only letters, digits and hyphen'
        }
    ],{cwd:TEST_DIR,timeout:3000});
    ok(result.err !== 'Incomplete story','Story is ok');
});

test('Run with overwrite when directory exists', async () => {

    const name = 'existent_dir';
    const appdir = path.join(TEST_DIR,name);
    const somefile = path.join(appdir,'package.json');
    const somemodule = path.join(appdir,'node_modules','malinajs');

    fs.mkdirSync(appdir);
    ok(fs.existsSync(appdir),'Empty dir created');

    const result = await storyCLI(`${BIN}`,[
        { 
            wait:'Name of a new Malina.js app',
            reply:[name,'\x0D'],
        },
        { 
            wait:'already exists! Overwrite?',
            reply:['y','\x0D']
        },
        { 
            wait:'Starter template',
            reply:'\x0D',
        },
        { 
            wait:'Congratulations, your app is ready!'
        },
    ],{cwd:TEST_DIR});

    ok(result.err !== 'Incomplete story','Story is ok');
    ok(fs.existsSync(appdir),'App directory created');
    ok(fs.existsSync(somefile),'Template downloaded');
    ok(fs.existsSync(somemodule),'Dependencies installed');
});

test('Run with dir in command line', async () => {

    const name = 'cli_dir';
    const appdir = path.join(TEST_DIR,name);
    const somefile = path.join(appdir,'package.json');
    const somemodule = path.join(appdir,'node_modules','malinajs');

    const result = await storyCLI(`${BIN} ${name}`,[
        { 
            wait:'Congratulations, your app is ready!'
        },
    ],{cwd:TEST_DIR});

    console.log(result);

    ok(result.err !== 'Incomplete story','Story is ok');
    ok(fs.existsSync(appdir),'App directory created');
    ok(fs.existsSync(somefile),'Template downloaded');
    ok(fs.existsSync(somemodule),'Dependencies installed');
});

test('Clean up', async () => {
    fs.removeSync(TEST_DIR);
    ok(!fs.existsSync(TEST_DIR),'all tmd files was removed');
});


test.run();
