import React, { Component } from 'react';
import MainView from './components/mainview';
import container from './container';
import storage from './storage';
import getShortUrl from './api/getshorturl';

import mixpanel from './mixpanel';

import './App.css';

import routes from './routes';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      urls: props.urls || []
    };

    this.events = container.events;
  }

  componentDidMount() {
    container.app = this;
    
    mixpanel.identify(storage.userId);
    mixpanel.people.increment('app opened');
    mixpanel.track('app opened');

    routes.start();
  }

  loadEmbed(id) {
    getShortUrl({
      shortId: id
    }).then((result) => {
      this.setState({
        embed: true,
        urls: result.urls
      });
    });
  }

  showEmbed() {
    this.setState({
      contentType: 'embed'
    });
  }

  showSearchResults(query) {
    this.setState({
      contentType: 'searchResults',
      query: query
    });
  }

  render() {
    const data = storage.get('data') || {};
    const results = this.state.urls.length > 0 ? [] : (data.results || []);

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
          embed={this.state.embed}
          urls={this.state.urls}
          results={results} 
          contentType={this.state.contentType} 
          query={this.state.query} />
        </div>

      </div>
    );
  }
}

export default App;
