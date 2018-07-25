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

module.exports = function (gulp, name, exportName, pathname, version, plugins) {
  return merge(
    packages.map(pkg => {
      const base = path.join(__dirname, pkg);

      let stream = gulp.src(getGlobFromPackage(pkg), {
        base: base
      });

      if (excludes.length > 0) {
        const filters = excludes.map(p => `!**/${p}/**`);
        filters.unshift("**");
        stream = stream.pipe(filter(filters));
      }

      return stream
        .pipe(errorsLogger())
        .pipe(newer({
          dest: base,
          map: swapSrcWithLib
        }))
        .pipe(compilationLogger())
        .pipe(babel())
        .pipe(rename(file => path.resolve(file.base, swapSrcWithLib(file.relative))))
        .pipe(gulp.dest(base));
    }));
};
