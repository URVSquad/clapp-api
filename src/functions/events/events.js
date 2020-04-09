const db = require('../../util/db'); 

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

