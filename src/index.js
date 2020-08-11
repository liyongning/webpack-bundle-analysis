/**
 * 入口文件，引入 print 方法，并执行
 * 定义了一个 button 方法，为页面添加一个按钮，并为按钮设置了一个 onclick 事件，负责动态引入一个文件
 */
import { print } from './num.js'

print()

function button () {
  const button = document.createElement('button')
  const text = document.createTextNode('click me')
  button.appendChild(text)
  button.onclick = e => import('./info.js').then(res => {
    console.log(res.log)
  })
  return button
}

document.body.appendChild(button())