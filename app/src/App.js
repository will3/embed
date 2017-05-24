import React, { Component } from 'react';
import MainView from './components/mainview';
import container from './container';
import storage from './storage';
import embedOperation from './api/embed';

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
    embedOperation({
      id: id
    }).then((result) => {
      const state = JSON.parse(result.full_url);
      this.setState({
        embed: true,
        urls: state.urls
      });
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
          results={results} />
        </div>

      </div>
    );
  }
}

export default App;
