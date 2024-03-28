module.exports = {
    PORT: process.env.CONF_LISTEN_PORT,
    db: {
        database: process.env.CONF_DB_NAME,
        host: process.env.CONF_DB_HOST,
        password: process.env.CONF_DB_PASSWORD,
        username: process.env.CONF_DB_USER,
        port: process.env.CONF_DB_PORT,
        name: 'default',
        type: 'postgres',
        logger: 'file',
        logging: true,
        migrationsRun: true,
        synchronize: false,
    },
};
