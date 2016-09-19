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

        var root = this,
            illiterate;

Load dependencies... but how to handle this in the browser context..?

        var _ = require('lodash'),
            marked = require('marked');

Define main parse method, which accepts a string.

        illiterate = function(text){

Create a variable to store output as it is built up from input files, set the target to default (where content without specified files is attached) and markdown lexer results.

            var out = { default: [] },
                target = 'default',
                // from marked.js Inline-Level Grammar...
                srcPattern = /^\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\s*\[src:\/\/([^\]]*)\]/,
                m,
                lexed = marked.lexer(text, {});

### Main loop

Pass the input text through a markdown parser, then reduce the tokens to extract only code blocks, joining with newlines, and pushing onto the output array.

            _.each(lexed, function(item){
                if(!!item.text && item.text[0] === '[' && (m = item.text.match(srcPattern))) {
                    target = m[2];
                    out[target] = out[target] || [];
                }
                if(item.type === 'code'){
                    target && out[target].push(item.text);
                }
            });

Post process main loop.

            var defaultOut = out.default;
            delete out.default;
            var outArr = _.map(out, function(val, key){
                return {
                    filename: lexed.links['src://'+key].href,
                    content: val.join('\n')
                };
            });
            outArr.default = defaultOut.join('\n');

### Output

Output extracted code blocks

            return outArr;

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
