const config = require('./config')
console.log(config)

module.exports = require('serverless-mysql')({
	config: config.db
});;
