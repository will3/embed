import React, { Component } from 'react';

import MenuButton from './components/menubutton';
import MainView from './components/mainview';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%'
        }}>
          <MainView/>
        </div>

      </div>
    );
  }
}

export default App;
