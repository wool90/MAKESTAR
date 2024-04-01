import { Controller, Post, IMiddleware, NestedController } from '@edcarroll/koa-router-decorators';

import PlaylistController from 'controllers/PlaylistController';
import SyncController from './SyncController';
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

    @NestedController()
    public playlistController: PlaylistController = new PlaylistController();

    @NestedController()
    public syncController: SyncController = new SyncController();
}
