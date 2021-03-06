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

import { execSync, spawnSync } from 'child_process';
import path from 'path';

const SEPARATOR = process.platform === 'win32' ? ';' : ':';
// const envModules = { ...process.env };

envModules.PATH = path.resolve(process.cwd(), 'node_modules/.bin') + SEPARATOR + process.env.PATH;

const exec = function exec(command, name, cwd = process.cwd()) {
  return execSync(command, {
    cwd,
    env: process.env,
    stdio: 'inherit',
  });
};

const spawn = function spawn(command, args = [], cwd = process.cwd()) {
  return spawnSync(command, args, {
    cwd,
    env: process.env,
    stdio: 'inherit',
  }).on('error', process.exit);
};

export { exec as execSync, spawn as spawnSync };
