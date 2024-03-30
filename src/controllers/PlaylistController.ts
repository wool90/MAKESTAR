import { Container } from 'typedi';
import { Controller, IMiddleware, Get } from '@edcarroll/koa-router-decorators';

import PlaylistApplication from 'applications/PlaylistApplication';
import { GetPlaylistRequest } from 'dto/Playlist.dto';
import { success, error } from 'lib/response';
import { ValidateQuery } from 'lib/validate';

@Controller('/playlist')
export default class PlaylistController {
    @ValidateQuery(GetPlaylistRequest)
    async getPlaylistDetail(ctx) {
        const playlistApplication = Container.get(PlaylistApplication);
        const response = await playlistApplication.getPlaylistDetail(ctx.query);
        success(ctx, response);
    }

    @Get('/')
    public getPlaylist: IMiddleware[] = [this.getPlaylistDetail];
}
