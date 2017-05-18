import React, { Component } from 'react';
import SearchBar from './components/searchbar';
import MainView from './components/mainview';
import container from './container';
import search from './api/search';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
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
    return (
      <div className="App">
        <nav style={{
          height: navHeight
        }}> 
          <SearchBar onSearch={this.onSearch} ref={ searchBar => this.searchBar = searchBar }/>
        </nav>
      
        <div style={{
          position: 'absolute',
          left: 0,
          top: navHeight,
          right: 0,
          bottom: 0,
          backgroundColor: '#F1F1F1'
        }}>
          <MainView ref={ mainView => this.mainView = mainView }/>
        </div>

      </div>
    );
  }
}

export default App;
