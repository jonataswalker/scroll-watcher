import { readFileSync } from 'fs';
import { minify } from 'uglify-es';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import bundleSize from 'rollup-plugin-filesize';
import uglify from 'rollup-plugin-uglify';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

const lintOpts = {
  // extensions: ['js'],
  exclude: ['**/*.json'],
  cache: true,
  throwOnError: true
};

const banner = readFileSync('build/banner.js', 'utf-8')
  .replace('${name}', pkg.name)
  .replace('${description}', pkg.description)
  .replace('${homepage}', pkg.homepage)
  .replace('${version}', pkg.version)
  .replace('${time}', new Date());

export default [
  {
    banner,
    input: './src/main.js',
    output: {
      file: './dist/scroll-watcher.min.js',
      format: 'umd',
      name: 'ScrollWatcher',
    },
    plugins: [
      eslint(lintOpts),
      bundleSize(),
      resolve({ browser: true }),
      commonjs({ namedExports: { 'tiny-emitter': ['TinyEmitter'] } }),
      buble({ target: { ie: 11 } }),
      uglify({ output: { comments: /^!/ } }, minify)
    ],
  },
  {
    banner,
    input: './src/main.js',
    output: {
      file: './dist/scroll-watcher.js',
      format: 'umd',
      name: 'ScrollWatcher',
    },
    plugins: [
      eslint(lintOpts),
      bundleSize(),
      resolve({ browser: true }),
      commonjs({ namedExports: { 'tiny-emitter': ['TinyEmitter'] } }),
      buble({ target: { ie: 11 } })
    ],
  }
];
