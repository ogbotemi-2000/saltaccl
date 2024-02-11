function tryCatch(fn,fx) {
    try {
        fn&&fn()
    } catch (e) {
        fx&&fx(e)
    }
}
let Storage = function(obj, props, key, value, fn, fx, res, clear) {
	Is(obj, 'Object')&&
	(props={}, [!0, !!0, 'prop', 'value', 'key'].forEach(e=>{
		obj[e]&&(props[e]=obj[e])
	}),
	tryCatch(function(fn){
        clear = props.prop==='clear'&&'clear'
		res = localStorage[clear||props.prop+'Item'](props.key, props.value),
		(fn=props.true)&&fn()
	}, props.false))
  return res
}, Xhr =_=>new XMLHttpRequest;

