import { Controller, Post, IMiddleware, Get } from '@edcarroll/koa-router-decorators';

import { success } from 'lib/response';

@Controller('/v1')
export default class RootController {
    @Post('/debug')
    public debug: IMiddleware[] = [
        async (ctx) => {
            console.log(JSON.stringify(ctx.request.body));
            success(ctx);
        },
    ];
}
