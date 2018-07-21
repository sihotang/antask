MAKEFLAGS = -j1

# Fix color output until TravisCI fixes https://github.com/travis-ci/travis-ci/issues/7967
export FORCE_COLOR = true

build: clean clean-lib
    ./node_modules/.bin/gulp build
    node ./packages/babel-types/scripts/generateTypeHelpers.js
    # call build again as the generated files might need to be compiled again.
    ./node_modules/.bin/gulp build
