(function (whiroth) {
  if (typeof window == 'undefined') {
    global.btoa = function (str) {
      return (new Buffer(str.toString(), 'binary')).toString('base64');
    };

    global.atob = function (str) {
      return new Buffer(str, 'base64').toString('binary');
    };

    module.exports = whiroth; // node
  } else {
    window.whiroth = whiroth; // browser
  }
})((function () {
  function forPrepare(what) {
    var result = what.replace(/'(.)'/g, function (a, r) {
      return r.charCodeAt(0);
    }).replace(/"(thisisageneratedtext)?([^"]*)"/g, function (a, isGenerated, c) {
      if (isGenerated) return a;
      return ' ' +
        c.split("").map(function (t) {
          return t.charCodeAt(0);
        }).reverse().join(' ') + ' ' + c.length + '  ';
    }).replace(/;(.*)(\r\n|\n\r|\n|\r|$)/g, '\n').replace(/\r\n|\n\r|\r|\n/g, " ").replace(/\(([^\(\)]*)\)/g, function (a, c) {
      return "\"thisisageneratedtext" + btoa(encodeURIComponent(c)) + "\"";
    });

    if (what != result) return forPrepare(result);
    return result;
  }

  function resolveFor(what) {
    return what.replace(/"(thisisageneratedtext)?([^"]*)"/g, function (a, isGenerated, c) {
      if (isGenerated) return "(" + decodeURIComponent(atob(c)) + ")";
      else {
        return ' ' +
          c.split("").map(function (t) {
            return t.charCodeAt(0);
          }).reverse().join(' ') + ' ' + c.length + '  ';
      }
    });
  }

  function compile(what, obj) {
    (obj || (obj = {}));

    var compiled = "";
    try {
      var ifState = 0;
      what = resolveFor(forPrepare(what));
      what.replace(/(-?\d+(?:\.\d+)?)|(true|false)|(\biter\b|\bi\b|\binit\b|\bbreak\b|\bcontinue\b|\bpc\b|\bpv\b)|(?:#(\w+))|(for|while|if|f|w|else|routine *\w+ *#?)? *(?:\((.*?)\))|(?:(\w+) *< *>)|(\+\+|\+|--|-|\*|\/|\|\||\||\^|%|<<|>>|<|>|==|!=|>=|<=|~|!|:|@|swap|u|d|r)|(?:\[(=)?([^\]]+?)])|(?:\{([^}]+?)})|(?:set *< *(\w+) *(?:, *(\w+))? *>)|(?:clear *< *(\w+) *>)|[ \t\n\r]+|(.)/g, function (all, n, bool, specialOps, def, frm, frd, call, op, isParamSafe, ssop, smop, set, setv, clear, other) {
        if (op) {
          if (op == ':') {
            compiled += ";__a=__s.pop();";
            compiled += "__s.push(__a);";
            compiled += "__s.push(__a);";
          } else if (op == '@') {
            compiled += "__s.pop();"
          } else if (op == 'd') {
            compiled += "__s.push(__s.shift());"
          } else if (op == 'swap') {
            compiled += "__b=__s.pop();";
            compiled += "__a=__s.pop();";
            compiled += "__s.push(__b);";
            compiled += "__s.push(__a);";
          } else if (op == 'u') {
            compiled += "__s.unshift(__s.pop());"
          } else if (op == 'r') {
            compiled += "__s.reverse();"
          } else if (op == '++') {
            compiled += ";__a=__s.pop()+1;";
            compiled += "__s.push(__a);";
          } else if (op == '--') {
            compiled += ";__a=__s.pop()-1;";
            compiled += "__s.push(__a);";
          } else if (op == '!') {
            compiled += ";__a=!__s.pop();";
            compiled += "__s.push(__a);";
          } else if (op == '~') {
            compiled += "__a = ~__s.pop();";
            compiled += "__s.push(__a);";
          } else {
            compiled += "__b=__s.pop();";
            compiled += "__a=__s.pop();";
            compiled += "__s.push(__a " + op + " __b);";
          }
        } else if (bool) {
          compiled += '__s.push(' + (bool == "true") + ');';
        } else if (def) {
          compiled += 'if(typeof ' + def + '!=="undefined")__s.push(' + def + ');';
        } else if (specialOps) {
          if (specialOps == 'iter' || specialOps == 'i') compiled += '__s.push(__i' + obj.picked + ');';
          else if (specialOps == 'init') compiled += '__s.push(__m' + obj.picked + ');';
          else if (specialOps == 'break') compiled += 'break;';
          else if (specialOps == 'continue') compiled += 'continue;';
          else if (specialOps == 'pc') compiled += '__pc();';
          else if (specialOps == 'pv') compiled += '__pv();';
        } else if (ssop) {
          if (ssop.indexOf('#') == 0) ssop = "Math." + ssop.substring(1);

          if (!isParamSafe) {
            compiled += '__a= __s.pop();';
            compiled += '__r=' + ssop + "(__a);";
            compiled += 'if(__r!=void(0)) __s.push(+__r);';
          } else {
            compiled += '__r=' + ssop + '();';
            compiled += 'if(__r!=void(0))__s.push(+__r);';
          }
        } else if (smop) {
          if (smop.indexOf('#') == 0) smop = "Math." + smop.substring(1);

          compiled += '__b=__s.pop();';
          compiled += '__a=__s.pop();';
          compiled += '__r=' + smop + '(__a, __b);';
          compiled += 'if(__r!=void(0))__s.push(+__r);';
        } else if (call) {
          compiled += '__ro["' + call + '"]' + '();';

        } else if (frd) {
          var picked = obj.picked ? obj.picked + 1 : 1;
          if (frm == 'while' || frm == 'w' || frm == undefined) {
            compiled += '__i' + picked + '=__s.pop();';
            compiled += '__m' + picked + '=__i' + picked + ';';
            compiled += 'for(;__i' + picked + '>0;__i' + picked + '--){';
            compiled += compile(frd, {picked: picked});
            compiled += '};';
          } else if (frm == 'for' || frm == 'f') {
            compiled += '__i' + picked + '=1;';
            compiled += '__m' + picked + '=__s.pop();';
            compiled += 'for(;__i' + picked + '<=__m' + picked + ';__i' + picked + '++){';
            compiled += compile(frd, {picked: picked});
            compiled += '};';
          } else if (frm == 'if') {
            compiled += '__i' + picked + '=__s.pop();';
            compiled += '__m' + picked + (obj.picked > 1 ? '=__m' + obj.picked : '=__i1') + ';';
            compiled += 'if(__i' + picked + ') {';
            compiled += compile(frd, {picked: picked});
            compiled += '};';
            ifState = picked;
          } else if (frm == 'else') {
            if (ifState != 0) {
              picked = ifState;
            } else {
              compiled += '__i' + picked + '=__s.pop();';
            }
            compiled += '__m' + picked + (obj.picked > 1 ? '=__m' + obj.picked : '=__i1') + ';';
            compiled += 'if(!__i' + picked + '){';
            compiled += compile(frd, {picked: picked});
            compiled += '};';
          } else if (frm.indexOf('routine') == 0) {
            var reg = /routine *(\w+) *(#)?/.exec(frm);
            var name = reg[1];
            var ovr = reg[2];

            if (!ovr) {
              compiled += 'if(__ro["' + name + '"])throw Error("already defined routine ' + name + '");';
            }

            compiled += '__ro["' + name + '"]=function(){';
            compiled += compile(frd);
            compiled += '};';
          }
        } else if (set) {
          if (setv) {
            compiled += 'var ' + set + '=' + (+setv) + ';';
          } else {
            compiled += 'var ' + set + '=__s.pop();'
          }
        } else if (clear) {
          compiled += 'delete ' + clear + ';';
        } else if (other) {
          throw Error("unexpected statement " + other);
        } else if (n) {
          compiled += '__s.push(' + (+n) + ');';
        }
        return "";
      });
    } catch (e) {
      throw Error(e.message.indexOf("Compile error: ") == 0 ? e.message : "Compile error: " + e.message);
    }

    return compiled;
  }

  function compileWithHeader(what) {
    var start = Date.now();
    var fn = "(function(a) {var __s=[],__r,__ro={},__execution=Date.now(),__out='',__a,__b,__r,__pc=(function(){__out+=String.fromCharCode(__s.pop())}),__pv=(function(){__out+=__s.pop()});if(a&&a.constructor==Array)__s.push.apply(__s, a);"
      + keepReplaceUntilNoChange(compile(what), /__s\.(push|pop)\(([^)]+)\) *; *__s\.\1\(([^)]+)\)/g, function (a, op, s1, s2) {
        return '__s.' + op + '(' + s1 + ',' + s2 + ')'
      })
      + ";__r=new Number(__s[__s.length-1]);__r.out=__out;__r.stack=__s;__r.executionTime=(Date.now()-__execution)+' ms';return __r})";
    fn = fn.replace(/(\)|}|]);+/g, "$1;");
    var fnE = eval(fn);
    fnE.fn = fnE;
    fnE.fnPure = fn;
    fnE.compileTime = (Date.now() - start) + " ms";
    return fnE;
  }

  function keepReplaceUntilNoChange(text, regex, fn) {
    var last = text;
    do {
      last = text;
      text = text.replace(regex, fn);
    }
    while (last != text);
    return last;
  }

  return compileWithHeader;
})());