/**
 * This content is released under The MIT License
 *
 * Copyright (c) 2018 Sopar Sihotang
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the 'Software'), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
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

import configAirBnbBase from 'eslint-config-airbnb-base';

export default {
  extends: [
    configAirBnbBase,
    'eslint-config-airbnb-base/rules/strict',
  ].map(require.resolve),
  rules: {
    // node
    // require all requires be top-level
    // https://eslint.org/docs/rules/global-require
    'global-require': 'off',

    // style
    // this option enforces minimum and maximum identifier lengths
    // (variable names, property names etc.)
    'id-length': 'off',

    // disallow dangling underscores in identifiers
    'no-underscore-dangle': ['error', {
      allowAfterThis: true,
      allow: [
        '_context',
        '_currentElement',
        '_instance',
        '_reactInternalComponent',
        '_reactInternalInstance',
        '_renderedChildren',
        '_renderedComponent',
        '_renderedNodeType',
        '_state',
        '_store',
        '_stringText',
      ],
    }],

    // require a capital letter for constructors
    'new-cap': ['error', {
      capIsNewExceptions: ['AND'],
    }],

    // imports
    // Forbid require() calls with expressions
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-dynamic-require.md
    'import/no-dynamic-require': 'off',

    // disallow non-import statements appearing before import statements
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/first.md
    'import/first': 'off',

    // strict
    // babel inserts `'use strict';` for us
    strict: ['error', 'never'],
  }
};
