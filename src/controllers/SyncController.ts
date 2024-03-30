import { Container } from 'typedi';
import { Controller, IMiddleware, Get } from '@edcarroll/koa-router-decorators';

import AppleMusicApplication from 'applications/AppleMusicApplication';
import { success } from 'lib/response';

@Controller('/sync')
export default class SyncController {
    async syncAppleMusic(ctx) {
        const appleMusicApplication = Container.get(AppleMusicApplication);
        appleMusicApplication.manualSync().catch((e) => {
            console.error(e);
        });
        success(ctx, 'Sync started');
    }

    @Get('/apple-music')
    public appleMusic: IMiddleware[] = [this.syncAppleMusic];
}
