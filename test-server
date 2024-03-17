let fs      = require('fs'),
    local   = "../../express",
    express = require(fs.existsSync(local)?local:local.replace('../../', '')),
    app     = express(),
    path    = require('path');

app.use(function (req, res, next) {
    req.url.match(/tail|page|all/)&&(req.url=req.url.replace('css', 'trimmed')),
    console.log(`${req.method} ${req.url}`);
    next(); // Pass control to the next middleware
})
app.use(express.static(path.normalize('./')));

app.listen(3000, function(){
    console.log('Server listening on <PORT>', 3000)
})