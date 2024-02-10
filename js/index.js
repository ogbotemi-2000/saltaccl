function onScroll(page, mthd, sTop, t) {
  (t = onScroll).lastY||=0,
  mthd = cLs, ['show', 'relative', 'absolute']
  .forEach((e, i, a, cls)=>{(cls = topCta.classList)[mthd(heap = (sTop ||= page.scrollY) < t.lastY)](e),
    i===2&&cls[mthd(!heap)](e), i===1&&cls[mthd(heap)](e)
  });
  return (t.lastY=sTop)/innerHeight
}