import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(<h1>Hello World!</h1>, document.getElementById('root'))

function* test() {
  yield 1;
  yield 2;
  yield 3;
}

console.log(...test())
