const db = require('../../util/db');

exports.createUser = async (event, context, callback) => {
    body = JSON.parse(event.body);
    let dateObj = new Date();
    let results = await db.transaction()
        .query('INSERT INTO item (id, title, image, description, category, app_user, creation) VALUES(DEFAULT, body.title, body.image, body.description, body.category, body.app_user, Date.now())', [user_id])
        .rollback(e => {
            return {
                'statusCode': 204,
                'body': 'User already exists'
            }
        }) // optional
        .commit(); // execute the queries

    // Run clean up function
    await db.end();
    return {
        'statusCode': 201,
        'body': JSON.stringify(user_id)
    };
};
