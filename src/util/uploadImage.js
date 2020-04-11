const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports = async (encodedImage) => {
	var response = {
		status: 201
	}

	try {
		var decodedImage = Buffer.from(encodedImage, 'base64');
		
		s3.upload({
			Bucket: 'betogether-images',
			Key: key,
			Body: decodedImage
		}, function(err, data) {
			if (!err) response.url = data.Location
			else throw err
		})

	} catch(err) {
		response.status = 500
	}

	return {
			'statusCode': response.status,
			'body': JSON.stringify(response)
	};
};
