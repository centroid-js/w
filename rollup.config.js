const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const pkg = require('./package.json');
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
    external: Object.keys(pkg.dependencies),
    plugins: [
        typescript({ tsconfig: './core/tsconfig.lib.json' })
    ]
}, {
    input: './platform-server/src/index.ts',
    output: [
        {
            name: '@centroidjs/web/platform-server',
            file: `platform-server/dist/index.cjs.js`,
            format: 'cjs',
            sourcemap: true
        },
        {
            name: '@centroidjs/web/platform-server',
            file: `platform-server/dist/index.esm.js`,
            format: 'esm',
            sourcemap: true
        },
        {
            name: '@centroidjs/web/platform-server',
            file: `platform-server/dist/index.umd.js`,
            format: 'umd',
            sourcemap: true
        },
    ],
    external: Object.keys(pkg.dependencies)
        .concat('@centroidjs/web/core'),
    plugins: [
        typescript({ tsconfig: './platform-server/tsconfig.lib.json' })
    ]
}];
