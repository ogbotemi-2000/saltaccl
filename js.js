let fs = require('fs')
fs.writeFileSync('./out.txt', '')

fs.readFile('./integrated.html', function(err, buffer){
  let scripts =[], attrs=[], [head, body] = buffer = buffer.toString().split(/<body[^,>]+>/), trimmed;
  body = (trimmed = body.replace(/<!---::REMOVE::-->[\S\s]+<!---::REMOVE::-->/g, e=>''))
  .replace(/<script[\S\s]*>[\S\s]+<\/script>/, e=>(scripts.push(e), ''))
  .replace(/(href|class|style|on[a-z]+)="[^,"]+"/g, e=>(attrs.push(e), '_::_'))
  .replace(/>[^,<]+</g, function(m, i) {
    (m=m.replace(/>|<+/g, '')).trim().length&&fs.appendFileSync('./out.txt', `${m}\t----\t${i}\n`)
    return m.trim().length?`>::_::<`:''
  }),
  ['./attrs.txt', attrs.join('\n'), './html.txt', body, './integrated.html', head+'\n<body>'+trimmed]
  .forEach((e,i,a)=>(e=a[i*=2])&&fs.writeFile(e, a[i+1], console.log))
})