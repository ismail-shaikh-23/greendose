module.exports = {
  'development': {
    'username': process.env.DB_USERNAME,
    'password': process.env.DB_PASSWORD,
    'database': process.env.DB_DATABASE,
    'host': process.env.DB_HOST,
    'dialect': 'postgres',
    'port': process.env.DB_PORT,
    'logging': false,
  },
  'test': {
    'username': 'postgres',
    'password': '1234',
    'database': 'green-dose-local',
    'host': 'localhost',
    'port': 5432,
    'dialect': 'postgres',
    'logging': false,
  },
  'production': {
    'username': 'root',
    'password': null,
    'database': 'database_production',
    'host': '127.0.0.1',
    'dialect': 'postgres',
    'logging': false,
  },
};
