import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
# Error codes can be fond at
# http://initd.org/psycopg/docs/errors.html


class Postgres:

    def __init__(self, host, database_name, user, password, port="5432"):
        try:
            self.conn = psycopg2.connect(host=host, database=database_name, user=user, password=password, port=port)
        except psycopg2.OperationalError as e:
            if "database" in e.args[0]:
                raise DatabaseNotFound()
            elif "role" in e.args[0]:
                raise UserNotFound()
            else:
                # TODO: fe_sendauth: no password supplied
                print("ERROR NOT IDENTIFIED " + str(e))

    @staticmethod
    def from_json(db_info):
        host = db_info["host"]
        db = db_info["db"]
        user = db_info["user"]
        pswd = db_info["pswd"]
        port = "5432"
        if "port" in db_info:
            port = db_info["port"]

        return Postgres(host, db, user, pswd, port)

    def insert(self, insert, values=None):
        id = None
        try:
            cursor = self.conn.cursor()
            cursor.execute(insert, values)
            if "RETURNING" in insert:
                id = cursor.fetchone()[0]
            self.conn.commit()
            cursor.close()
        except psycopg2.Error as e:
            self.conn.rollback()
            if e.pgcode == "23505":
                raise UniqueViolation()
            if e.pgcode == "42P07":
                raise DuplicateTable()
            if e.pgcode == "58P01":
                raise FileNotFound()
            else:
                raise Exception(e)


        return id

    def query(self, query, values=None, fetch=None):
        cursor = self.conn.cursor()
        cursor.execute(query, values)
        if fetch is None:
            data = cursor.fetchall()
            cursor.close()
        elif fetch == 1:
            data = cursor.fetchone()
        elif fetch > 1:
            data = cursor.fetchmany(size=fetch)
        else:
            data = cursor.fetchall()

        rows = self.transform_data(data, cursor)
        cursor.close()

        return rows

    def upload_script(self, script_path):
        file = open(script_path, "r+")
        try:
            cursor = self.conn.cursor()
            cursor.execute(file.read())
            self.conn.commit()
            cursor.close()
        except Exception as e:
            print("ERROR while executing script")
            print(e)
            self.conn.rollback()
        else:
            self.conn.commit()

    @staticmethod
    def transform_data(data, cursor):
        if data is None:
            return None
        elif isinstance(data, list):
            found_data = []
            for row in data:
                r = reg(cursor, row)
                found_data.append(r)

            return found_data
        else:
            r = reg(cursor, data)
            return r

    def create_database(self, database_name):
        self.conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)  # <-- ADD THIS LINE

        try:
            cursor = self.conn.cursor()

            cursor.execute(sql.SQL("CREATE DATABASE {}").format(
                sql.Identifier(database_name))
            )

            cursor.close()
        except psycopg2.Error as e:
            if e.pgcode == "42P04":
                raise DatabaseExists()

    def copy_from_csv(self, file_path, table, sep=","):
        self.insert("COPY {0} FROM '{1}' DELIMITERS '{2}' CSV header;".format(table, file_path, sep))

    def table_exists(self, table_name):
        result = self.query("SELECT exists (select 1 from information_schema.tables where table_name =%s)", (table_name,), fetch=1)
        return result.exists
    
    def table_has_rows(self, table_name):
        result = self.query("SELECT COUNT(*) FROM {0}".format(table_name), fetch=1)
        return result.count != 0

    def remove_rows(self, table_name):
        self.insert("DELETE FROM {0}".format(table_name))

    def delete_table(self, table_name):
        self.insert("DROP TABLE IF EXISTS {0}  CASCADE".format(table_name))

    def close(self):
        self.conn.close()


class QueryPaginator:

    def __init__(self, db, query, n_result_per_page):
        self.db = db
        self.query = query + " OFFSET {0} ROWS FETCH NEXT {1} ROWS ONLY"
        self.n_results_per_page = n_result_per_page
        self.offset = 0

    def __iter__(self):
        return self

    def __next__(self):
        result = self.db.query(self.query.format(self.offset, self.n_results_per_page))
        self.offset += self.n_results_per_page
        if len(result) > 0:
            return result
        else:
            raise StopIteration


class reg(object):
    def __init__(self, cursor, row):
        for (attr, val) in zip((d[0] for d in cursor.description), row) :
            setattr(self, attr, val)


class UniqueViolation(Exception):

    def __init__(self):
        pass

class DatabaseExists(Exception):

    def __init__(self):
        pass

class DuplicateTable(Exception):

    def __init__(self):
        pass

class FileNotFound(Exception):

    def __init__(self):
        pass

class UserNotFound(Exception):

    def __init__(self):
        pass

class DatabaseNotFound(Exception):

    def __init__(self):
        pass
