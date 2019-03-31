/**
 * <轻量级函数式编程>笔记
 * 函数式编程,函数必须永远有返回值,要明确的return一个值,通常这个值也不是undefined
 * function foo(){}/function bar(){return;}/function baz(){return undefined},这三种都会返回undefined,函数式编程要避免这种情况
 *一个return表达式仅能返回一个值,要想返回多个值时,可以把值放到一个复合值中,如数组,对象
 *尽可能的设计单一的形参
 */

function foo(x, x, z, kkk) {
  console.log(arguments.length); //NOTE:获取传入实参个数
}
// NOTE:获取形参个数
foo.length; //3

function bar(x, y = 2) {}
function baz(x, ...args) {}
function bay({ a, b }) {}
console.log(bar.length); //1
console.log(baz.length); //1
console.log(bay.length); //1

//...args,获取所有剩余的未命名参数,并把他们放在NOTE:数组里,args无论是否为空,都是数组
//args.length剩余参数长度,args[0],args[1]
function foo(x, y, z, ...args) {
  console.log(x, y, z, args);
  console.log(arguments.length);
  console.log(args.length);
}
foo(); //undefined undefined undefined []
foo(1, 2, 3); //1 2 3 []
foo(1, 2, 3, 4); //1 2 3 [ 4 ]

function fun(...args) {
  console.log(arguments.length); //7
  console.log(args.length); //7
}
fun(1, ...[2, 3, 4], ...[4, 5, 6]);
console.log(fun.length); //0

//用此技巧来确保要传入参数,默认不传入时会抛出错误
function required() {
  throw new Error('this argument is required');
}
function fun(x = required()) {}
fun();

//将多个值放入一个对象或数组中
function foo() {
  let retValue1 = 1;
  let retValue2 = 2;
  return [retValue1, retValue2];
}

//副作用,改变了nums
function sum(list) {
  var total = 0;

  for (let i = 0; i < list.length; i++) {
    if (!list[i]) list[i] = 0;

    total = total + list[i];
  }

  return total;
}

var nums = [1, 3, 9, 27, , 84];
console.log(sum(nums));
console.log(nums); //[ 1, 3, 9, 27, 0, 84 ]

//高阶函数:接收一个函数,或者返回一个函数
function forEach(list, fn) {
  for (let i = 0; i < list.length; i++) {
    fn(list[i]);
  }
}
forEach([1, 2, 3, 4, 5], function each(value) {
  console.log(value);
});

//利用闭包记住函数值
function makeAdder(x) {
  return function sum(y) {
    return x + y;
  };
}
const addTo10 = makeAdder(10);
addTo10(3); //13

/**
 * 函数的最佳实践
 * 用命名函数,而不是匿名函数
 * 方便调试和错误跟踪
 */
(function IIFE() {
  //给这个IIFE取个名,
})();

//偏函数:一个减少函数参数个数(希望传入形参的数量)的过程
function partial(fn, ...presetArgs) {
  return function partiallApplied(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}
function add(x, y) {
  return x + y;
}
console.log([1, 2, 3, 4, 5].map(partial(add, 3))); //[ 4, 5, 6, 7, 8 ]

//将函数参数颠倒顺序
function reverseArgs(fn) {
  return function argsReversed(...args) {
    return fn(...args.reverse());
  };
}

//柯里化:原函数期望接收多个实参,柯里化后只会接收第一个实参,并返回一个用来接收第二个参数的函数,以此类推
/**
 * 这是一个严格的柯里化函数,只支持curry(1)(2)(3)(4)这种严谨的调用
 * arity是希望传入的fn函数参数的个数
 * 然后返回一个IIFE函数,IIFE自执行,将空数组[]当作prevArgs的初始实参集合
 */
function curry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    //prevArgs初始值是[],
    return function curried(nextArg) {
      let args = prevArgs.concat([nextArg]);

      if (args.length >= arity) {
        return fn(...args);
      } else {
        // 将args传入,即prevArgs => args
        return nextCurried(args);
      }
    };
  })([]);
}
//更松散的柯里化定义,支持curry(1)(2,3,4)(5)这种调用
function looseCurry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return function curried(...nextArgs) {
      let args = prevArgs.concat(nextArgs);

      if (args.length >= arity) {
        return fn(...args);
      } else {
        return nextCurried(args);
      }
    };
  })([]);
}

/**
 * unary,只传入一个参数
 * 用法:只希望某个函数接收单一的实参(向a函数传入一个函数b,但是这个a函数会把多个实参传入b函数)
 */
function unary(fn) {
  return function onlyOneArg(arg) {
    return fn(arg);
  };
}
['1', '2', '3'].map(parseFloat); //✅parseFloat(value)
//['1', '2', '3'].map(parseInt) //❌parseInt(string, radix);
// ['1', '2', '3'].map(unary(parseInt)); ✅

/**
 * 辅助函数,解决当函数必须接收一个数组时,而却想把数组内容当成单独形参来处理
 *
 */
function spreadArgs(fn) {
  return function spreadFn(argsArr) {
    return fn(...argsArr);
  };
}
function foo(x, y) {
  console.log(x, y);
}
function bar(fn) {
  fn([3, 9]);
}
bar(foo); //❌[3,9] undefined
bar(spreadArgs(foo)); //[3,9]✅
/**与spreadArgs相反的作用 */
function gatherArgs(fn) {
  return function gatheredFn(...argsArr) {
    return fn(argsArr);
  };
}

/**组合函数 */
function compose2(fn2, fn1) {
  return function composed(origValue) {
    return fn2(fn1(origValue));
  };
}
/**
 * 通用compose函数
 * slice(),返回一个新的数组对象,由begin和end(不含)决定的原数组的浅拷贝
 * 注意参数的执行是从右往左的
 */
//实现版本1
function compose(...fns) {
  return function composed(result) {
    let list = fns.slice();

    while (list.length > 0) {
      /**将最后 一个函数从列表尾部拿出来并执行他 */
      result = list.pop()(result);
    }

    return result;
  };
}
//实现版本2
function compose(...fns) {
  return function composed(result) {
    return fns.reverse().reduce(function reducer(result, fn) {
      return fn(result);
    }, result);
  };
}
//递归实现
function compose(...fns) {
  拿出最后两个参数;
  let [fn1, fn2, ...rest] = fns.reverse();
  let composeFn = function composed(...args) {
    return fn2(fn1(...args));
  };

  if (rest.length == 0) return composeFn;

  return compose(
    // 再次调转,变成初始的样子
    ...rest.reverse(),
    composeFn,
  );
}
//与compose()一模一样,除了将列表中的函数从左往右处理
function pipe(...fns) {
  return function piped(result) {
    let list = fns.slice();

    while (list.length > 0) {
      result = list.shift()(result);
    }
    return result;
  };
}
