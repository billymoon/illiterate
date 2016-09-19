!function(){
    var root = this,
        illiterate;
    var _ = require('lodash'),
        marked = require('marked');
    illiterate = function(text){
        var out = { default: [] },
            target = 'default',
            // from marked.js Inline-Level Grammar...
            srcPattern = /^\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\s*\[src:\/\/([^\]]*)\]/,
            m,
            lexed = marked.lexer(text, {});
        _.each(lexed, function(item){
            if(!!item.text && item.text[0] === '[' && (m = item.text.match(srcPattern))) {
                target = m[2];
                out[target] = out[target] || [];
            }
            if(item.type === 'code'){
                target && out[target].push(item.text);
            }
        });
        var defaultOut = out.default;
        delete out.default;
        var outArr = _.map(out, function(val, key){
            return {
                filename: lexed.links['src://'+key].href,
                content: val.join('\n')
            };
        });
        outArr.default = defaultOut.join('\n');
        return outArr;
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
