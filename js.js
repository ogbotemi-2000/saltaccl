let fs = require('fs')

fs.writeFileSync('./out.txt', ''),

['home.html', 'projects.html', 'services.html', 'integrated.html', 'equipment.html', 'partners.html', 'integrated.html', 'portfolio.html', 'contact.html']
.forEach((file, i, arr)=>fs.readFile(file, function(err, buffer) {
  let scripts =[], attrs=[], [head, body] = (buffer = buffer.toString()).split(/<body[^,>]+>/), trimmed;
/*
  body = (trimmed = body.replace(/<!---::REMOVE::-->[\S\s]+<!---::REMOVE::-->/g, e=>''))
  .replace(/<script[\S\s]*>[\S\s]+<\/script>/, e=>(scripts.push(e), ''))
  .replace(/(id|src|class|style|on[a-z]+)="[^,"]+"/g, e=>(attrs.push(e), '_::_'))
  .replace(/>[^<]+</g, (m, i)=>'>'+((m=m.replace(/>|<+/g, '').trim()).length?(fs.appendFileSync('./out.txt', `${m}\t----\t${i}\n`), `::_::`):'')+'<'),
*/
  ['nav', 'footer'].forEach(tagName=>buffer=buffer.replace(new RegExp(`<${tagName}[\\S\\s]*>[\\S\\s]+<\/${tagName}>`), '')),
  buffer=buffer.replace(/(\.\.\/)|(\.\/)/g, '../')
  console.log(i==arr.length-1?'::DONE WRITING::':'::WRITING::')
  fs.writeFileSync('frame/'+file, buffer)
// ['./attrs.txt', [...new Set(attrs)].join('\n'), './html.txt', body, './html.html', head+'<\head>'].forEach((e,i,a)=>(e=a[i*=2])&&fs.writeFile(e, a[i+1], console.log))
}));
