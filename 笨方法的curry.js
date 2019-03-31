function add(a, b, c) {
  return [a, b, c];
}

function curryIt(fn) {
  let n = fn.length;
  let args = [];

  return function test(arg) {
    args.push(arg);

    arg;
    args;

    if (args.length < n) {
      /**arguments.callee返回函数本身,已废弃 */
      return arguments.callee;
    } else {
      console.log(fn.apply(this, args));
    }
  };
}

var c = curryIt(add);
var c1 = c(1);
var c2 = c1(2);
var c3 = c2(3);
