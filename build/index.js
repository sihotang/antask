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

const chokidar = require("chokidar");
const path = require("path");
const rollup = require("rollup");
const babel = require("rollup-plugin-babel");
const buble = require("rollup-plugin-buble");
const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");
const builtins = require("rollup-plugin-node-builtins");
const replace = require("rollup-plugin-replace");
const isProd = process.env.NODE_ENV === "production";
const version = process.env.VERSION || require("../package.json").version;

const build = function(opts) {
  rollup
    .rollup({
      input: opts.input,
      format: "cjs",
      plugins: (opts.plugins || []).concat([
        // buble(),
        // builtins(),
        // commonjs(),
        // nodeResolve(),
        // replace({
        //   __VERSION__: version,
        // })
        babel({
          exclude: "node_modules/**",
        }),
        commonjs({
          namedExports: {
            // left-hand side can be an absolute path, a path
            // relative to the current directory, or the name
            // of a module in node_modules
            'node_modules/commander/index.js': ['command', 'commander', 'program'],
            'node_modules/merge-stream/index.js': ['merge']
          }
        }),
        nodeResolve(),
      ]),
    })
    .then(function(bundle) {
      var dest = "lib/" + (opts.output || opts.input);

      console.log(dest);
      bundle.write({
        format: "cjs",
        external: ["fs", "colorful", "chalk", "merge-stream"],
        file: dest,
        strict: false,
      });
    })
    .catch(function(err) {
      console.error(err);
    });
};

const buildCLI = function () {
  build({ input: "src/cli/index.js", output: "index.js" });
  build({ input: "src/cli/run.js", output: "run.js" });
};

const buildTasks = function () {
  var tasks = [
    { name: 'build', input: 'build/index.js' },
    { name: 'clean', input: 'clean.js' },
  ]

  tasks.forEach(item => {
    build({
      input: "src/tasks/" + item.input,
      output: "tasks/" + item.name + ".js",
    });
  });
};

const buildUtils = function () {
  build({ input: "src/utils/index.js", output: "utils.js" });
};

const buildGulp = function () {
  build({ input: "src/gulpfile.js", output: "gulpfile.js" });
}

if (!isProd) {
  chokidar
    .watch(['src/cli', 'src/tasks', 'src/utils', 'src'], {
      atomic: true,
      awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 100,
      }
    })
    .on('change', p => {
      console.log('[watch] ', p);
      const dirs = p.split(path.sep);
      if (dirs[1] === 'src') {
        buildGulp();
      } else if (dirs[1] === 'src/cli') {
        buildCLI();
      } else if (dirs[1] === 'src/utils') {
        buildUtils();
      } else if (dirs[2]) {
        const name = path.basename(dirs[2], '.js');
        const input = `src/tasks/${name}${/\.js/.test(dirs[2]) ? "" : "/index"}.js`;

        build({ input, output: "tasks/" + name + ".js" });
      }
    })
    .on('ready', () => {
      console.log('[start]')
      buildCLI();
      buildTasks();
      buildUtils();
      buildGulp();
    });
} else {
  buildCLI();
  buildTasks();
  buildUtils();
  buildGulp();
}
