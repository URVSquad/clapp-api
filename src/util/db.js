const config = require('./config')

module.exports = require('serverless-mysql')({
	config: config.db
});;
