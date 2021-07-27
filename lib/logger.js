

/*function cli(msg, colors, carriageReturn){
  if(carriageReturn === undefined){
    carriageReturn = '\n';
  }
  if( !(colors instanceof Array) ){
    colors = [colors];
  }
  var _colorStr = '';
  for (var i = 0; i < colors.length; i++) {
    var _color = colors[i];
    _colorStr += (ANSI_CODES[_color] !== undefined) ? ANSI_CODES[_color] : '';
  }
  var _str = '';

  if(typeof(msg) === 'string'){
    _str += _colorStr + msg + ANSI_CODES.off;
  }
  else{
    _str += JSON.stringify(msg, null, 2);
  }
  process.stdout.write(_str + carriageReturn);
} */

function cli(msg) {
  console.log(msg);
}


module.exports = {
  cli
};