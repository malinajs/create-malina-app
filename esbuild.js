const { build } = require('esbuild');
const pkg = require('./package.json');
const fs = require('fs');


if(process.argv.includes('--dev')){
    bundle(true);
    fs.watch('src',()=>{
        console.log('Sources changed...');
        bundle(true);
    });
}else{
    bundle(false);
}

function bundle(dev){
    build({
        entryPoints: ['src/malina.js'],
        platform: 'node',
        format: "cjs",
        outfile: pkg.bin.malina,
        minify: !dev,
        bundle: true,
    });
}
