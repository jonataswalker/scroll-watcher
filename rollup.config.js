var fs = require('fs'),
    buble = require('rollup-plugin-buble'),
    resolve = require('rollup-plugin-node-resolve'),
    commonjs = require('rollup-plugin-commonjs'),
    pkg = require('./package.json');

var banner = fs.readFileSync('banner.js', 'utf-8')
  .replace('${name}', pkg.name)
  .replace('${description}', pkg.description)
  .replace('${homepage}', pkg.homepage)
  .replace('${version}', pkg.version)
  .replace('${time}', new Date());

export default {
  format: 'umd',
  entry: pkg.build.entry,
  dest: pkg.build.dest,
  moduleName: pkg.build.moduleName,
  banner: banner,
  plugins: [
    resolve({ browser: true }),
    commonjs({ namedExports: { 'tiny-emitter': ['TinyEmitter'] }}),
    buble()
  ]
};
