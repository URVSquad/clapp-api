const db = require('../../util/db'); 

exports.getActivities = async (event, context, callback) => {
    var response = {}
    var sql = `
        SELECT *
        FROM item
        INNER JOIN activity
        ON item.id = activity.id;
    `

    try {
        var results = await db.query(sql);
        await db.end();

        response.status = 200
        response.activities = results
    }
    catch(err) {
        response.status = 500
    }

    return {
        'statusCode': response.status,
        'body': JSON.stringify(response)
    };
};

exports.postActivity = async (event, context, callback) => {
    var response = {}
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    var request = JSON.parse(event.body)
    var response = {}

    var sqlItem = `
        INSERT INTO item(id, title, image, description, category, app_user, creation) 
        VALUES(DEFAULT, ?, ?, ?, ?, ?, ?)
    `
    var sqlActivity = `
        INSERT INTO activity(id) VALUES (?)
    `

    try {
        var results = await db.transaction()
            .query(sqlItem, [request.title, request.image, request.description, request.category, request.app_user, datetime])
            .query((r) => [sqlActivity, r.insertId])
            .commit();
        await db.end();
        
        request.id = results[0].insertId
        request.creation = datetime

        response.status = 200
        response.activity = request
    } 
    catch(err) {
        response.status = 500
    }
        
    return {
        'statusCode': response.status,
        'body': JSON.stringify(response)
    };
};
