MAKEFLAGS = -j1

PACKAGES = packages

# Fix color output until TravisCI fixes https://github.com/travis-ci/travis-ci/issues/7967
export FORCE_COLOR = true

build: clean clean-lib
    ./node_modules/.bin/gulp build

clean: clean-test
    ./node_modules/.bin/rimraf packages/*/npm-debug*

clean-all:
    rm -rf node_modules
	rm -rf package-lock.json
	rm -rf .changelog

	$(foreach package, $(PACKAGES), \
		$(call clean-package-all, $(package)))

	make clean

clean-lib:
    $(foreach package, $(PACKAGES), \
        $(call clean-package-lib, $(package)))

clean-test:
    $(foreach package, $(PACKAGES), \
        $(call clean-package-test, $(package)))


define clean-package-all
    ./node_modules/.bin/rimraf $(1)/*/lib
    ./node_modules/.bin/rimraf $(1)/*/node_modules
    ./node_modules/.bin/rimraf $(1)/*/package-lock.json

endef

define clean-package-lib
    ./node_modules/.bin/rimraf $(1)/*/lib

endef

define clean-package-test
    ./node_modules/.bin/rimraf $(1)/*/test/tmp

endef
