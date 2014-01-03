module.exports = {
  "number" : {
    regexp : /([0-9]*\.*[0-9]+)/,
    parser : function(arg){
      return parseFloat(arg)
    }
  },
  "boolean" : {
    regexp : /(true|false)/,
    parser : function(bool){
      return bool == "true" ? true : false
    }
  },
  "string" : {
    regexp : /([\s\S]+)/,
    parser : function(arg){
      return String(arg)
    }
  }
}
