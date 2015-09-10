/**
 * Created by farooqhameed on 8/14/15.
 */

module.exports = {
  getUrl: getUrl
};

function getOptions() {

  var ENV = process.env;

  var defaultOptions = {
    host: 'localhost',
    port: 27017,
    database: 'starter',
    userName: null,
    password: null
  };

  var options = {};
  options.host = ENV.HOST || defaultOptions.host;
  options.port = ENV.PORT || defaultOptions.porthost;
  options.database = ENV.DATABASE || defaultOptions.database;
  options.userName = ENV.DB_USERNAME || defaultOptions.userName;
  options.password = ENV.DB_PASSWORD || defaultOptions.password;


  return options;
}

function getUrl() {
  var url = 'mongodb://';
  var options = getOptions();

  if (options.userName !== null && options.userName !== null)
    url += options.userName + ':' + options.password + '@';

  url += options.host + ':' + options.port + '/' + options.database;

  return url;
}
