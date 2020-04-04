const { WebClient }  = require('@slack/client');

// fetch detailed profiles over a websocket
// like wss://mpmulti-lctt.slack-msgs.com/?flannel=1&token=<token>&start_args=%3Fagent%3Dwebapp_998da1290d9ada9f6f60eebab148cb25488f1284%26simple_latest%3Dtrue%26no_unreads%3Dtrue%26presence_sub%3Dtrue%26mpim_aware%3Dtrue%26canonical_avatars%3Dtrue%26eac_cache_ts%3Dtrue%26no_users%3Dtrue%26no_bots%3Dtrue%26no_members%3Dtrue%26cache_ts%3D0%26only_relevant_ims%3Dtrue
// view-source:https://slack.com/help/test

// getFlannelHostname :: () => Promise<String, Error>
// refreshStore :: (...) => Promise<(), Error>
// initialize :: (cfg) => Promise<(), Error>


module.exports = (config) => {
  const web = new WebClient(config.apiToken);
  return config;
};
