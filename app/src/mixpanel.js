const mixpanel = require('mixpanel-browser');

if (process.env.NODE_ENV === 'development') {
  mixpanel.init('ea686ee9c008ba9506afe2b7df0898bb');
} else {
  mixpanel.init('9bd50ec09b42d4f9fa902a1f7650160d');
}

export default mixpanel;
