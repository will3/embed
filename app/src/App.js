import React, { Component } from 'react';
import SearchBar from './components/searchbar';
import MainView from './components/mainview';
import container from './container';
import search from './api/search';
import storage from './storage';

const mixpanel = window.mixpanel;

import './App.css';

import $ from 'jquery';

class App extends Component {
  constructor(props) {
    super(props);
    this.events = container.events;
  }

  componentDidMount() {
    container.app = this;
    if (process.env.NODE_ENV === 'development') {
      mixpanel.init("ea686ee9c008ba9506afe2b7df0898bb");
    } else {
      mixpanel.init('9bd50ec09b42d4f9fa902a1f7650160d');
    }
    mixpanel.identify(storage.userId);
    mixpanel.people.increment('app opened');
    mixpanel.track('app opened');
  }

  render() {
    const navHeight = 42;
    
    const data = storage.get('data') || {};

    return (
      <div className="App">      
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        }}>
          <MainView 
          ref={ mainView => this.mainView = mainView } 
          results={data.results || []} />
        </div>

      </div>
    );
  }
}

export default App;
