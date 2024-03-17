let fs         = require('fs'),
    {execFile} = require('child_process');

if(!fs.existsSync('frame')) fs.mkdirSync('frame'),
['home.html', 'projects.html', 'services.html', 'integrated.html', 'equipment.html', 'partners.html', 'integrated.html', 'portfolio.html', 'contact.html']
.forEach(file=>fs.readFile(file, function(err, buffer) {
  buffer=buffer.toString(),
  ['nav', 'footer'].forEach(tagName=>buffer=buffer.replace(new RegExp(`<${tagName}[\\S\\s]*>[\\S\\s]+<\/${tagName}>`), '')),
  buffer=buffer.replace(/(\.\.\/)|(\.\/)/g, '../'),

  fs.writeFileSync('frame/'+file, buffer)
  console.log('::WRITTEN::', '<Trimmed>', file, 'to frame/'+file)
})),
execFile('cp', ['./bg-pattern.png', './frame/'], _=>console.log('::COPIED:: image to directory - `frame`'))
console.log('::DONE::');