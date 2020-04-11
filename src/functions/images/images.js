const fetch = require('node-fetch');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

exports.postImage = async (event, context, callback) => {
	var response = {
		status: 200
	}

	var imageResponse = await fetch('https://img1.looper.com/img/gallery/fans-are-angry-at-avengers-endgame-over-this-one-thing/intro-1556202629.jpg')

	if (imageResponse.ok) {
		var imageBody = await imageResponse.buffer()

		await s3.putObject({
			Bucket: 'betogether-images',
			Key: 'test.img',
			Body: imageBody
		}).promise()

	} else {
		response.status = 500
	}

	return {
		'statusCode': response.status,
		'body': JSON.stringify(response)
	};
};
