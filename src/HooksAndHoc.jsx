import React,{useState,useEffect,useMemo} from "react";

// https://zhuanlan.zhihu.com/p/363905357
// hooks render props HOC
// render props 去渲染一个父子组件，但是子组件依赖于父组件的某些数据
// 1. 属性代理
// 2. 渲染劫持，根据props渲染哪个组件，例如loading 、
// 3. 反向继承 super.render
// 缺点：1。嵌套过深可读性、维护性差 2.原组件的静态方法失效
// 优点：适合做插件

/**
 * @description demo1 :属性代理
 * **/
// function withLocalStorage(Comp) {
//   const storage = window.localStorage; // 注入一个storageprops

//   return function (props) {
//     return <Comp {...props} storage={storage} />;
//   };
// }

// function HooksAndHoc(props) {
//     const { storage, ...rest } = props;
//     console.log("storage", storage, rest);
//     return <div>123</div>;
//   }
//   export default withLocalStorage(HooksAndHoc);

/**
 * @description demoe2 :渲染劫持
 * **/
// function Render(props) {
//   return function () {
//     return props.name ? <div>{props.name}</div> : "";
//   };
// }

/**
 * @description demo3: 分片渲染
 * **/
// const renderQueue = []
// let isFirstrender = false

// const tryRender = ()=>{
//   const render = renderQueue.shift()
//   if(!render) return
//   setTimeout(()=>{
//     render() /* 执行下一段渲染 */
//   },300)
// } 

// function renderHOC(WrapComponent){
//     return function Index(props){
//       const [ isRender , setRender ] = useState(false)
//       useEffect(()=>{
//         renderQueue.push(()=>{  /* 放入待渲染队列中 */
//           setRender(true)
//         })
//         if(!isFirstrender) {
//           tryRender() /**/
//           isFirstrender = true
//         }
//       },[])
//       return isRender ? <WrapComponent tryRender={tryRender}  { ...props }  /> : <div className='box' ><div className="icon" >loading...</div></div>
//     }
// }

// class Index extends React.Component{
//   componentDidMount(){
//     const { name , tryRender} = this.props
//     /* 上一部分渲染完毕，进行下一部分渲染 */
//     tryRender()
//     console.log( name+'渲染')
//   }
//   render(){
//     return <div>
//         <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=294206908,2427609994&amp;fm=26&amp;gp=0.jpg" />
//     </div>
//   }
// }

// const Item = renderHOC(Index)

// export default () => {
//   return <React.Fragment>
//       <Item name="组件一" />
//       <Item name="组件二" />
//       <Item name="组件三" />
//   </React.Fragment>
// }

/**
 * @description demo4: 异步组件(懒加载)
 * **/
// loadRouter()
// .then(module => module.default)
// .then(Component => this.setState({Component},
//  ))

/**
 *@description demo5: 节流,只有当某个props改变了才渲染子组件,优化点
 * **/
// function HOC (Component){
//     return function renderWrapComponent(props){
//       const { num } = props
//       const RenderElement = useMemo(() =>  <Component {...props}  /> ,[ num ])
//       return RenderElement
//     }
// }
// class Index extends React.Component{
//  render(){
//     console.log(`当前组件是否渲染`,this.props)
//     return <div>hello,world, my name is alien </div>
//  }
// }
// const IndexHoc = HOC(Index)

// export default ()=> {
//    const [ num ,setNumber ] = useState(0)
//    const [ num1 ,setNumber1 ] = useState(0)
//    const [ num2 ,setNumber2 ] = useState(0)
//    return <div>
//        <IndexHoc  num={ num } num1={num1} num2={ num2 }  />
//        <button onClick={() => setNumber(num + 1) } >num++</button>
//        <button onClick={() => setNumber1(num1 + 1) } >num1++</button>
//        <button onClick={() => setNumber2(num2 + 1) } >num2++</button>
//    </div>
// }

// 进阶：定制化渲染流
// function HOC (rule){
//     return function (Component){
//        return function renderWrapComponent(props){
//          const dep = rule(props)
//          const RenderElement = useMemo(() =>  <Component {...props}  /> ,[ dep ])
//          return RenderElement
//        }
//     }
// }
// /* 只有 props 中 num 变化 ，渲染组件  */
// @HOC( (props)=> props['num'])
// class IndexHoc extends React.Component{
//  render(){
//     console.log(`组件一渲染`,this.props)
//     return <div> 组件一 ： hello,world </div>
//  }
// }

// /* 只有 props 中 num1 变化 ，渲染组件  */
// @HOC((props)=> props['num1'])
// class IndexHoc1 extends React.Component{
//  render(){
//     console.log(`组件二渲染`,this.props)
//     return <div> 组件二 ： my name is alien </div>
//  }
// }
// export default ()=> {
//    const [ num ,setNumber ] = useState(0)
//    const [ num1 ,setNumber1 ] = useState(0)
//    const [ num2 ,setNumber2 ] = useState(0)
//    return <div>
//        <IndexHoc  num={ num } num1={num1} num2={ num2 }  />
//        <IndexHoc1  num={ num } num1={num1} num2={ num2 }  />
//        <button onClick={() => setNumber(num + 1) } >num++</button>
//        <button onClick={() => setNumber1(num1 + 1) } >num1++</button>
//        <button onClick={() => setNumber2(num2 + 1) } >num2++</button>
//    </div>
// }

/**
 *@description demo6: 赋能组件：加一些额外生命周期，劫持事件，监控日志
 * **/

 export default function(){
     return null
 }