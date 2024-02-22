window.addEventListener('DOMContentLoaded', _=>animations.addRippleAnimations())
function onScroll(page, mthd, sTop, t) {
  (t = onScroll).lastY||=0, sTop = page.scrollY,
  mthd = cLs, window.topCta&&['show', 'relative', 'absolute']
  .forEach((e, i, a, cls)=>{(cls = topCta.classList)[mthd(heap = sTop < t.lastY)](e),
    i===2&&cls[mthd(!heap)](e), i===1&&cls[mthd(heap)](e)
  }),
  setTimeout(_=>t.lastY=sTop);
  return t.lastY/innerHeight
}

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of the white box if rendered for any reason.
  ['color', 'background'].forEach(e=>textArea.style[e] = 'transparent'),
  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  let msg;
  try {
    var successful = document.execCommand('copy');
    msg = successful ? 'copied' : 'failed to copy';
  } catch (err) {
    msg = 'cannot copy; no support'
  }
  document.body.removeChild(textArea);
  return msg
}