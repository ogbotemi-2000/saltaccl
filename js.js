let fs        = require('fs'),
    attrs     = new Set(),
    arr       = ['test.html']//['home.html', 'projects.html', 'services.html', 'integrated.html', 'equipment.html', 'partners.html', 'integrated.html', 'portfolio.html', 'contact.html'],
    index     = 0,
    fxn       = nxt=>fs.readFile(nxt, function(err, buf, buffer) {
      let scripts =[], [head, body] = (buffer = buf.toString()).split(/<body[^>]*>/), trimmed;
/*
body = (trimmed = body.replace(/<!---::REMOVE::-->[\S\s]+<!---::REMOVE::-->/g, e=>''))
.replace(/<script[\S\s]*>[\S\s]+<\/script>/, e=>(scripts.push(e), ''))
.replace(/(id|src|class|style|on[a-z]+)="[^,"]+"/g, e=>(attrs.push(e), '_::_'))
.replace(/>[^<]+</g, (m, i)=>'>'+((m=m.replace(/>|<+/g, '').trim()).length?(fs.appendFileSync('./out.txt', `${m}\t----\t${i}\n`), `::_::`):'')+'<'),
*/
    body.replace(/class="[^"]+"/g, e=>{
      (e.replace(/class=|"/g, '').replace('&amp;', '&').split(' ')).forEach((m, el)=>{
        attrs.add(m)
      })
    }),
    index<arr.length?fxn(arr[index++]):trimCSS()
// ['./attrs.txt', [...new Set(attrs)].join('\n'), './html.txt', body, './html.html', head+'<\head>'].forEach((e,i,a)=>(e=a[i*=2])&&fs.writeFile(e, a[i+1], console.log))
  });

  fxn(arr[index++])
function trimCSS(result='', vw_props, keys, set=new Set(), files, file, i=2, vw_breaks, styles, fn, dump={}) {

  (keys = Object.keys(vw_breaks = {base:500,sm:640,md:768,lg:1024,xl:1280})).forEach(e=>dump[e]=''), dump.root='', dump.kframes = [],
  files=['css/tailwind.min.css', 'css/all.min.css', 'trimmed/page.css'], !fs.existsSync('trimmed')&&fs.mkdirSync('trimmed'),
  vw_props=keys.filter(e=>e.length==2),

  (fn=(match, prop='')=>{
    styles = fs.readFileSync(file=files[i++]).toString(),
    //clear files   
    // fs.writeFileSync('trimmed/'+file.split('/').pop(), ''),
    fs.writeFileSync('trimmed/dump.txt', '');
    console.time('LOOP')
                     
    for(let front, canAdd=!0, index=0, each, len=styles.length; front=n=>Array.from({length:n}).map((_, i)=>styles.charAt(index+i)).join(''), index<len;) {
      each = styles.charAt(index);
      if(each+styles.charAt(index+1)==='/*') canAdd=0, each = styles.charAt(index = storeComments(index, styles, []));
      canAdd&&(result +=each), canAdd=true,
      attrs.forEach((attr, cls='', set, res='')=>{
        ['#', '.'].map(selector=>front(1+attr.length)===(cls=selector+attr))
        .filter(e=>e).length&&loop(styles, {from:index+cls.length, cb:(s,f,t,r)=>{
          res+=s[f];
          if(s[f]==='}') {result+=cls+res, index+=f, console.log('::CHECK::', cls+res, cls); return true};
        }})
      }),
      result=result.replace(/\n+/, e=>'\n'),
      index++;
    }
    console.timeEnd('LOOP')
    fs.appendFileSync('trimmed/dump.txt', result),

    vw_props.forEach(e=>dump[e]=dump[e]&&`@media (min-width: ${vw_breaks[e]}px) {\n${dump[e]}}\n`),
    ['root', ...vw_props].map(e=>dump[e]).forEach(e=>fs.appendFileSync('trimmed/'+file.split('/').pop(), e))
    /*
    (key=keys.find(key=>result[0].match('\\.'+key)))?dump[key]+=match:dump.root+=match,
    result.length===3&&(dump.root=result.shift().replace(/@(media|page)[^\)]+\)/g, '').join()+dump.root);
    */
    console.log('::DONE::')
  })()
}

const storeComments=(i, s, arr)=>(loop(s, {from:i, cb:(s,f,t,r)=>s.charAt(f++)+s.charAt(f)==='*/'&&(i=f, arr.push(r[0]+'*/'), !0) }), i);
function loop(str, props, from, to, cb) {
  len=str.length,
  from = Math.abs(props['from'])||0, to = Math.abs(props['to'])||0, cb = props['cb'];
  if(typeof cb !== 'function') cb =_=>!!0;
  let result = [''], has=!0, reach, down = props['back'];
  if(down) { if(from>len) from=len-1; to=from-to;}
  reach=from+to;

  for(; !cb(str, from, to, result)&&(to?from < reach:has);) {
    result[0] += (has=str.charAt(result[1] = down?from--:from++))||'';

    if(down&&to===from) break;
  }
  if(down) result[0] = result[0].split('').reverse().join(''), result[1] &&= ++result[1];
  return result
}