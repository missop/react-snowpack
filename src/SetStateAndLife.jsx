import React, { Component,useEffect,useState } from "react";

class TestSetState1 extends Component {
  state = {
    count: 0,
  };
componentDidMount(){
  setTimeout(() => {
    console.log("this.state.count是否会更新",this.state.count)
  },3000)
}
  // 主要看是否开启了批处理，如果是批处理则是异步更新，react事件中会调用batchedUpdate所以会异步处理更新，而定时器和promise、原生事件中都不会执行批处理，因此会同步更新state

  /*
  G:\QD\补丁班+STUDY\react-master\packages\react-reconciler\src\ReactUpdateQueue.new.js
       【异步】react事件监听回调中, setState()是异步更新状态
       */
  update1 = () => {
    console.log("update1 setState()之前", this.state.count); // =>0
    debugger  //flushSyncCallbackQueue=》runWithPriority$1=》Scheduler_runWithPriority=》callback=》commitRoot=》render
    // 根据优先级别计算过期时间，+250，+5000，等定值，等到过期时间到达之后执行
    this.setState((state) => ({ count: state.count + 1 }));
    console.log("update1 setState()之后", this.state.count); // =>0
  };

  /*
       react生命周期勾子中, setState()是异步更新状态（在其它函数运行时，此处注释掉）
       
      componentDidMount () {
        console.log('componentDidMount setState()之前', this.state.count) //=>0
        this.setState(state => ({count: state.count + 1}))
        console.log('componentDidMount setState()之后', this.state.count) //=>0
      }*/

  /*
      【同步】定时器回调 / 原生事件监听回调 / promise回调 /...
       */
  update2 = () => {
    //同步
    setTimeout(() => {
      console.log("setTimeout setState()之前", this.state.count); // 0
      this.setState((state) => ({ count: state.count + 1 })); 
      console.log("setTimeout setState()之后", this.state.count); // 1
    }, 1000); //1秒后执行
  };
  update3 = () => {
    //同步
    const h2 = this.refs.count; //根据ref找到h2，即页面显示的数字
    h2.onclick = () => {
      //点过更新按钮之后，再点h2里的数字才执行
      console.log("onclick setState()之前", this.state.count); // 0
      this.setState((state) => ({ count: state.count + 1 }));
      console.log("onclick setState()之后", this.state.count); // 1
    };
  };
  update4 = () => {
    //同步
    Promise.resolve().then((value) => {
      console.log("Promise setState()之前", this.state.count); //0
      this.setState((state) => ({ count: state.count + 1 }));
      console.log("Promise setState()之后", this.state.count); //1
    });
  };

  update5 = () => {
    //setState(fn): 更新多次状态, 但只调用一次render()更新界面--状态更新没有合并, 但界面更新合并了
    console.log("onclick setState()之前", this.state.count); // 0
    this.setState((state) => ({ count: state.count + 1 }));
    console.log("onclick setState()之后", this.state.count); // 0

    console.log("onclick setState()之前2", this.state.count); // 0
    this.setState((state) => ({ count: state.count + 1 }));
    console.log("onclick setState()之后2", this.state.count); // 0
  };

  update6 = () => {
    //setState({}):合并更新一次状态, 只调用一次render()更新界面--状态更新和界面更新都合并了
    console.log("onclick setState()之前", this.state.count); // 0
    this.setState({ count: this.state.count + 1 });
    console.log("onclick setState()之后", this.state.count); // 0
    console.log("onclick setState()之前2", this.state.count); // 0
    this.setState({ count: this.state.count + 1 });
    console.log("onclick setState()之后2", this.state.count); // 0
  };

  update7 = () => {
    //setState({}) setState(fn)5-6混合：
    console.log("onclick setState()之前", this.state.count); // 0
    this.setState({ count: this.state.count + 1 });
    console.log("onclick setState()之后", this.state.count); // 0

    console.log("onclick setState()之前2", this.state.count); // 0
    this.setState((state) => ({ count: state.count + 1 }));
    console.log("onclick setState()之后2", this.state.count); // 0
  };

  update8 = () => {
    //利用回调显示state更新后的值
    console.log("onclick setState()之前", this.state.count); //0
    this.setState({ count: this.state.count + 1 }, () => {
      console.log("onclick setState()之后", this.state.count);
    }); //1
  };

