## router

[![browser support](https://ci.testling.com/bloodyowl/router.png)](https://ci.testling.com/bloodyowl/router)

### Install

```
$ npm install bloody-router
```

### Require

```javascript
var router = require("bloody-router")
```

### Definition 

The router class lets you bind callbacks to string patterns. 
Its instances contain an `.update` method to pass strings and make the router check them to execute the matching callback. 
To make the parsing easier, parsers are available, and extensible. 

### Methods

#### `router.create()` -> `router instance`

Creates a new class that inherits from `router`. 

#### `router.destroy()`

Empties all of `router`'s routes. 

#### `router.define(pattern, callback)`

Listens to the given `pattern` and binds callback to it. (see [patterns](#patterns)). 

#### `router.remove(pattern)`

Stops listening to the given `pattern`. 

#### `router.defineParser(name, object)`

Creates a custom parser (see [parsers](#parsers)). You cannot overwrite a core parser (number, string or boolean)

#### `router.update(string[, forceUpdate=false])`

Compares string to the patterns, and asynchronously executes its bound callback. If `forceUpdate` is `true`, callback is executed even if there is no change between the actual state and `string`. 

### Patterns

Patterns use the given syntax : 

* definition blocks are delimited by `{` and `}`
* they own two parameters, `parser:name`
* `parser:` is optionnal
* you cannot use twice the same `name` for a value within the same pattern

```javascript
"page/{anyString}"
// -> callback gets `[anyString]` as arguments 
"page/{string:name}"
// -> callback gets `[name]` as arguments 
"page/{number:n}/{string:s}"
// -> callback gets `[n, s]` as arguments 
"validate/{boolean:bool}"
// -> callback gets `[bool]` as arguments 
```

### Parsers

Parsers are objects containing a `regexp` regular expression for matching and a `parser` method to convert the regexp results. 
The regular expression **must** only contain one capturing group. 
If you need to decompose its contents, you'll need to export it within the `parser` method. 
The result of the `regexp` match is passed as first `parser` argument when executed. 
Then, the return value of `parser` is passed to the callback. 

```javascript
myRouter.defineParser("date", {
  regexp : /(\d{4}\-\d{2}\-\d{2})/,
  parser : function(date){
    return new Date(date).toGMTString()
  }
})
```

### Usage

```javascript
var appRouter = router.create()

myRouter.defineParser("date", {
  regexp : /(\d{4}\-\d{2}\-\d{2})/,
  parser : function(date){
    return new Date(date).toGMTString()
  }
})

myRouter.define("/", function(){
  // init home view
})

myRouter.define("/post/{number:id}", function(id){
  typeof id // "number"
  // grab post and init view
})

listen(window, "hashchange", function(){
  myRouter.update(location.hash.slice(1))
})

// to force update somewhere else

myRouter.update("url", true) 
```
