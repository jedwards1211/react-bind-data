import React from 'react';
import ReactDOM from 'react-dom';

import Autoform from '../src/lib/Autoform.js';
import AutoformSandbox from '../src/lib/AutoformSandbox.js';

const MyComp = (props) => <Autoform {...props} data={props}>
  <form>
    <input type="text" name="title"/>
    <h1>{props.title}</h1>
    <fieldset name="name">
      <input type="text" name="first"/>
      <input type="text" name="last"/>
    </fieldset>
    <input type="text" name={['name', 'last']}/>
  </form>
</Autoform>;

ReactDOM.render(<AutoformSandbox initState={{title: 'Hello World', name: {first: '', last: ''}}}>
  <MyComp/>
</AutoformSandbox>, document.getElementById('root'));