  render() {
    const { count } = this.state;
    console.log("render()", count);
    return (
      <div>
        <h2 ref="count">{count}</h2>
        <button onClick={this.update1}>更新1</button> ---
        <button onClick={this.update2}>更新2</button> &nbsp;
        <button onClick={this.update3}>更新3</button> &nbsp;
        <button onClick={this.update4}>更新4</button> ---
        <button onClick={this.update5}>更新5</button> &nbsp;
        <button onClick={this.update6}>更新6</button> &nbsp;
        <button onClick={this.update7}>更新7</button> &nbsp;
        <button onClick={this.update8}>更新8</button> &nbsp;
      </div>
    );
  }
}

class TestSetState2 extends Component {
  state = {
    count: 0,
  };

  componentDidMount() {
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
    console.log("[1]", this.state.count); // 2 ==> 0

    this.setState((state) => ({ count: state.count + 1 }));
    this.setState((state) => ({ count: state.count + 1 }));
    console.log("[2]", this.state.count); // 3 ==> 0

    setTimeout(() => {
      this.setState({ count: this.state.count + 1 });
      console.log("timeout", this.state.count); // 10 ==> 6

      this.setState({ count: this.state.count + 1 });
      console.log("timeout", this.state.count); // 12 ==> 7
    }, 0);

    Promise.resolve().then((value) => {
      this.setState({ count: this.state.count + 1 });
      console.log("promise", this.state.count); // 6 ==>4

      this.setState({ count: this.state.count + 1 });
      console.log("promise", this.state.count); // 8 ==> 5
    });
  }

  render() {
    const count = this.state.count;
    console.log("render", count); // 1 ==> 0   4 ==>3   5 ==>4  7 ==>5  9 ==>6  11 ==>7
    return (
      <div>
        <p>{count}</p>
      </div>
    );
  }
}

// 生命周期中是否可调用 setState()
// 初始化 state
// constructor()
// 可以调用 setState()
// componentDidMount()
// 根据判断条件可以调用 setState()
// componentDidUpdate()
// 禁止调用 setState()
// shouldComponentUpdate()

// render()

// getSnapshotBeforeUpdate()

// componentWillUnmount()
class LifeCycle extends Component {
  state = {};
  // 初始化流程
  /**
   * @description 在每次调用 render 方法之前调用。包括初始化和后续更新时。
   * **/
  static getDerivedStateFromProps=(nextProps, nextState)=> {
    console.log(nextState.list?"updateOrder Parent 1:getDerivedStateFromProps":"initorder Parent:1,getDerivedStateFromProps");
    return nextState;
  }
  componentDidMount() {
    console.log("initorder Parent:3 componentDidMount",this);
    this.setState({ list: [] });
  }
  render() {
    console.log(this.state.list?"updateOrder Parent 3 render":"initorder Parent:2 render" );
    return <LifeCycleChild/>;
  }
  // update流程
  shouldComponentUpdate(nextProps, nextState) {
    console.log("updateOrder Parent 2: shouldComponentUpdate");
    return true;
  }
/**
 * @description 在最近一次的渲染输出被提交之前调用。也就是说，在 render 之后，即将对组件进行挂载时调用。它可以使组件在 DOM 真正更新之前捕获一些信息（例如滚动位置），
 * 此生命周期返回的任何值都会作为参数传递给 componentDidUpdate()。如不需要传递任何值，那么请返回 null
 * **/
  getSnapshotBeforeUpdate(nextProps, nextState) {
    console.log("updateOrder Parent:4,getSnapshotBeforeUpdate");
    return null
  }
  componentDidUpdate() {
    console.log("updateOrder Parent:5 componentDidUpdate");
  }
}

class LifeCycleChild extends Component {
  state = {}
  static getDerivedStateFromProps=(nextProps, nextState)=> {
    console.log(nextState.list?"updateOrder Child 1:getDerivedStateFromProps":"initorder Child:1,getDerivedStateFromProps");
    return nextState;
  }
  componentDidMount() {
    console.log("initorder Child:3 componentDidMount");
    this.setState({ list: [] });
  }
  render() {
    console.log(this.state.list?"updateOrder Child 3 render":"initorder Child:2 render" );
    return null;
  }
  // update流程
  shouldComponentUpdate(nextProps, nextState) {
    console.log("updateOrder Child 2: shouldComponentUpdate");
    return true;
  }
  getSnapshotBeforeUpdate(nextProps, nextState) {
    console.log("updateOrder Child:4,getSnapshotBeforeUpdate");
    return null
  }
  componentDidUpdate() {
    console.log("updateOrder Child:5 componentDidUpdate");
  }
}

