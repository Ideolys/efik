const path = require('path');
const helper = require('./helper');
const cli    = require('./logger').cli;
const params = require('./params');
const test = require('./test');


const usage = [
  'Commands',
  '\t efik test [options] ',
  '',
  '[options...]',
  '',
  '\t -b           Abort ("bail") after first test failure',
  '\t -t           Specify test timeout threshold (in milliseconds)  [default:2000]',
  '\t -w           Watch files in the current working directory for changes',
  '\t -W           Watch files and launch direct related test only',
  '\t -f           Start test from this file name (alphabetical order -> like on disk)',
  '',
  '\t -h, --help   Show this help',
].join('\n');


let options = {
  timeout        : 8000,
  fromFile       : /.*/,
  onlyFiles      : /.*/,
  bail           : false
};

let testFiles = [];

// spinner variables
// const spinner = ('win32' === process.platform) ? ['|','/','-','\\'] : ['◜','◠','◝','◞','◡','◟'];
// const frames = spinner.map(function(c) {
//   return sprintf('  \u001b[96m%s \u001b[90mwatching\u001b[0m', c);
// });
// const watchingTimer;


/**
 * Handle parameters of the command "easylink test"
 * @param {array} args : args passed by easylink (process.argv.slice(3))
 */
function handleParams (args) {
  // Read all params
  while (args.length > 0) {
    let _argument = args.shift();
    switch (_argument) {
      case '--help':
      case '-h':
        exit(usage, 0);
        break;
      case '--bail':
      case '-b':
        options.bail = true;
        break;
      case '--timeout':
      case '-t':
        options.timeout = parseInt(args.shift(), 10);
        if (isNaN(options.timeout) === true) {
          exit('Options timeout is not a number', 1);
        }
        break;
      case '-f':
      case '--from':
        options.fromFile = globStringToRegex(args.shift());
        break;
      default:
        if (path.extname(_argument) === '.js') {
          testFiles.push(_argument);
          break;
        }
        exit('Unknown parameters ' + _argument, 1);
    }
  }

  cli('Execution tests with options:');
  cli(options);

  execTest();
}


function exit (msg, errorCode) {
  cli(msg);
  process.exit(errorCode);
}

// function playSpinner () {
//   var _len = frames.length;
//   var _frame = 0;
//   watchingTimer = setInterval(function () {
//     var _str = frames[_frame++ % _len];
//     process.stdout.write('\u001b[0G' + _str);
//   }, 100);
// }
// function stopSpinner () {
//   process.stdout.write('\u001b[2K');
//   clearInterval(watchingTimer);
// }


function execTest () {
  console.log(testFiles[0]);

  for (var i = 0; i < testFiles.length; i++) {
    let _testFile = testFiles[i];
    test._beforeRequire(_testFile);
    require(path.join(params.workDir, _testFile));
  }
  test._run();
  process.exit();
}

// source from https://stackoverflow.com/questions/13818186/converting-shell-wildcards-to-regex
function globStringToRegex (str) {
  return new RegExp(pregQuote(str).replace(/\\\*/, '.*').replace(/\\\?/, '.'));
}

function pregQuote (str, delimiter) {
  return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]'), '\\$&');
}


module.exports = handleParams;

