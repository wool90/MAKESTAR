import { Service, Inject } from 'typedi';

import PlaylistDomain from 'domains/PlaylistDomain';

import { IGetPlaylistInput } from './type';

@Service()
export default class PlaylistApplication {
    @Inject() private playlistDomain: PlaylistDomain;

    public async getPlaylistDetail(input: IGetPlaylistInput) {
        return this.playlistDomain.getPlaylistById(
            input.playlistId,
            input.countryCode,
            input.serviceType,
            input.availableOnly
        );
    }
}
