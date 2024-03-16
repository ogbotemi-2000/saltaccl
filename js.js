let fs        = require('fs'),
/** prefilled with classes that are used in javascript codes */
    attrs     = new Set(['w-full', 'w-1/2', 'opacity-80', '-right-full', 'hidden', 'v-hfull', 'transit', 'invert', 'bg-white', 'text-gray-900']),
    arr       = ['index.html', 'home.html', 'projects.html', 'services.html', 'integrated.html', 'equipment.html', 'partners.html', 'integrated.html', 'portfolio.html', 'contact.html'],
    index     = 0,
    /**utils below will be provided by the user */
    utils     = [''],
    fxn       = nxt=>fs.readFile(nxt, function(err, buf, buffer) {
      let scripts =[], [head, body] = (buffer = buf.toString()).split(/<body[^>]*>/), trimmed, all_attrs=[new Set], split=300;
/*
body = (trimmed = body.replace(/<!---::REMOVE::-->[\S\s]+<!---::REMOVE::-->/g, e=>''))
.replace(/<script[\S\s]*>[\S\s]+<\/script>/, e=>(scripts.push(e), ''))
.replace(/(id|src|class|style|on[a-z]+)="[^"]+"/g, e=>(attrs.push(e), '_::_'))
.replace(/>[^<]+</g, (m, i)=>'>'+((m=m.replace(/>|<+/g, '').trim()).length?(fs.appendFileSync('./out.txt', `${m}\t----\t${i}\n`), `::_::`):'')+'<'),
*/
    body.replace(/(id|class)="[^"]+"/g, e=>{
      (e.replace(/(id|class)=|"/g, '').split(' ')).forEach((m, el)=>{
        m=m.replace('&amp;', '&').replace(/^[0-9]+|\/|\[|\]|\&|\*|\:|\>/g, e=>'\\'+e);
        // if(!~attrs.indexOf(m)) {
          attrs.add(m)
        // }
      })
    }),
    fs.writeFileSync('trimmed/attrs.txt', [...attrs].join('\n'));
    index<arr.length?fxn(arr[index++]):(
      console.log('::DONE::', attrs.size),
      // fs.appendFileSync('trimmed/attrs.txt', [...attrs].join('\n')),
      [...attrs].forEach((e, i)=>{
        i&&i/split===Math.round(i/split)
        ? all_attrs.push(new Set(e))
        : all_attrs[all_attrs.length-1].add(e)
      }),
      console.log('ALL_ATTRS::DONE', all_attrs.map(e=>e.size)),
      trimCSS(all_attrs) //, [[...attrs]]
    );
// ['./attrs.txt', [...new Set(attrs)].join('\n'), './html.txt', body, './html.html', head+'<\head>'].forEach((e,i,a)=>(e=a[i*=2])&&fs.writeFile(e, a[i+1], console.log))
  });

  fxn(arr[index++])

