var fs = require('fs');

module.exports = {
  entryPoint: '',
  cert: fs.readFileSync('./okta.cert', 'utf8')
};
