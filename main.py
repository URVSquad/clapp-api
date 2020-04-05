from postgres_wrapper import Postgres


def lambda_handler(event, context):
    pg = Postgres('betogether-database.cz57yxdx4cef.eu-west-3.rds.amazonaws.com', 'betogether', 'postgres',
                  '2H6cnR8YWNgW5i9IUb3O')
    activity = pg.query("SELECT * FROM activity", fetch=1)

    return {
        'statusCode': 200,
        'body': {'id': activity.id}
    }


print(lambda_handler(None, None))
