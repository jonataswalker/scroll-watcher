import json from 'rollup-plugin-json';
import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

var pkg = require('./package.json');

export default {
  format: 'umd',
  entry: pkg.rollup.entry,
  dest: pkg.rollup.dest,
  moduleName: pkg.rollup.moduleName,
  plugins: [
    json({
      exclude: [ 'node_modules/**' ]
    }),
    buble({
      exclude: ['node_modules/**', '*.json']
    }),
    commonjs({
      namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        'tiny-emitter': [ 'TinyEmitter' ]
      }
    }),
    nodeResolve()
  ]
}
