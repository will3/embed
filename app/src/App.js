import React, { Component } from 'react';
import SearchBar from './components/searchbar';
import MainView from './components/mainview';
import container from './container';

import './App.css';

class App extends Component {
  componentDidMount() {
    container.app = this;    
  }

  render() {
    const navHeight = 42;
    return (
      <div className="App">
        <nav style={{
          height: navHeight
        }}> 
          <SearchBar />
        </nav>
      
        <div style={{
          position: 'absolute',
          left: 0,
          top: navHeight,
          right: 0,
          bottom: 0,
          backgroundColor: '#F1F1F1'
        }}>
          <MainView/>
        </div>

      </div>
    );
  }
}

export default App;
