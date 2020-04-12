const db = require('../../util/db'); 
const uploadImage = require('../../util/uploadImage'); 


exports.getActivities = async (event, context, callback) => {
    var response = {}
    var sql = `
        SELECT item.id, item.title, item.description, item.app_user, item.creation, IFNULL(votes.total, 0) as votes, category.category, item.image, item.url
        FROM item
        INNER JOIN activity
        ON item.id = activity.id
        INNER JOIN category on item.category = category.id
        LEFT JOIN (
            SELECT item, COUNT(*) as total
            FROM vote
            WHERE voted IS TRUE
            GROUP BY item) votes ON item.id = votes.item;
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


exports.getActivitiesByCategory = async (event, context, callback) => {
    console.log(event.queryStringParameters.category)

    var response = {}
    var sql = `
        SELECT item.id, item.title, item.description, item.app_user, item.creation, IFNULL(votes.total, 0) as votes, category.category, item.image, item.url
        FROM item
        INNER JOIN activity
        ON item.id = activity.id
        INNER JOIN category on item.category = category.id
        LEFT JOIN (
            SELECT item, COUNT(*) as total
            FROM vote
            WHERE voted IS TRUE
            GROUP BY item) votes ON item.id = votes.item
        WHERE category.category = (?);
    `

    try {
        var results = await db.query(sql, [event.queryStringParameters.category]);
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


exports.getActivitiesByUser = async (event, context, callback) => {
    console.log(event.queryStringParameters.category)

    var response = {}
    var sql = `
        SELECT item.id, item.title, item.description, item.app_user, item.creation, IFNULL(votes.total, 0) as votes, category.category, item.image, item.url
        FROM item
        INNER JOIN activity
        ON item.id = activity.id
        INNER JOIN category on item.category = category.id
        LEFT JOIN (
            SELECT item, COUNT(*) as total
            FROM vote
            WHERE voted IS TRUE
            GROUP BY item) votes ON item.id = votes.item
        WHERE category.category = (?);
    `

    try {
        var results = await db.query(sql, [event.queryStringParameters.category]);
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

exports.getActivitiesByUser = async (event, context, callback) => {
    console.log(event.queryStringParameters.category)

    var response = {}
    var sql = `
        SELECT item.id, item.title, item.description, item.app_user, item.creation, IFNULL(votes.total, 0) as votes, category.category, item.image, item.url
        FROM item
        INNER JOIN activity
        ON item.id = activity.id
        INNER JOIN category on item.category = category.id
        LEFT JOIN (
            SELECT item, COUNT(*) as total
            FROM vote
            WHERE voted IS TRUE
            GROUP BY item) votes ON item.id = votes.item
        WHERE item.app_user = (?);
    `

    try {
        var results = await db.query(sql, [event.queryStringParameters.user]);
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
    console.log(request)

    var categoryId = {
        'Podcast': 3,
        'Ejercicio': 3,
        'Recetas': 3,
        'Audiovisual': 3,
        'Libros': 3,
        'Juegos': 3,
        'Peques': 3
    }

    var response = {}

    var sqlItem = `
        INSERT INTO item(id, title, image, description, category, app_user, creation) 
        VALUES(DEFAULT, ?, ?, ?, ?, ?, ?)
    `
    var sqlActivity = `
        INSERT INTO activity(id) VALUES (?)
    `

    var imageResponse = await uploadImage(request.image)
    console.log(imageResponse)
    if (imageResponse.url) {
        console.log('EXIT IMAGE')
        request.image_url = imageResponse.url
    } else {
        console.log('NO EXIT IMAGE')
        request.image_url = ''
    }
    delete request.image;
 
    try {
        var results = await db.transaction()
            .query(sqlItem, [request.title, request.image_url, request.description, categoryId[request.category], request.user, datetime])
            .query((r) => [sqlActivity, r.insertId])
            .commit();
        await db.end();
        
        request.id = results[0].insertId
        request.creation = datetime

        response.status = 200
        response.activity = request
    } 
    catch(err) {
        console.log(err)
        response.status = 500
    }
        
    return {
        'statusCode': response.status,
        'body': JSON.stringify(response)
    };
};


exports.postVote = async (event, context, callback) => {
    var response = {}
    var sql = `
        SELECT item.id, item.title
        FROM item
        INNER JOIN activity
        ON item.id = activity.id
        INNER JOIN category on item.category = category.id
        LEFT JOIN (
            SELECT item, COUNT(*) as total
            FROM vote
            WHERE voted IS TRUE
            GROUP BY item) votes ON item.id = votes.item;
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