function trimCSS(all_attrs, matches_arr=[], i=3, matches=new Set, comments=[], css='', ruleEnd, used='', rkeys, files, file, vw_breaks, styles, fn, endDump={}, dump={}) {
  /** vw_breaks will be provided by the user when normal media query matching code fails */
  rkeys = new RegExp('('+Object.keys(vw_breaks = {base:500,sm:640,md:768,lg:1024,xl:1280, '32xl':1536}).join('|')+')\\\\:'),
  files=['css/tailwind.min.css', 'css/mix.css', 'css/all.min.css', 'css/page.css'], !fs.existsSync('trimmed')&&fs.mkdirSync('trimmed'),
  
  fn=()=>{
    used='', css='', styles = fs.readFileSync(file=files[i++]).toString(),
    console.time('LOOP');
    all_attrs.forEach((attrs, attrs_index)=>{
      css='', /** clear the unused css to avoid redundancy */
      console.log('::DONE MATCHING.TRIMMING ATTRS::', attrs.size, all_attrs.length, attrs_index)
      
      for(let canAdd, at_rule, index=0, each, len=styles.length; canAdd=!0, each = styles.charAt(index), index<len;) {
        index/20000 === Math.round(index/20000)&&console.log('::MATCHING.INDEX::', index, loop(styles, {from:index, to:10})[0]);
        
        if(each+styles.charAt(index+1)==='/*') canAdd=0, index = storeComments(index, styles, comments);
        
        if(each==='@'&&!attrs_index) {
          let temp='', res='', add=0, kFrame, added='';
          temp=loop(styles, {from:index, cb:(s,f,t,r)=>{
            if(/@media[^{]+\{/.test(res+=s[add=f])) {(res=res.match(/[0-9]+/g))&&(at_rule=res.join('_')); return true;}
            else if(kFrame||=res.match('keyframes')) {
              if(s[f]==='}'&&(ruleEnd=atRuleEnd(styles, f))[0]) { add=ruleEnd[1], canAdd=(s[ruleEnd[1]]!=='}'), added=ruleEnd[2]; return ruleEnd[0]; }
            }
            else if(s[f-1]===';') {add=f; return true}
          }}), res=temp[0].match('@font-face')?temp[0]+loop(styles, {from:temp[1]+1, cb:(s,f,t,r)=>(add=f, s[f-1]==='}')})[0]:temp[0];

          if(res.charAt(0)) !res.match('@media') ?
            (kFrame=loop(styles, {from:index-1, back:!0, cb:(s,f,t,r)=>!s[f-1]||!s[f-1].match(/\s/)})[0],
            used+=('\n'.repeat(!kFrame.match('\n'))+kFrame+res+added+added).replace('}@', '@'),
            index=add) : (dump[at_rule]||=res+'{', index=add, css+=res);
        }
        
        //update 'each' for changes made to 'index' above
        canAdd&&(css+=each=styles.charAt(index));
        /**making the set of classes in attrs in sizes of 200 makes the loop fast even for files as large
         * as the tailwind css framework
         */
        
        if(/\.|#/g.test(each)&&!/[0-9]/.test(styles.charAt(index+1))) attrs.forEach((attr, to='')=>{
          to=loop(styles, {from:index+1, to:attr.length})[0];
          // fs.appendFile('trimmed/attrs.txt', attr+' '.repeat(30-attr.length)+to+'\n', e=>e)
          
          if(attr===to&&(styles.charAt(attr.length+index+2).match(/\.|\s+|,|\{/)||attrs.has(attr=loop(styles, {from:index+1, cb:(s,f)=>/\.|\s|,|\{/.test(s[f])})[0]
          .replace(/\s+|:[^]+/g, (a,b,c)=>c.charAt(b-1)==='\\'?a:'')))/**/) {
            matches.add(attr), matches_arr.push(attr)

            let _cb=(s,f,bool)=>(!s.charAt(f)||(bool?/\}/:/\}|\{/).test(s.charAt(bool?f-1:f))),
            back=loop(styles, {from:index, back:true, cb:(s,f)=>_cb(s,f)})[0],
            forward=loop(styles, {from:index+attr.length+1, cb:(s,f)=>_cb(s,f, !0)}),
            res='\n'.repeat(!back.match('\n'))+back+attr+forward[0], rclass=res.match(rkeys), brkpt;

            at_rule?dump[at_rule]&&(dump[at_rule]+=res):(/*
              rclass&&(dump[brkpt=vw_breaks[rclass=rclass[0].replace('\\:', '')]])
              ? dump[brkpt]+=res
              : */ used+=res),
            index=forward[1], (back=back.trim()).length>1&&(css=css.replace(back, '')),
            css=css.replace(/(\s+|)(#|\.)$/g, '')
          }
        });

        if(styles.charAt(index)==='}') at_rule&&(ruleEnd=atRuleEnd(styles, index))[0]&&(endDump[at_rule]=ruleEnd[2], at_rule=0);
        index++;
        if(index===len-1) console.log('::DONE::', index, attrs_index, attrs.size);
      }
    })
    // console.log('::COMMENTS::', comments);
    console.timeEnd('LOOP');

    matches.forEach(match=>{
      attrs.delete(match)
    });
    
    fs.writeFileSync('trimmed/matched.txt', [...matches].join('\n')),
    fs.writeFileSync('trimmed/unmatched.txt', [...attrs].join('\n'));

    for(let i in dump) {
      let value;
      if((value=dump[i]).replace(/@[^{]+\{/, '')) /*console.log('::VALUE::', i),*/ used+=value+(endDump[i]||'')
    }
    file = file.split('/').pop(),
    fs.writeFileSync('trimmed/'+file, used),
    fs.writeFileSync('trimmed/_'+file, css);
    console.log('::DONE WRITING::')
    /** the code below add substantial milliseconds in the order of >3000ms to execution time, they will be placed behind a flag */
    // css=css.replace(/\s+/g, (e, rm)=>(rm=new Set(e.split('')), e='', rm.forEach(s=>e+=s), e)),
    // used=used.replace(/\s+/g, (e, rm)=>(rm=new Set(e.split('')), e='', rm.forEach(s=>e+=s), e)),

    //i<files.length&&fn()
  },
  fn()
}
const storeComments=(i, s, arr)=>(loop(s, {from:i, cb:(s,f,t,r)=>s.charAt(f++)+s.charAt(f)==='*/'&&(i=f, arr.push(r[0]+'*/'), !0) }), i),
atRuleEnd=(styles, index, exit_rule, res='')=>(loop(styles, { from:index, cb:(s,f, t, bool)=>(bool=!(t=s[++index]||s[--index]).match(/\s/), res+=s[f], exit_rule=t==='}', bool)}), [exit_rule, index, res]);

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