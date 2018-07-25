"use strict";
/**
 * This content is released under The MIT License
 *
 * Copyright (c) 2018 Sopar Sihotang
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @package       antask
 * @author        Sopar Sihotang <soparsihotang@gmail.com>
 * @copyright     2018 Sopar Sihotang
 * @license       http://www.opensource.org/licenses/MIT
 */

module.exports = function (opts = {}) {
  const plugins = opts.plugins || [];
  const config = {
    module: {
      rules: [{
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          // Use the bundled config so that module syntax is passed through
          // for Webpack.
          envName: "standalone",
        },
      }, ],
    },
    node: {
      // Mock Node.js modules that Babel require()s but that we don't
      // particularly care about.
      fs: "empty",
      module: "empty",
      net: "empty",
    },
    output: {
      filename: opts.filename,
      library: opts.library,
      libraryTarget: "umd",
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": '"production"',
        "process.env": JSON.stringify({
          NODE_ENV: "production"
        }),
        BABEL_VERSION: JSON.stringify(babelVersion),
        VERSION: JSON.stringify(version),
      }),
      /*new webpack.NormalModuleReplacementPlugin(
        /..\/..\/package/,
        "../../../../src/babel-package-shim"
      ),*/
      new webpack.optimize.ModuleConcatenationPlugin(),
    ].concat(plugins),
    resolve: {
      plugins: [
        // Dedupe packages that are used across multiple plugins.
        // This replaces DedupePlugin from Webpack 1.x
        new RootMostResolvePlugin(__dirname, true),
      ],
    },
  };
};
