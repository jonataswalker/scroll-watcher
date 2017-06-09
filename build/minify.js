var fs = require('fs'),
    path = require('path'),
    boxen = require('boxen'),
    chalk = require('chalk'),
    maxmin = require('maxmin'),
    UglifyJS = require('uglify-js'),
    pkg = require('../package.json');

const resolve = file => path.resolve(__dirname, file);

const dest = resolve('../' + pkg.build.dest);
const destMin = resolve('../' + pkg.build.destMin);
const destMinMap = resolve('../' + pkg.build.destMinMap);
const bundle = fs.readFileSync(dest, 'utf-8');

const minified = UglifyJS.minify(bundle, {
  sourceMap: {
    filename: path.basename(destMin),
    url: path.basename(destMinMap)
  },
  output: { comments: /^!/ }
});

fs.writeFile(destMin, minified.code, (err) => {
  if (err) throw err;

  const bundleSize = maxmin(bundle, bundle, true);
  const bundleMinSize = maxmin(minified.code, minified.code, true);

  // eslint-disable-next-line no-console
  console.log(boxen(
    chalk.green.bold('Bundle size: ') +
    chalk.yellow.bold(bundleSize.substr(bundleSize.indexOf(' → ') + 3)) +
    '\n' +
    chalk.green.bold('Minified size: ') +
    chalk.yellow.bold(bundleMinSize.substr(bundleMinSize.indexOf(' → ') + 3)),
    { padding: 1 }
  ));

  fs.writeFileSync(destMinMap, minified.map);
});
