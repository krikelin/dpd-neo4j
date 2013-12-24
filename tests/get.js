var Context = require('deployd/lib/context');
var Server = require('deployd/lib/server');
var server = new Server({port: 3000, db: {host: 'localhost', port: 27015, name: 'my-db'}});

var Neo4JResource = require('./../index.js'); 
var config = {};
config.username = 'betafund';
config.password = 'jVpriNkIZ0D6ohgJnKFF';
config.url = 'http://betafund:jVpriNkIZ0D6ohgJnKFF@betafund.sb01.stations.graphenedb.com:24789';
var r = new Neo4JResource(null, {config:config});
r.config = config;
function query(method, data, url) {
  var ctx = new Context(r, {
    method: method,
    body: data,
    parts: url.split('/'),
    setHeader: function () {},
    headers: {
      accept: 'application/json'
    },
    url: url,
  },  {statusCode: 200, setHeader: function () {}, end: function () {}, accept: 'application/json'}, server);
  console.log(r);
  r.handle(ctx, function (err, node) {
    console.log(err);
  });
}

query('POST', {
  data: {'username': 'krikelin'},
  type: 'node'
}, 'http://1');

query('GET', {
   type: 'node',
   data: 1
}, 'http://1/1');
