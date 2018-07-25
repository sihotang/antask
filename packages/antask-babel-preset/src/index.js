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

import {
  declare
} from '@babel/helper-plugin-utils';
import proposalObjectRestSpread from '@babel/plugin-proposal-object-rest-spread';
import transformModulesCommonJs from '@babel/plugin-transform-modules-commonjs';
import transformPropertyMutators from '@babel/plugin-transform-property-mutators';
import transformStrictMode from '@babel/plugin-transform-strict-mode';
import transformTemplateLiterals from '@babel/plugin-transform-template-literals';
import presetEnv from '@babel/preset-env';
import transformJscript from 'babel-plugin-transform-jscript';
import transformMemberExpressionLiterals from 'babel-plugin-transform-member-expression-literals';
import transformPropertyLiterals from 'babel-plugin-transform-property-literals';
import assign from 'object.assign';

export default declare((api, opts) => {
  api.assertVersion(7);

  const defaultTargets = {
    ucandroid: 1,
    safari: 8,
    explorer: 9,
    edge: 14,
    android: 30,
    chrome: 35,
    firefox: 52,
  };

  let debug = false;
  let modules = false;
  let spec = true;
  let strict = false;
  let strictMode = true;
  let useBuiltIns = true;

  if (opts !== undefined) {
    if (opts.debug !== undefined) debug = opts.debug;
    if (opts.modules !== undefined) modules = opts.modules;
    if (opts.spec !== undefined) spec = opts.spec;
    if (opts.strict !== undefined) strict = opts.strict;
    if (opts.strictMode !== undefined) strictMode = opts.strictMode;
    if (opts.useBuiltIns !== undefined) useBuiltIns = opts.useBuiltIns;
  }

  if (typeof debug !== "boolean") {
    throw new Error("@antask/babel-preset 'debug' option must be a boolean.");
  }
  if (typeof modules !== "boolean") {
    throw new Error("@antask/babel-preset 'modules' option must be a boolean.");
  }
  if (typeof spec !== "boolean") {
    throw new Error("@antask/babel-preset 'spec' option must be a boolean.");
  }
  if (typeof strict !== "boolean") {
    throw new Error("@antask/babel-preset 'strict' option must be a boolean.");
  }
  if (typeof strictMode !== "boolean") {
    throw new Error("@antask/babel-preset 'strictMode' option must be a boolean.");
  }
  if (typeof useBuiltIns !== "boolean") {
    throw new Error("@antask/babel-preset 'useBuiltIns' option must be a boolean.", );
  }

  const transpileTargets = (opts.targets) || (buildTargets = (opts) => {
    return assign({}, defaultTargets, opts.additionalTargets);
  });

  return {
    presets: [
      [
        presetEnv, {
          debug: debug,
          exclude: [
            'transform-async-to-generator',
            'transform-template-literals',
            'transform-regenerator'
          ],
          modules: modules,
          targets: transpileTargets
        }
      ]
    ],
    plugins: [
      [modules && transformModulesCommonJs, {
        strictMode,
        strict
      }],
      [modules && transformStrictMode, {
        strictMode
      }],
      [transformTemplateLiterals, {
        spec
      }],
      transformPropertyMutators,
      transformMemberExpressionLiterals,
      transformPropertyLiterals,
      transformJscript,
      [proposalObjectRestSpread, {
        useBuiltIns
      }],
    ].filter(Boolean)
  };
});
