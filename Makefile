.PHONY: all build

OUTPUTDIR="./dist/"

all: clean build

build:
	@npm run build
	@cp public/index.html ${OUTPUTDIR}index.html

clean:
	@if [ -f ${OUTPUTDIR}index.html ] ; then rm ${OUTPUTDIR}index.html ; fi
