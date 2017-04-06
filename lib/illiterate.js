!function(){
    var sm = require('source-map')
    var root = this,
        illiterate;
        var _ = require('lodash'),
        md = require('markdown-it')();
    illiterate = function(text, filename) {
        var out = [],
            // https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/
            sourcemap = new sm.SourceMapGenerator({
              file: 'input-file'
            });
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
        md.render(text)

        // http://stackoverflow.com/a/6182519/665261
        var sourcemap_datauri = 'data:application/json;charset=utf-8;base64,' + new Buffer(sourcemap.toString()).toString('base64')
        return out.join('\n') + '\n//# sourceMappingURL=' + sourcemap_datauri + '\n//# sourceURL=' + filename;
    };
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
}.call(this);
