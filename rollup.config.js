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

/*  entry: pkg.build.entry,
  plugins: [
  ]
}).then(bundle => {
  const resultBundle = bundle.generate({
    format: 'umd',
    moduleName: pkg.build.moduleName,
    dest: pkg.build.dest,
  });

  const minified = minify(resultBundle.code, {
    fromString: true,
    outSourceMap: pkg.build.destMinMap.replace('build/', ''),
    warnings: true,
    mangle: true,
    output: { comments: /^!/ },
    compress: {
      screw_ie8: true,
      drop_console: true
    }
  });

  fs.writeFileSync(pkg.build.dest, resultBundle.code);
  fs.writeFile(pkg.build.destMin, minified.code, (err) => {
    if (err) throw err;

    const bundleSize = bytes(Buffer.byteLength(resultBundle.code));
    const minSize = bytes(Buffer.byteLength(minified.code));
    const bundleGzip = bytes(gzip.sync(resultBundle.code));
    const minGzip = bytes(gzip.sync(minified.code));

    console.log(boxen(
      chalk.green.bold('Bundle size: ') +
      chalk.yellow.bold(bundleSize) + ', ' +
      chalk.green.bold('Gzipped size: ') +
      chalk.yellow.bold(bundleGzip), { padding: 1 }
    ));
    console.log(boxen(
      chalk.green.bold('Minified size: ') +
      chalk.yellow.bold(minSize) + ', ' +
      chalk.green.bold('Gzipped size: ') +
      chalk.yellow.bold(minGzip), { padding: 1 }
    ));

    fs.writeFileSync(pkg.build.destMinMap, minified.map);
  });
});*/
