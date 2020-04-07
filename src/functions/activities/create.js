const db = require('../../util/db');

exports.create = async (event, context, callback) => {
    let body = JSON.parse(event.body);
    
    let datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let results = await db.transaction()
      .query('INSERT INTO item (id, title, image, description, category, app_user, creation) VALUES(DEFAULT, ?, ?, ?, ?, ?, ?)', [body.title, body.image, body.description, body.category, body.app_user, datetime])
      .query((r) => ['INSERT INTO activity(id) VALUES (?)', r.insertId])
      .rollback(e => { /* do something with the error */ }) // optional
			.commit();
			
    // Run clean up function
		await db.end();
		
    return {
        'statusCode': 201,
        'body': JSON.stringify(results)
    };
};
