const typescript = require('@rollup/plugin-typescript');
const pkg = require('./package.json');
const path = require('path');
module.exports = [{
    input: path.resolve(__dirname, './src/index.ts'),
    output: [
        {
            name: pkg.config.name,
            file: path.resolve(__dirname, './dist/index.js'),
            format: 'cjs',
            sourcemap: true
        },
        {
            name: pkg.config.name,
            file: path.resolve(__dirname, './dist/index.esm.js'),
            format: 'esm',
            sourcemap: true
        },
        {
            name: pkg.config.name,
            file: path.resolve(__dirname, './dist/index.umd.js'),
            format: 'umd',
            sourcemap: true
        },
    ],
    external: Object.keys(pkg.dependencies).concat(Object.keys(pkg.peerDependencies)),
    plugins: [
        typescript({ tsconfig: path.resolve(__dirname, './tsconfig.lib.json') })
    ]
}];
