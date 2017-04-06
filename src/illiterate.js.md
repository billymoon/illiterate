# Illiterate

Extract code block from markdown à la coffeescript - but for **any** language.

## Installation

> npm install -g illiterate

## Usage

Run `illiterate` on a markdown file and the code blocks will be extracted and output in the console.

> illiterate <filename.ext.md>

For example, the build command for parsing this markdown file into the actual `illiterate.js` library...

> illiterate src/illiterate.js.md > lib/illiterate.js

After being processed by `illiterate`, only the code blocks are output, which can be seen in [lib/illiterate.js](../lib/illiterate.js).

## Build

The build command is set in the `package.json` file so you can...

> npm run build

## Source

This file is the main library, which compiles into [lib/illiterate.js](../lib/illiterate.js). There is also a command line tool wrapper in [bin/illiterate](../bin/illiterate).

### Initialize environment

Create self executing enclosure - convert function into expression by prefixing `!` which prevents accidental invokation of code concatenated beforehand. Might not pass JSLint with default options, but if it is good enough for twitter, it is good enough for me :)

    !function(){

        var sm = require('source-map')

        var root = this,
            illiterate;

Load dependencies... but how to handle this in the browser context..!?

            var _ = require('lodash'),
            md = require('markdown-it')();

Define main parse method, which accepts a string

        illiterate = function(text, filename) {

Create a variable to store output as it is built up from input files

            var out = [],
                // https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/
                sourcemap = new sm.SourceMapGenerator({
                  file: 'input-file'
                });

### Main loop

We only want to extract code blocks, so remove other rules, and override `code_block` rule

            md.renderer.rules = {
                code_block: function (tokens, idx) {
                    var rows = tokens[idx].map
                    tokens[idx].content.split('\n').map(function(line, index){
                        var line_number = rows[0] + index + 1
                        out.push(line)
                        sourcemap.addMapping({
                          generated: {
                            line: out.length,
                            column: null
                          },
                          source: 'input-file',
                          original: {
                            line: line_number,
                            column: null
                          },
                          name: null
                        });
                    })
                }
            }

Run the render method, which will callback the `code_block` rule for each extracted block of code

            md.render(text)

Output extracted code blocks
    
            // http://stackoverflow.com/a/6182519/665261
            var sourcemap_datauri = 'data:application/json;charset=utf-8;base64,' + new Buffer(sourcemap.toString()).toString('base64')
            return out.join('\n') + '\n//# sourceMappingURL=' + sourcemap_datauri + '\n//# sourceURL=' + filename;

        };


### Fin

        if (typeof exports !== 'undefined') {
            if (typeof module !== 'undefined' && module.exports) {
                exports = module.exports = illiterate;
            }
        } else {
            root.illiterate = illiterate;
        }

        if (typeof define === 'function' && define.amd) {
            define('illiterate', [], function() {
                return illiterate;
            });
        }

        return illiterate;

And finally what has been opened, must be closed, and executed...

    }.call(this);
