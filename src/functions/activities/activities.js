const db = require('../../util/db'); 

exports.getActivities = async (event, context, callback) => {
    let sql = 'SELECT * FROM item'

    let response = {}

    try {
        let results = await db.query(sql);
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
