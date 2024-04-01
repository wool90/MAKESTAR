import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';

import { useController } from '@edcarroll/koa-router-decorators';
import RootController from 'controllers/RootController';
import { errorHandler } from 'lib/error';
import { error } from 'lib/response';

const app = new Koa();
const router = new Router();

router.get('/health', async (ctx) => {
    ctx.body = 'OK';
});

useController(router, new RootController());

app.use(bodyParser()).use(errorHandler(error)).use(router.routes()).use(router.allowedMethods());

export default app;
