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

const chalk = require("chalk");
const glob = require("glob");
const gulp = require("gulp");
const babel = require("gulp-babel");
const gclean = require("gulp-clean");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const gutil = require("gulp-util");
const { map } = require("lodash/collection");
const merge = require("merge-stream");
const path = require("path");
const through = require("through2");

const workspaces = ["./"];
const workspace = workspaces.map(source => {
  return {
    base: path.join(__dirname, source),
    debug: path.join(__dirname, source, "npm-debug*"),
    lib: path.join(__dirname, source, "lib"),
    src: path.join(__dirname, source, "src"),
    temp: path.join(__dirname, source, "test/tmp"),
  };
});

const buffer = {
  log: {
    error: function() {
      return plumber({
        errorHandler(err) {
          gutil.log(err.stack);
        },
      });
    },

    compilation: function() {
      return through.obj((file, enc, callback) => {
        gutil.log(`Compiling '${chalk.cyan(file.relative)}'...`);
        callback(null, file);
      });
    },
  },

  rename: function(fn) {
    return through.obj(function(file, enc, callback) {
      file.path = fn(file);
      callback(null, file);
    });
  },
};

const logger = {
  error: function (args) {
    console.log(chalk.gray(args));
  }
}

const source = {
  glob: function(dir) {
    let pattern = path.basename(dir) !== "src" ? `./${dir}/*/src/**/*.js` : "./src/**/*.js";

    return glob(pattern, function(err, files) {
      if (err) {
        logger.error(err);
        return;
      } else {
        return files;
      }
    }).pattern;
  },

  index: function(dir) {
    return `/${path.basename(dir)}/src/index.js`;
  },

  swap: function(dir, dest = "lib") {
    const parts = dir.split(path.sep);
    parts[0] = `${dest}`;
    // parts[1] = `${dest}`;

    return parts.join(path.sep);
  },
};

const build = function(ws) {
  return merge(
    ws.map(w => {
      console.log("glob: ");
      console.log(source.glob(w.src));
      return gulp
        .src(source.glob(w.src), { base: w.base })
        .pipe(buffer.log.error())
        .pipe(newer({ dest: w.base, map: source.swap }))
        .pipe(buffer.log.compilation())
        .pipe(babel())
        .pipe(buffer.rename(file =>
            path.resolve(file.base, source.swap(file.relative))
          ))
        .pipe(gulp.dest(w.base));
    })
  );
};

const clean = function(ws) {
  return merge(
    ws.map(w => {
      return gulp
        .src(w, { base: w, read: false, allowEmpty: true })
        .pipe(gclean());
    })
  );
};

gulp.task("clean:lib", function() {
  return clean(map(workspace, "lib"));
});

gulp.task("clean:test", function() {
  return clean(map(workspace, "temp"));
});

gulp.task(
  "clean",
  gulp.series("clean:test", function() {
    return clean(map(workspace, "debug"));
  })
);

gulp.task(
  "build",
  gulp.series("clean", "clean:lib", function() {
    return build(workspace);
  })
);

gulp.task("default", gulp.series("build"));
