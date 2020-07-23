const path = require('path');
const fs = require('fs-extra');
const { test,done } = require('tape-modern');
const storyCLI = require('./cli');

const TEST_DIR = path.resolve(path.join(__dirname,'__tmp'));
const BIN = 'node '+path.resolve(path.join('bin','malina'));

test('Prepare', async t => {
    fs.removeSync(TEST_DIR);
    fs.mkdirSync(TEST_DIR);
    t.pass('Tmp test dir created');
});

test('Default run', async t => {

    const name = 'test-malina-app1';
    const appdir = path.join(TEST_DIR,name);
    const somefile = path.join(appdir,'package.json');
    const somemodule = path.join(appdir,'node_modules','malinajs');

    const result = await storyCLI(`${BIN}`,[
        { 
            wait:'Name of a new Malina.js app',
            reply:name,
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
    t.ok(result.err !== 'Incomplete story','Story is ok');

    t.ok(fs.existsSync(appdir),'App directory created');
    t.ok(fs.existsSync(somefile),'Template downloaded');
    t.ok(fs.existsSync(somemodule),'Dependencies installed');
});

test('Invalid name', async t => {

    const name = '%invalid%';

    const result = await storyCLI(`${BIN}`,[
        { 
            wait:'Name of a new Malina.js app',
            reply:name,
        },
        { 
            wait:'Use only letters, digits and hyphen'
        }
    ],{cwd:TEST_DIR,timeout:3000});
    t.ok(result.err !== 'Incomplete story','Story is ok');
});

test('Run with overwrite when directory exists', async t => {

    const name = 'existent_dir';
    const appdir = path.join(TEST_DIR,name);
    const somefile = path.join(appdir,'package.json');
    const somemodule = path.join(appdir,'node_modules','malinajs');

    fs.mkdirSync(appdir);
    t.ok(fs.existsSync(appdir),'Empty dir created');

    const result = await storyCLI(`${BIN}`,[
        { 
            wait:'Name of a new Malina.js app',
            reply:name,
        },
        { 
            wait:'already exists! Overwrite?',
            reply:'y'
        },
        { 
            wait:'Congratulations, your app is ready!'
        },
    ],{cwd:TEST_DIR});

    t.ok(result.err !== 'Incomplete story','Story is ok');
    t.ok(fs.existsSync(appdir),'App directory created');
    t.ok(fs.existsSync(somefile),'Template downloaded');
    t.ok(fs.existsSync(somemodule),'Dependencies installed');
});

test('Run with dir in command line', async t => {

    const name = 'cli_dir';
    const appdir = path.join(TEST_DIR,name);
    const somefile = path.join(appdir,'package.json');
    const somemodule = path.join(appdir,'node_modules','malinajs');

    const result = await storyCLI(`${BIN} ${name}`,[
        { 
            wait:'Congratulations, your app is ready!'
        },
    ],{cwd:TEST_DIR});

    t.ok(result.err !== 'Incomplete story','Story is ok');
    t.ok(fs.existsSync(appdir),'App directory created');
    t.ok(fs.existsSync(somefile),'Template downloaded');
    t.ok(fs.existsSync(somemodule),'Dependencies installed');
});

test('Clean up', async t => {
    fs.removeSync(TEST_DIR);
    t.pass('all tmd files was removed');
});

