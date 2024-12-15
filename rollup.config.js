const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const pkg = require('./package.json');
const routerRollupConfig = require('./router/rollup.config.cjs');
module.exports = [{
    input: './core/src/index.ts',
    output: [
        {
            name: '@centroidjs/web/core',
            file: `core/dist/index.cjs.js`,
            format: 'cjs',
            sourcemap: true
        },
        {
            name: '@centroidjs/web/core',
            file: `core/dist/index.esm.js`,
            format: 'esm',
            sourcemap: true
        },
        {
            name: '@centroidjs/web/core',
            file: `core/dist/index.umd.js`,
            format: 'umd',
            sourcemap: true
        },
    ],
    external: Object.keys(pkg.dependencies).concat('@centroidjs/core'),
    plugins: [
        typescript({ tsconfig: './core/tsconfig.lib.json' })
    ]
}, {
    input: './router/src/index.ts',
    output: [
        {
            name: '@centroidjs/web/router',
            file: `router/dist/index.js`,
            format: 'cjs',
            sourcemap: true
        },
        {
            name: '@centroidjs/web/router',
            file: `router/dist/index.esm.js`,
            format: 'esm',
            sourcemap: true
        },
        {
            name: '@centroidjs/web/router',
            file: `router/dist/index.umd.js`,
            format: 'umd',
            sourcemap: true
        },
    ],
    external: Object.keys(pkg.dependencies).concat('@centroidjs/core'),
    plugins: [
        typescript({ tsconfig: './router/tsconfig.lib.json' })
    ]
}, ...routerRollupConfig];
