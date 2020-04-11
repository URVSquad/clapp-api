const db = require('../../util/db');
const uploadImage = require('../../util/uploadImage'); 

exports.getEvents = async (event, context, callback) => {
    var response = {}
    var sql = `
        SELECT *
        FROM item
        INNER JOIN event
        ON item.id = event.id;
    `

    try {
        var results = await db.query(sql);
        await db.end();

        response.status = 200
        response.events = results
    }
    catch(err) {
        response.status = 500
    }

    return {
        'statusCode': response.status,
        'body': JSON.stringify(response)
    };
};

exports.postEvent = async (event, context, callback) => {
  var response = {}
  var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  var request = JSON.parse(event.body)
  var response = {}

  var sqlItem = `
    INSERT INTO item(id, title, image, description, category, app_user, creation)
    VALUES(DEFAULT, ?, ?, ?, ?, ?, ?)
  `
  var sqlEvent = `
    INSERT INTO event(id, event_start, event_end) 
    VALUES(?, ?, ?)
  `

  var imageResponse = await uploadImage(request.image)
  if (imageResponse.url) {
      request.image_url = imageResponse.url
  } else {
      request.image_url = null
  }
  delete request.image;

  try {
    var results = await db.transaction()
      .query(sqlItem, [request.title, request.image_url, request.description, request.category, request.app_user, datetime])
      .query((r) => [sqlEvent, [r.insertId, request.event_start, request.event_end]])
      .commit();
    await db.end();

    request.id = results[0].insertId

    response.status = 200
    response.event = request
  }
  catch(err) {
    response.status = 500
  }

  return {
    'statusCode': response.status,
    'body': JSON.stringify(response)
  };
};
