import React, { Component } from 'react';
import SearchBar from './components/searchbar';
import MainView from './components/mainview';
import container from './container';
import search from './api/search';
import storage from './storage';

import './App.css';

import $ from 'jquery';

class App extends Component {
  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.events = container.events;
  }

  componentDidMount() {
    container.app = this;
  }

  onSearch(value) {    
    search(value).then((result) => {
      if (result.videos.length === 0) {
        return;
      }
      const video = result.videos[0];
      this.mainView.addVideo(video);
      this.searchBar.clear();
    });
  }

  render() {
    const navHeight = 42;

    // <nav style={{
    //   height: navHeight
    // }}> 
    //   <SearchBar onSearch={this.onSearch} ref={ searchBar => this.searchBar = searchBar }/>
    // </nav>
    
    const data = storage.get('4play-data') || {};

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
          videos = {data.videos || []} />
        </div>

      </div>
    );
  }
}

export default App;
