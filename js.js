let fs = require('fs')
fs.writeFileSync('./out.txt', '')

fs.readFile('./index.html', function(err, buffer){
  let scripts =[], attrs=[], [head, body] = buffer = buffer.toString().split(/<body[^,>]+>/);
  body = body.replace(/<!---::REMOVE::-->[\S\s]+<!---::REMOVE::-->/, e=>'')
  .replace(/<script[\S\s]*>[\S\s]+<\/script>/, e=>(scripts.push(e), ''))
  .replace(/(class|style|on[a-z]+)="[^,"]+"/g, e=>(attrs.push(e), '_::_'))
  .replace(/>[^,<]+</g, function(m, i) {
    (m=m.replace(/>|<+/g, '')).trim().length&&fs.appendFileSync('./out.txt', `${m}\t----${i}\n`)
    return `>::_::<`
  }),
  ['./attrs.txt', attrs.join('\n'), './html.txt', body]
  .forEach((e,i,a)=>(e=a[i*=2])&&fs.writeFile(e, a[i+1], console.log))
})