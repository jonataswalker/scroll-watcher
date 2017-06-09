import { readFileSync } from 'fs';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const pkg = require('../package.json');

const banner = readFileSync('build/banner.js', 'utf-8')
  .replace('${name}', pkg.name)
  .replace('${description}', pkg.description)
  .replace('${homepage}', pkg.homepage)
  .replace('${version}', pkg.version)
  .replace('${time}', new Date());

export default {
  banner,
  format: 'umd',
  entry: pkg.build.entry,
  dest: pkg.build.dest,
  moduleName: pkg.build.moduleName,
  plugins: [
    resolve({ browser: true }),
    commonjs({ namedExports: { 'tiny-emitter': ['TinyEmitter'] }}),
    buble()
  ]
};
