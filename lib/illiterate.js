!function(){
    var root = this,
        illiterate;
        var _ = require('lodash'),
        md = require('markdown-it')();
    illiterate = function(text) {
        var out = [];
        md.renderer.rules = {
            code_block: function (tokens, idx) {
                out.push(tokens[idx].content)
            }
        }
        md.render(text)
        return out.join('');
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
