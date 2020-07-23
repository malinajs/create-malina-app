import builtins from 'builtin-modules';
import {terser} from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

const dev = !!process.env.ROLLUP_WATCH;

const external = builtins.concat(dev ? Object.keys(pkg.devDependencies || {}) : []);

export default [{
    input: 'src/malina.js',        
    output: {
        file: pkg.bin.malina,
        format: 'cjs',
        banner: '#!/usr/bin/env node'
    },
    external,
    plugins: [
        json(),
        !dev && resolve(),
        !dev && commonjs(),
        !dev && terser(),
    ],
    watch: {
        clearScreen: false
    },
    onwarn(err){
        if(err.code !== 'CIRCULAR_DEPENDENCY') console.log(err.toString());
    }
}]