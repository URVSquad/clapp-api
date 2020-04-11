const sha1 = require('sha1');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports = async (encodedImage) => {
	var response = {
		status: 201
	}

	try {
		var decodedImage = Buffer.from(encodedImage, 'base64');
		var objectKey = `${sha1(encodedImage)}.png`;
		
		await s3.putObject({
			Bucket: 'betogether-images',
			Key: objectKey,
			Body: decodedImage
		}).promise()

		response.url = `https://betogether-images.s3.eu-west-2.amazonaws.com/${objectKey}`

	} catch(err) {
		response.status = 500
	}

	return response;
};
