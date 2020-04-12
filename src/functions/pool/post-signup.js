const db = require('../../util/db');

exports.postsignup = async (event, context, callback) => {
    console.log(event.request.userAttributes);
    //let body = JSON.parse(JSON.stringify(event.body));
    //let ua = body.userAttributes;
    //conole.log(ua);
    let user_id = event.request.userAttributes.sub;
    let is_enterprise = event.request.userAttributes['custom:enterprise'];
    let name = event.request.userAttributes.name;
    let email = event.request.userAttributes.email;
    let username = event.request.userAttributes.username;

    if (is_enterprise == "1"){
        is_enterprise = true;
        let website = event.request.userAttributes['website'];
        let description = event.request.userAttributes['custom:description'];
        let nif = event.request.userAttributes['custom:nif'];
        let results = await db.transaction()
        .query('INSERT INTO app_user (id, name, website, nif, description, is_enterprise, email, username) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [user_id, name, website, nif, description, is_enterprise, email, username])
        .rollback(e => {
            return Error(e);
        }) // optional
        .commit(); // execute the queries
    }
    else{
        is_enterprise = false;
        console.log(user_id);
        let results = await db.transaction()
        .query('INSERT INTO app_user (id, name, is_enterprise, email, username) VALUES(?, ?, ?, ?, ?)', [user_id, name, is_enterprise, email, username])
        .rollback(e => {
            return Error(e);
        }) // optional
        .commit(); // execute the queries
    }




    // Run clean up function
    await db.end();
    return event;
};
