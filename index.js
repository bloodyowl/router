var klass = require("bloody-class")
  , parsers = require("./lib/parsers")
  , _toString = {}.toString
  , isRegExp = function(value){
      return _toString.call(value) == "[object RegExp]"
    }
  , parserRE = /\\\{(?:(\w+)\\\:)*(\w+)\\\}/g
  , escapeRE = /([.*+?^=!:$(){}|[\]\/\\])/g
  , _hasOwnProperty = {}.hasOwnProperty

module.exports = klass.extend({
  constructor : function(){
    this.routes = {}
    this.parsers = Object.create(this.parsers)
    this.lastRoute = null
  },
  destructor : function(){
    this.routes = {}
    this.parsers = Object.create(this.parsers)
    this.lastRoute = null
  },
  define : function(type, callback){
    var routes = this.routes
    routes[type] = {
      callback : callback,
      parser : this.createParser(type)
    }
  },
  remove : function(type) {
    if(!_hasOwnProperty.call(this.routes, type)) return
    delete this.routes[type]
  },
  update : function(string, forceUpdate){
    if(!forceUpdate && this.lastRoute == string) return
    this.lastRoute = string
    Object.keys(this.routes)
      .forEach(function(key){
        var item = this.routes[key]
          , parsed = item.parser(string)
        if(!parsed) return
        setTimeout(function(){
          item.callback.apply(null, parsed)
        }, 0)
        return false
      }, this)
  },
  parsers : parsers,
  defineParser : function(name, object){
    var self = this
    if(name in parsers) throw "Cannot overwrite defaults parsers"
    if(typeof object.parser != "function") {
      throw new TypeError("Expected a function for object.parser")
    }
    if(!isRegExp(object.regexp)) {
      object.regexp = parsers.string.regexp
    }
    self.parsers[name] = object
  },
  createParser : function(type){
    var self = this
      , escapedType = type.replace(escapeRE, "\\$1")
      , paramNames = []
      , parsers = {}
      , fullRoute = escapedType.replace(parserRE, function(expression, parser, property){
          if(_hasOwnProperty.call(parsers, property)) {
            throw new Error("Duplicate value name in " + type + " expression")
          }
          paramNames.push(property)
          return (parsers[property] = self.parsers[parser] || self.parsers.string).regexp.source
        })
      , fullRouteRE = RegExp("^" + fullRoute + "$")

    return function(string){
      var match = string.match(fullRouteRE)
      if(!match) return null
      return match.slice(1).map(function(item, index){
        return parsers[paramNames[index]].parser(item)
      })
    }
  }
})
