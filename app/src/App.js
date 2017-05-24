import React, { Component } from 'react';
import SearchBar from './components/searchbar';
import MainView from './components/mainview';
import container from './container';
import search from './api/search';
import storage from './storage';

import mixpanel from './mixpanel';

import './App.css';

import $ from 'jquery';

class App extends Component {
  constructor(props) {
    super(props);

    this.events = container.events;
  }

  componentDidMount() {
    container.app = this;
    
    mixpanel.identify(storage.userId);
    mixpanel.people.increment('app opened');
    mixpanel.track('app opened');
  }

  render() {
    const navHeight = 42;
    
    const data = storage.get('data') || {};
    const results = this.props.urls.length > 0 ? [] : (data.results || []);

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
          embed={this.props.embed}
          urls={this.props.urls}
          results={results} />
        </div>

      </div>
    );
  }
}

export default App;
