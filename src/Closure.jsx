import React, { useCallback } from "react";

/**
 * @description 闭包MDN - 一个函数和对其周围状态（lexical environment，词法环境）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是闭包（closure）
 * @example useEffect
 * **/
export default function Closure(props) {
    // 1. 柯里化也使用到了闭包 2. 暴露私有变量，修改私有变量(props.changeState)
  function add(x) {
    return function (y) {
      return x + y;
    };
  }

  const add2 = add(2) // 闭包，存储了引用x=2

  return <div></div>;
}
