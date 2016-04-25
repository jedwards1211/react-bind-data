import React from 'react';
import ReactDOM from 'react-dom';

import BindData from '../src/index.js';
import BindDataSandbox from '../src/lib/BindDataSandbox.js';

const MyComp = (props) => <BindData {...props} data={props}>
  <form>
    <input type="text" name="title"/>
    <h1>{props.title}</h1>
    <fieldset name="name">
      <input type="text" name="first"/>
      <input type="text" name="last"/>
    </fieldset>
    <input type="text" name={['name', 'last']}/>
  </form>
</BindData>;

ReactDOM.render(<BindDataSandbox initState={{title: 'Hello World', name: {first: '', last: ''}}}>
  <MyComp/>
</BindDataSandbox>, document.getElementById('root'));
