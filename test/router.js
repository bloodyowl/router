var tape = require("tape")
  , router = require("../")

tape("router", function(test){

  test.plan(8)

  var myRouter = router.create()

  function overwriteParser(){
    myRouter.defineParser("number", {
      regexp: /foo/,
      parser: function(){return "foo"}
    })
  }

  test.throws(overwriteParser,"Cannot overwrite defaults parsers", "Cannot overwrite parsers")

  myRouter.defineParser("date", {
    regexp : /(\d{4}\-\d{2}\-\d{2})/,
    parser : function(date){
      return new Date(date).toGMTString()
    }
  })

  myRouter.define("page/{number:id}/{number:n}/{date:date}", function(id, n, date){
    test.equal(id, 1, "Converts int using number parser")
    test.equal(n, .45, "Converts floats using number parser")
    test.equal(date, new Date("2013-12-12").toGMTString(), "Converts using custom parser")
  })

  myRouter.update("page/foo/foo/bar")
  myRouter.update("page/1/.45/2013-12-12")

  myRouter.define("page/{number:n}", function(n){
    test.equal(n, 1.45, "doesn't force update by default if route isn't changed")
  })

  myRouter.update("page/1.45")
  myRouter.update("page/1.45")
  myRouter.update("page/1.45")
  myRouter.update("page/1.45", true)

  function invalidPattern(){
    myRouter.define("{number:i}/{string:i}")
  }

  test.throws(invalidPattern, Error, "prevents name duplication")

  myRouter.define("bar", function(){
    ok(0, "should be reset after removal")
  })
  myRouter.remove("bar")
  myRouter.update("bar")

  myRouter.define("foo", function(){
    ok(0, "should be reset after destroy")
  })

  myRouter.destroy()

  myRouter.update("foo")
  test.deepEqual(myRouter.routes, {}, "router is emptied after destroy")

})
