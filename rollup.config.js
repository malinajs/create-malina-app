import builtins from 'builtin-modules';
import {terser} from 'rollup-plugin-terser';
import pkg from './package.json';

const dev = !!process.env.ROLLUP_WATCH;

export default [{
    input: 'src/malina.js',        
    output: {
        file: pkg.bin.malina,
        format: 'cjs',
        banner: '#!/usr/bin/env node'
    },
    external: [
        ...builtins,
        ...Object.keys(pkg.dependencies || {})
    ],
    plugins: [
        !dev && terser(),
    ],
    watch: {
        clearScreen: false
    }
}]