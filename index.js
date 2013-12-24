/***
 * dpd-neo4j
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Alexander Forselius
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 **/


var Resource = require('deployd/lib/resource')
  , httpUtil = require('deployd/lib/util/http')
  , Script = require('deployd/lib/script')
  , neo4j = require('neo4j')
  , util = require('util')
  , path = require('path');
function Neo4JResource() {
  Resource.apply(this, arguments);
  if (this.config.username && this.config.url && this.config.password) {
    this.db = new neo4j.GraphDatabase(this.config.url,       this.config.username, this.config.password);
    
  }
}
util.inherits(Neo4JResource, Resource);

Neo4JResource.label = "Neo4J";
Neo4JResource.events = ["get", "match", "post"];

Neo4JResource.basicDashboard = {
  settings: [{
      name: 'url'
    , type: 'string'
  }, {
      name: 'username'
    , type: 'string'
  }, {
      name: 'password'
    , type: 'string'
  }
  ]
};

module.exports = Neo4JResource;

Neo4JResource.prototype.clientGeneration = true;

Neo4JResource.prototype.handle = function (ctx, next) {
  var parts = ctx.url.split('/').filter(function(p) { return p; });

  var result = {};
  console.log(ctx.url);
  var domain = {
      url: ctx.url
    , parts: parts
    , query: ctx.query
    , body: ctx.body
    , 'this': result
    , setResult: function(val) {
      result = val;
    }
  };
  console.log(this.events);
  if (ctx.method === "POST") {
      var type = ctx.body.type;
      if (!type)
        throw "No type specified";

      switch(type) {
         case "node":
          var node = this.db.createNode(ctx.body.data);
          node.save(function (err, node) {
            if (err) ctx.done(err, {statusCode: 400});
            ctx.done(err, {statusCode: 200, data:err});
          });
          break;
       }
  } else if (ctx.method === "GET") {
    var type = ctx.body.type;
     if (!type)
        throw "No type specified";

    switch (type) {   
    case "node":
      if (domain.parts.length > 0) {
  
        this.db.getNodeById(parts[0], function (err, node) {
          if (err) ctx.done(err, {statusCode: 400});          
          ctx.done(err, {statusCode: 200, data: node.data});
        });
      }
      break;
    }
  } else {
    next();
  }

  
};
