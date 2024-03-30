import { Service, Inject } from 'typedi';

import AppleMusicService from 'common/AppleMusicService';
import SongDomain from 'domains/SongDomain';
import ArtistDomain from 'domains/ArtistDomain';
import AlbumDomain from 'domains/AlbumDomain';

@Service()
export default class AppleMusicApplication {
    @Inject() private appleMusicService: AppleMusicService;
    @Inject() private songDomain: SongDomain;
    @Inject() private artistDomain: ArtistDomain;
    @Inject() private albumDomain: AlbumDomain;

    public async manualSync() {
        const songs = await this.songDomain.getNeedUpdateForApple();
        if (songs.length === 0) {
            return;
        }

        const isrcs = songs.map((song) => song.isrc);
        const albumIds = songs.map((song) => song.album.id);
        const response = await this.appleMusicService.findByIsrc(isrcs);
        const albumNeedUpdate = await this.albumDomain.getNeedUpdateForApple(albumIds);
        const artistIds: string[] = [];

        for (const song of songs) {
            const detail = response.find((item) => item.attributes.isrc === song.isrc);
            if (detail) {
                song.additionalInfo.appleMusic = {
                    genreNames: detail.attributes.genreNames,
                    hasCredits: detail.attributes.hasCredits,
                    hasLyrics: detail.attributes.hasLyrics,
                    isAppleDigitalMaster: detail.attributes.isAppleDigitalMaster,
                    playParams: detail.attributes.playParams,
                    previews: detail.attributes.previews,
                    url: detail.attributes.url,
                };
                await this.songDomain.updateAppleInfo(song.id, detail.id, song.additionalInfo);

                const albumTarget = albumNeedUpdate.find((album) => album.id === song.album.id);
                const albumData = detail.relationships.albums?.data.pop();
                if (albumTarget && albumData) {
                    albumTarget.additionalInfo.appleMusic = {
                        href: albumData.href,
                    };
                    await this.albumDomain.updateAppleInfo(albumTarget.id, albumData.id, albumTarget.additionalInfo);
                }

                artistIds.push(...detail.relationships.artists.data.map((artist) => artist.id));
            }
        }

        const existArtists = await this.artistDomain.getArtistByAppleMusicIds(artistIds);
        const artistNeedUpdate = artistIds.filter((id) => !existArtists.find((artist) => artist.appleMusicId === id));
        for (const artistId of artistNeedUpdate) {
            const artistResponse = await this.appleMusicService.findArtistById(artistId);
            const artistDetail = artistResponse.data.pop();
            if (artistDetail) {
                const artistEntity = await this.artistDomain.searchArtistByName(artistDetail.attributes.name);
                if (artistEntity) {
                    artistEntity.additionalInfo.appleMusic = {
                        href: artistDetail.href,
                    };
                    await this.artistDomain.updateAppleInfo(
                        artistEntity.id,
                        artistDetail.id,
                        artistEntity.additionalInfo
                    );
                }
            }
        }
    }
}
