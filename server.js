const fs   = require('fs'),
      path = require('path');

let values = {'-a':'./', '-d':'./', '-p':3000},
    express, app, server,
/*takes less that 1ms; ~0.7ms to be loaded as a module,
use setTimeout to call init when not require'd as a module*/
    timeout = setTimeout(function(exp_path) {
      exp_path = fs.existsSync('node_modules')?'express':'../../express',
      app = (express = require(exp_path))()
      init(app, values),
      app.listen(values['-p'], function() {
        console.log('Server listening on <PORT>', values['-p']);
      })
    }, 1);

module.exports = function(_app, _express, _values) {
  express = _express, server.init(app=_app, values = _values)
  clearTimeout(timeout)
},
server = {init};

function init(app, values) {
  app.use(express.static(path.normalize(values['-a']))),
  app.get('/', (req, res, next, served)=>{
      served = values['-d']+'/' +req.query['f'],
      served = fs.existsSync(served)?served:(values['-d']+'/first.html'),
      console.log('/ endpoint', served),
      res.sendFile(served, {root:'./'})
  }),
  app.get(/[a-z]+/i, (req, res, next)=>{
    res.sendFile(req.url.replace(/\.[a-z]+$/, '.html'), {root:'./'})
  })
}