const db = require('../../util/db');

exports.postsignup = async (event, context, callback) => {
    let user_id = event.request.userAttributes.sub;
    console.log(user_id);
    let results = await db.transaction()
        .query('INSERT INTO app_user (id) VALUES(?)', [user_id])
        .rollback(e => {
            return Error(e);
        }) // optional
        .commit(); // execute the queries

    // Run clean up function
    await db.end();
    return event;
};
