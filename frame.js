let fs = require('fs');

if(!fs.existsSync('frame')) fs.mkdirSync('frame'),
['home.html', 'projects.html', 'services.html', 'integrated.html', 'equipment.html', 'partners.html', 'integrated.html', 'portfolio.html', 'contact.html']
.forEach(file=>fs.readFile(file, function(err, buffer) {
  buffer=buffer.toString(),
  ['nav', 'footer'].forEach(tagName=>buffer=buffer.replace(new RegExp(`<${tagName}[\\S\\s]*>[\\S\\s]+<\/${tagName}>`), '')),
  buffer=buffer.replace(/(\.\.\/)|(\.\/)/g, '../'),

  fs.writeFileSync('frame/'+file, buffer)
  console.log('::WRITTEN::', '<Trimmed>', file, 'to frame/',file)
})),
console.log('::DONE::');