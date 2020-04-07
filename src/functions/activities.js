const db = require('../util/db'); 

exports.getActivities = async (event, context, callback) => {
    // Run your query
    const results = await db.query('SELECT * FROM item');

    // Run clean up function
    await db.end();
    return {
        'statusCode': 200,
        'body': JSON.stringify(results)
    };
};
