import 'reflect-metadata';
import * as http from 'http';
import * as config from 'config';

import { appDataSource } from 'orm';
import * as logger from 'lib/logger';
import { sleep, once } from 'lib/utils';
import app from 'app';

const attachShutdownProcedure = (procedure) => {
    const p = once(async () => {
        await procedure();
        await sleep(1000);
        process.exit(0);
    });

    const signals = ['SIGHUP', 'SIGINT', 'SIGTERM'] as const;

    signals.forEach((signal) => {
        process.on(signal, p);
    });
};

export async function createServer() {
    const packageJson = require('../package.json');
    const port = config.get('PORT') || 3000;
    const server = http.createServer(app.callback());

    await appDataSource.initialize();

    logger.info(`[NODE_CONFIG_ENV] ${process.env.NODE_CONFIG_ENV || 'default'}`);
    server.listen(port, () => {
        logger.info(`${packageJson.description} is listening on port ${port}`);
    });

    return { server, dataSource: appDataSource };
}

process.on('unhandledRejection', (err) => {
    logger.error(err);
});

if (require.main === module) {
    createServer()
        .then(({ server, dataSource }) => {
            attachShutdownProcedure(async () => {
                logger.info(new Date().toUTCString(), 'Shutdown procedure started');
                await sleep(Number(process.env.SHUTDOWNTIMEOUT) || 5000);
                // Stop accepting new connection
                server.close();
                await sleep(Number(process.env.SHUTDOWNTIMEOUT) || 10000);
                logger.info(new Date().toUTCString(), 'Server closed');

                await dataSource.destroy();
                logger.info(new Date().toUTCString(), 'Data source destroyed');
            });
        })
        .catch((err) => {
            logger.error('createServer', { err });
        });
}
