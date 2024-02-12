let fs = require('fs')
fs.writeFileSync('./out.txt', '')

fs.readFile('./services.html', function(err, buffer){
  let scripts =[], attrs=[], [head, body] = ['', buffer = buffer.toString()]/*.split(/<body[^,>]+>/)*/, trimmed;
  body = (trimmed = body.replace(/<!---::REMOVE::-->[\S\s]+<!---::REMOVE::-->/g, e=>''))
  .replace(/<script[\S\s]*>[\S\s]+<\/script>/, e=>(scripts.push(e), ''))
  .replace(/(id|src|class|style|on[a-z]+)="[^,"]+"/g, e=>(attrs.push(e), '_::_'))
  .replace(/>[^<]+</g, (m, i)=>'>'+((m=m.replace(/>|<+/g, '').trim()).length?(fs.appendFileSync('./out.txt', `${m}\t----\t${i}\n`), `::_::`):'')+'<'),

['./attrs.txt', [...new Set(attrs)].join('\n'), './html.txt', body, './html.html', '<!DOCTYPE HTML>'+head+'\n<body>'+trimmed]
  .forEach((e,i,a)=>(e=a[i*=2])&&fs.writeFile(e, a[i+1], console.log))
})