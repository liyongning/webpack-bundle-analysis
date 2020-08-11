## 某大厂面试题

代码中我们通过 import moduleName from 'xxmodule' 或者 import('xxmodule') 的方式引入其它模块，打包以后它们变成了什么？

## 答案

[你的 import 被 webpack 变成了什么？](https://juejin.im/post/6859569958742196237)

# 运行

```
npm i && npx webpack
```

然后拷贝`dist/index.html`文件的路径在浏览器运行即可

`源码解读.js`其实就是打包后的`main.js`