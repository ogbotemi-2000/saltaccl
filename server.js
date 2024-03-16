const http    = require('http'),
      fs      = require('fs'),
      path    = require('path'),
      argv    = process.argv.slice(2),
      check   = (a, o, i)=>a[i]?.match(o[i/2]),
      defs    = ['./', 3000, './'],
      options = ['-a', '-p', '-d'],
      values  = {},
      msgs    = [],
      cache  = {};

defs.map((e, i)=>values[options[i]]=e);
for(let i = 0, arr=[], value, len=argv.length, match=_=>(_=_.match(rgx), _&&_[0]), rgx=new RegExp('^('+options.join('|')+')'); i < len;) {
  if(value=match(argv[i])) len&1&&match(argv[i+1])&&argv.splice(i, 1, ...[value, values[value]]), values[value]=path.normalize('./'+argv[i+1]);
  i+=2
};

/* slot in placeholder values here */
values['-a']==='_'&&(msgs.push(`-a :: replacing placeholder '_' with the value - '${values['-d']}' passed to -d`), values['-a'] = values['-d']),

console.log(values);

/* check whether specified folder(s) exist and provide a default fallback otherwise */
['-d', '-a'].forEach(e=>{
  !fs.existsSync(values[e])&&(msgs.push(`${e}, :: ${values[e]}, is not a directory, defaulting to ${values[e]='./'}`))
}),
msgs.forEach(e=>console.log(e));

let served;
/*
serving files as buffers with caching
*/
let format=e=>JSON.stringify(e).replace(/\{|\}|,/g, e=>e=='}'?'\n'+e:e+'\n\t');

http.createServer((req, res, str, params={})=>{
  req.url = decodeURI(req.url),
  req.url = req.url.replace(/\?[^]*/, e=>(query=e.replace('?', '').split('&').forEach(e=>params[(e=e.split('='))[0]]=e[1]), '')),
  req.url=='/'&&(req.url='index.html'),

  req.url.match(/\.html$/)&&(str=[req, res].map(e=>format(e.headers||''))),
  req.url=path.join(values['-d'], req.url);

  req.url.match(/page|all/)&&(req.url=req.url.replace('css', 'trimmed')),
  console.log('::URL::', req.url),

  new Promise((resolve, rej, cached)=>{
    /*(cached=cache[req.url])?resolve(cached):*/fs.readFile(req.url, (err, buf)=>{
      if(err) rej(err);
      else resolve(cache[req.url]=buf)
    })
  }).then(cached=>{
    req.url.match(/\.svg$/)&&res.writeHead(200, {
      'content-type': 'image/svg+xml'
   }),
    res.end(cached)
  }).catch((err, str)=>{
    console.log(str='::ERROR:: '+err)
    res.end(str)
  })
}).listen(port=+values['-p'], function() {
  console.log('Server listening on <PORT>', port, 'under <DIRECTORY>', values['-d'], 'and serving assets from <DIRECTORY>', values['-a']);
})