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
 * @package       @antask/babel-preset
 * @author        Sopar Sihotang <soparsihotang@gmail.com>
 * @copyright     2018 Sopar Sihotang
 * @license       http://www.opensource.org/licenses/MIT
 */

import babel from 'gulp-babel';
import filter from 'gulp-filter';
import newer from 'gulp-newer';
import merge from 'merge-stream';
import { basename, resolve } from 'path';
import { Logger, rename, Source } from '../../utils';

export default function (stream, excludes = []) {
  return merge(sources.map(source => {
    let stream = gulp.src(Source.glob(basename(source)), {
      base: source
    });

    if (excludes.length > 0) {
      const filters = excludes.map(p => `!**/${p}/**`);
      filters.unshift('**');
      stream = stream.pipe(filter(filters));
    }

    return stream
      .pipe(Logger.error())
      .pipe(newer({ dest: source, map: Source.swap }))
      .pipe(Logger.compilation())
      .pipe(babel())
      .pipe(rename(file => resolve(file.base, Source.swap(file.relative))))
      .pipe(gulp.dest(source));
  }));
};
