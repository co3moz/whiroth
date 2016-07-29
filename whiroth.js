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

  function isReserved(check) {
    return (check == '__s'
    || check == '__r'
    || check == '__ro'
    || check == '__execution'
    || check == '__out'
    || check == '__a'
    || check == '__b'
    || check == '__pc'
    || check == '__pv'
    || check == 'for'
    || check == 'while'
    || check == 'iter'
    || check == 'break'
    || check == 'continue'
    || check == 'pc'
    || check == 'pv'
    || check == 'undefined'
    || check == 'null'
    || check == 'else'
    || check == 'routine'
    || check == 'set'
    || check == 'set_global'
    || check == 'swap'
    || check == 'true'
    || check == 'false'
    || check.indexOf('__i') == 0
    || check.indexOf('__m') == 0);

  }

  function compile(what, obj) {
    (obj || (obj = {}));

    var compiled = "";
    try {
      var ifState = 0;
      what = resolveFor(forPrepare(what));
      what.replace(/(-?\d+(?:\.\d+)?)|(true|false)|(\biter\b|\bi\b|\binit\b|\bbreak\b|\bcontinue\b|\bpc\b|\bpv\b|\bundefined\b)|(?:#(\w+))|(for|while|if|f|w|else|routine *\w+ *#?)? *(?:\((.*?)\))|(?:(\w+) *< *>)|(\+\+|\+|--|-|\*|\/|\|\||\||\^|%|<<|>>|<|>|==|!=|>=|<=|~|!|:|@|swap|u|d|r)|(?:\[(=)?([^\]]+?)])|(?:\{([^}]+?)})|(?:set(_global)? *< *(\w+) *(?:, *(\w+))? *>)|[ \t\n\r]+|(.)/g, function (all, n, bool, specialOps, def, frm, frd, call, op, isParamSafe, ssop, smop, set_global, set, setv, other) {
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
          compiled += '__s.push(' + def + ');';
        } else if (specialOps) {
          if (specialOps == 'iter' || specialOps == 'i') {
            if (obj.picked == undefined) throw Error("There is no loop to use iter");
            compiled += '__s.push(__i' + obj.picked + ');';
          }
          else if (specialOps == 'init') {
            if (obj.picked == undefined) throw Error("There is no loop to use init");
            compiled += '__s.push(__m' + obj.picked + ');';
          }
          else if (specialOps == 'break') compiled += 'break;';
          else if (specialOps == 'continue') compiled += 'continue;';
          else if (specialOps == 'pc') compiled += '__pc();';
          else if (specialOps == 'pv') compiled += '__pv();';
          else if (specialOps == 'undefined') compiled += '__s.push(undefined);';
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
          compiled += '__s.push(+__r);';
        } else if (call) {
          if (!obj.routines || !obj.routines[call]) throw Error("Routine " + call + " probably never defined before");
          compiled += '__ro["' + call + '"]' + '();';

        } else if (frd) {
          var picked = obj.picked ? obj.picked + 1 : 1;
          if (frm == 'while' || frm == 'w' || frm == undefined) {
            compiled += '__i' + picked + '=__s.pop();';
            compiled += '__m' + picked + '=__i' + picked + ';';
            compiled += 'for(;__i' + picked + '>0;__i' + picked + '--){';
            compiled += compile(frd, {picked: picked, routines: obj.routines, globals: obj.globals});
            compiled += '};';
          } else if (frm == 'for' || frm == 'f') {
            compiled += '__i' + picked + '=1;';
            compiled += '__m' + picked + '=__s.pop();';
            compiled += 'for(;__i' + picked + '<=__m' + picked + ';__i' + picked + '++){';
            compiled += compile(frd, {picked: picked, routines: obj.routines, globals: obj.globals});
            compiled += '};';
          } else if (frm == 'if') {
            compiled += '__r' + picked + '=__s.pop();';
            if (obj.picked) compiled += '__i' + picked + '=__i' + obj.picked + ';';
            if (obj.picked) compiled += '__m' + picked + '=__m' + obj.picked + ';';
            compiled += 'if(__r' + picked + ') {';
            compiled += compile(frd, {picked: picked, routines: obj.routines, globals: obj.globals});
            compiled += '};';
            ifState = picked;
          } else if (frm == 'else') {
            if (ifState != 0) {
              picked = ifState;
            } else {
              compiled += '__r' + picked + '=__s.pop();';
            }
            if (obj.picked) compiled += '__i' + picked + '=__i' + obj.picked + ';';
            if (obj.picked) compiled += '__m' + picked + '=__m' + obj.picked + ';';
            compiled += 'if(!__r' + picked + '){';
            compiled += compile(frd, {picked: picked, routines: obj.routines, globals: obj.globals});
            compiled += '};';
          } else if (frm.indexOf('routine') == 0) {
            var reg = /routine *(\w+) *(#)?/.exec(frm);
            var name = reg[1];
            var ovr = reg[2];

            if (!ovr) {
              if (obj.routines[name]) throw Error("Already defined routine " + name);
            }

            if (isReserved(name)) throw Error("You cannot use this '" + set + "' with routines. it is reserved!");

            obj.routines[name] = true;
            compiled += '__ro["' + name + '"]=function(){';
            compiled += compile(frd, {routines: obj.routines, globals: obj.globals});
            compiled += '};';
          }
        } else if (set) {
          if (isReserved(set)) throw Error("You cannot use this '" + set + "' with sets. it is reserved!");
          if (set_global) {
            obj.globals[set] = true;
            if (setv) {
              compiled += set + '=' + (+setv) + ';';
            } else {
              compiled += set + '=__s.pop();'
            }
          } else {
            if (setv) {
              compiled += 'var ' + set + '=' + (+setv) + ';';
            } else {
              compiled += 'var ' + set + '=__s.pop();'
            }
          }
        } else if (other) {
          throw Error("unexpected statement " + other);
        } else if (n) {
          compiled += '__s.push(' + (+n) + ');';
        }

        return "";
      });
    } catch (e) {
      if (e.message.indexOf("unexpected statement") == 0) {
        var char = e.message.substring("unexpected statement ".length);
        if (char == '(') {
          throw Error("Compile error: '(' some loop paranthesis never closed!");
        } else if (char == '{') {
          throw Error("Compile error: '{' some double parameter native function call paranthesis never closed!");
        } else if (char == '[') {
          throw Error("Compile error: '[' some single parameter native function call paranthesis never closed!");
        } else if (char == '#') {
          throw Error("Compile error: '#' routine call without a valid name!");
        }
      }
      throw Error(e.message.indexOf("Compile error: ") == 0 ? e.message : "Compile error: " + e.message);
    }

    return compiled;
  }

  function compileWithHeader(what) {
    var start = Date.now();
    var obj = {
      routines: {},
      globals: {}
    };

    var optimizedCompile = keepReplaceUntilNoChange(compile(what, obj), /__s\.(push|pop)\(([^)]+)\) *; *__s\.\1\(([^)]+)\)/g, function (a, op, s1, s2) {
      return '__s.' + op + '(' + s1 + ',' + s2 + ')'
    });

    var fn = "(function(__param){var __s=[],__ro={},__execution=Date.now()" + (Object.keys(obj.globals).length > 0 ? ',' + Object.keys(obj.globals).join(',') : '') + ",__out='',__a,__b,__r,__pc=(function(){__out+=String.fromCharCode(__s.pop())}),__pv=(function(){__out+=__s.pop()});if(__param&&__param.constructor==Array)__s.push.apply(__s,__param);"
      + optimizedCompile + ";__r=new Number(__s[__s.length-1]);__r.out=__out;__r.stack=__s;__r.executionTime=(Date.now()-__execution)+' ms';return __r})";
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