// constructor：函数组件不需要构造函数。你可以通过调用 useState 来初始化 state。如果计算的代价比较昂贵，你可以传一个函数给 useState。
// getDerivedStateFromProps：改为在渲染时安排一次更新。
// shouldComponentUpdate：详见 React.memo.
// render：这是函数组件体本身。
// componentDidMount, componentDidUpdate, componentWillUnmount：useEffect Hook 可以表达所有这些的组合。
// componentDidCatch and getDerivedStateFromError：目前还没有这些方法的 Hook 等价写法，但很快会加上。

/**
 * @description hooks生命周期和类组件生命周期，
 * 设置了依赖项就等于didMount+didUpdate,没有纯粹的didMount，必须使用ref来模拟
 * 
 * useEffect跟生命周期不等价，无法完全去模拟生命周期！  心智模型更接近于实现同步
 * 
 * useEffect依赖问题，如果有多个依赖或者依赖引用修改都会导致多次更新，useEffect依赖问题是个考验，基本类型没问题，引用类型浅比较多次更新,ref存储值然后作比较:use-deep-compare-effect
 * useEffect依赖欺骗：

 * function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // 它会每秒调用setCount(0 + 1)
    }, 1000);
    return () => clearInterval(id);
  }, []); //你的关注点在这里,这里明显是依赖了count，但是却写成空,这个依赖项不能解释为要执行几次

  return <h1>{count}</h1>;
}

如何修复依赖欺骗？
1. 正确设置依赖项
2. 函数式更新：可以随时拿到最新值 => 不再从渲染作用域读取counter值
它看起来有点奇怪，它能做的非常有限。例如，如果我们有两个状态变量，它们的值相互依赖，或者如果我们需要根据prop来计算下一个状态，这对我们没有帮助。
幸运的是，setCount(c => c + 1)有一个更强大的姐妹模式。它的名称是useReducer
3. 一个常见的错误就是函数不是依赖关系,函数依赖的解决方案：
// 但是简单地忽略局部函数的问题是，当组件增长时，很难判断我们是否在处理所有的情况!
如果依赖于函数，那么就会造成频繁更新了
首先，如果函数不使用组件范围中的任何内容，你可以将其提升到组件外部，然后在效果中自由使用它：
或者，你可以将其包装到useCallback Hook

function SearchResults() {
  // Imagine this function is long
  function getFetchUrl() {
    return 'https://hn.algolia.com/api/v1/search?query=react';
  }

  // Imagine this function is also long
  async function fetchData() {
    const result = await axios(getFetchUrl());
    setData(result.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // ...
}
 * 类组件与函数组件
 * 1. 生命周期
 * 2. hooks闭包与作用域
 * 3. 类组件有错误捕捉兜底的方法
 * **/
const FunctionCompLifeCycle=()=>{
  const [state, setState] = useState({})

  useEffect(() => {
    setTimeout(() => {
      console.log(state.buttonClicked,"is undefined?","在effect中使用定时器会记住当前依赖项的值，原因就是闭包将当前环境的引用值存储在了内存中")
    },3000)
    return () => {
      console.log("componentWillUnmount")
    }
  }, [])

  useEffect(()=>{
    console.log("state.button effects:",state.buttonClicked)
  },[state.buttonClicked])
  
  return <button onClick={()=>setState({buttonClicked:!state.buttonClicked})}></button>
}

export default function SetStateAndLife() {
  const Comp = {
    TestSetState1: <TestSetState1 />,
    TestSetState2: <TestSetState2 />,
    LifeCycle: <LifeCycle />,
    FunctionCompLifeCycle:<FunctionCompLifeCycle/>
  };
  return <div>{Comp[location.search.split("?")[1]]}</div>;
}

// useCallback 的真正目的还是在于缓存了每次渲染时 inline callback 的实例，
// 这样方便配合上子组件的 shouldComponentUpdate 或者 React.memo 起到减少不必要的渲染的作用。

// useRef 并不再单单是为了 DOM 的 ref 准备的，同时也会用来存放组件实例的属性
