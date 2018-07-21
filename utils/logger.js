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

const chalk = require("chalk");
const gutil = require("gulp-util");
const plumber = require('gulp-plumber');
const through = require("through2");

function compilationLogger(rollup) {
  return through.obj(function (file, enc, callback) {
    gutil.log(
      `Compiling '${chalk.cyan(file.relative)}'${
        rollup ? " with rollup " : ""
      }...`
    );
    callback(null, file);
  });
}

function errorsLogger() {
  return plumber({
    errorHandler(err) {
      gutil.log(err.stack);
    },
  });
}

module.exports = {
  compilationLogger,
  errorsLogger,
};
