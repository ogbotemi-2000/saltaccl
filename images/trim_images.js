const runProcess = require('./runProcess'),
	  path 		 = require('path')
	  more 		 = ' -unsharp 0.25x0.25+8+0.065 -dither None -posterize 136 -quality 82 -define jpeg:fancy-upsampling=off -define png:compression-filter=5 -define png:compression-level=8 -define png:compression-strategy=1 -define png:exclude-chunk=all -interlace none -colorspace sRGB -strip ';

let 	options    = ' -filter Triangle -define filter:support=2 -thumbnail ';
function trimImages(inPath, outPath, width, callback, test, dirname) {
	outPath.replace(/^\$1./, (match, _, str)=>test=str.split('.')[1]),
	dirname = path.dirname(inPath),
	inPath = path.basename(options=inPath+options).split('.'), options+=width||300,
	
	options += more + (inPath.length>1&&test
	? 'res/'+path.sep+inPath[0]+'.'+test
	: outPath);
        options = options.split(' ');
        let count=0;

	runProcess('magick', options, function(){
          //count++<500&&runProcess('magick', options, arguments.callee),
	  console.log('::[DONE]::', arguments)
        })
}
module.exports = trimImages;
trimImages('pat7.png', 'industrious.png', 700);