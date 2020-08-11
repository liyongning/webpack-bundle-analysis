import { tmpPrint } from './tmp.js'
export function print () {
  tmpPrint() 
  console.log('我是 num.js 的 print 方法')
}