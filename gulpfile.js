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
 * @package       @sihotang/bait
 * @author        Sopar Sihotang <soparsihotang@gmail.com>
 * @copyright     2018 Sopar Sihotang
 * @license       http://www.opensource.org/licenses/MIT
 */

var gulp = require("gulp");
var path = require("path");
var { map } = require("lodash/collection");
var build = require("./tasks/build");
var clean = require("./tasks/clean");

var workspaces = ["packages"];

var sources = workspaces.map(source => {
  return {
    src: path.join(__dirname, source),
    dbg: path.join(__dirname, source, "/*/npm-debug*"),
    lib: path.join(__dirname, source, "/*/lib"),
    tmp: path.join(__dirname, source, "/*/test/tmp")
  }
});

gulp.task("clean:lib", function () {
  return clean(gulp, map(sources, "lib"))
});
gulp.task("clean:test", function () {
  return clean(gulp, map(sources, "tmp"))
});
gulp.task("clean", gulp.series("clean:test", function () {
  return clean(gulp, map(sources, "dbg"))
}));
gulp.task("build", gulp.series("clean", "clean:lib", function () {
  return build.babel(gulp, map(sources, "src"));
}));
/**
 * Aliases
 */
gulp.task("tsc", gulp.series("build:types"));
gulp.task("default", gulp.series("build"));
