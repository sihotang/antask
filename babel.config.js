"use strict";

module.exports = function (api) {
  const env = api.env();

  let envOpts = {
    exclude: [
      "transform-async-to-generator",
      "transform-template-literals",
      "transform-regenerator"
    ],
    modules: false,
    targets: {
      node: 6,
    },
  };

  switch (env) {
    case "production":
      envOpts.targets = { node: 6 };
      break;
    case "test":
      envOpts.targets = { node: "current" };
      break;
    case "development":
    default:
      envOpts.debug = true;
      envOpts.targets = { node: "current" };
      break;
  }

  return {
    comments: false,
    ignore: [
      "packages/*/lib",
    ],
    presets: [
      ["@babel/preset-env", envOpts],
    ],
    plugins: [
      ["@babel/plugin-transform-modules-commonjs", {
        lazy: true,
        strictMode: true,
        strict: true,
      }],
      ["@babel/plugin-transform-strict-mode", {
        strictMode: true
      }],
      ["@babel/plugin-transform-template-literals", {
        spec: true,
      }],
      "@babel/plugin-transform-property-mutators",
      "babel-plugin-transform-member-expression-literals",
      "babel-plugin-transform-property-literals",
      "babel-plugin-transform-jscript",
      ["@babel/plugin-proposal-object-rest-spread", {
        useBuiltIns: true,
      }],
    ].filter(Boolean),
  };
};
