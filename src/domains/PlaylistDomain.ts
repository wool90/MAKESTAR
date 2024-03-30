import { Service } from 'typedi';
import { formatDate } from 'date-fns';

import { appDataSource } from 'orm';
import { ServiceType } from 'orm/constants';
import { PlaylistEntity, SongEntity } from 'orm/entities';
import { Category } from 'types/constants';
import { ISpotifyTrack } from 'types/music';

import { IAppleMusicTrackInformation } from './type';

@Service()
export default class PlaylistDomain {
    private readonly playlistRepository = appDataSource.getRepository(PlaylistEntity);
    private readonly songRepository = appDataSource.getRepository(SongEntity);

    private convertAppleMusicFormat(songList: SongEntity[], countryCode: string) {
        const appleMusicIds = songList.map((song) => song.appleMusicId);
        const trackInfo: { [key: string]: IAppleMusicTrackInformation } = {};

        for (const song of songList) {
            trackInfo[song.appleMusicId] = {
                id: song.appleMusicId,
                href: song.additionalInfo.appleMusic?.href,
                type: 'songs',
                attributes: {
                    url: song.additionalInfo.appleMusic?.url,
                    isrc: song.isrc,
                    name: song.name,
                    artwork: song.album.artworkList.filter((art) => art.service === ServiceType.AppleMusic).pop(),
                    previews: song.additionalInfo.appleMusic?.previews,
                    albumName: song.album.name,
                    hasLyrics: song.additionalInfo.appleMusic?.hasLyrics,
                    artistName: song.artists.map((artist) => artist.name).join(', '),
                    discNumber: song.discNumber,
                    genreNames: song.additionalInfo.appleMusic?.genreNames,
                    hasCredits: song.additionalInfo.appleMusic?.hasCredits,
                    playParams: song.additionalInfo.appleMusic?.playParams,
                    releaseDate: formatDate(song.album.releaseDate, 'yyyy-MM-dd'),
                    trackNumber: song.trackNumber,
                    durationInMillis: song.duration,
                    isAppleDigitalMaster: song.additionalInfo.appleMusic?.isAppleDigitalMaster,
                },
                equivalents: {
                    us: song.appleMusicId,
                },
                relationships: {
                    artists: {
                        data: song.artists.map((artist) => ({
                            id: artist.appleMusicId,
                            href: `/v1/catalog/${countryCode.toLowerCase()}/artists/${artist.appleMusicId}`,
                            type: 'artists',
                        })),
                        href: `/v1/catalog/${countryCode.toLowerCase()}/songs/${song.appleMusicId}/artists`,
                    },
                    albums: {
                        data: [
                            {
                                id: song.album.appleMusicId,
                                href: `/v1/catalog/${countryCode.toLowerCase()}/albums/${song.album.appleMusicId}`,
                                type: 'albums',
                            },
                        ],
                        href: `/v1/catalog/${countryCode.toLowerCase()}/songs/${song.appleMusicId}/albums`,
                    },
                },
            };
        }

        return {
            apple_music_playlist: appleMusicIds,
            apple_music_track_information: trackInfo,
        };
    }

    private convertSpotifyFormat(songList: SongEntity[], countryCode: string) {
        const spotifyIds = songList.map((song) => song.spotifyId);
        const trackInfo: { [key: string]: ISpotifyTrack } = {};

        for (const song of songList) {
            trackInfo[song.spotifyId] = {
                id: song.spotifyId,
                type: Category.Track,
                uri: song.additionalInfo.spotify?.uri,
                href: song.additionalInfo.spotify?.href,
                external_urls: song.additionalInfo.spotify?.external_urls,
                name: song.name,
                artists: song.artists.map((artist) => ({
                    id: artist.spotifyId,
                    name: artist.name,
                    uri: artist.additionalInfo.spotify?.uri,
                    href: artist.additionalInfo.spotify?.href,
                    type: Category.Artist,
                    external_urls: artist.additionalInfo.spotify?.external_urls,
                })),
                album: {
                    id: song.album.spotifyId,
                    uri: song.album.additionalInfo.spotify?.uri,
                    href: song.album.additionalInfo.spotify?.href,
                    name: song.album.name,
                    type: Category.Album,
                    release_date: formatDate(song.album.releaseDate, 'yyyy-MM-dd'),
                    total_tracks: song.album.totalTracks,
                    images: song.album.artworkList.filter((art) => art.service === ServiceType.Spotify),
                    album_type: song.album.type,
                    artists: song.artists.map((artist) => ({
                        id: artist.spotifyId,
                        name: artist.name,
                        uri: artist.additionalInfo.spotify?.uri,
                        href: artist.additionalInfo.spotify?.href,
                        type: Category.Artist,
                        external_urls: artist.additionalInfo.spotify?.external_urls,
                    })),
                    external_urls: song.album.additionalInfo.spotify?.external_urls,
                    available_markets: song.availableMarkets,
                    release_date_precision: song.album.additionalInfo.spotify?.release_date_precision,
                },
                external_ids: {
                    isrc: song.isrc,
                },
                is_local: song.isLocal,
                is_playable: song.isPlayable,
                popularity: song.popularity,
                disc_number: song.discNumber,
                duration_ms: song.duration,
                explicit: song.explicit,
                track_number: song.trackNumber,
                available_markets: song.availableMarkets,
                preview_url: song.additionalInfo.spotify?.preview_url,
            };
        }

        return {
            spotify_playlist: spotifyIds,
            spotify_track_information: trackInfo,
        };
    }

    public async getPlaylistById(playlistId: number, countryCode: string, service: ServiceType, availableOnly = false) {
        const playlist = await this.playlistRepository.findOne({
            where: {
                id: playlistId,
            },
        });

        if (!playlist) {
            return null;
        }

        const query = this.songRepository
            .createQueryBuilder('song')
            .innerJoinAndSelect('song.album', 'album')
            .innerJoinAndSelect('song.artists', 'artist')
            .where('song.id IN (:...songIds)', { songIds: playlist.songIds });

        if (availableOnly) {
            query.andWhere('song.availableMarkets @> :countryCode', { countryCode: `["${countryCode}"]` });
        }

        if (service === ServiceType.AppleMusic) {
            query.andWhere('song.appleMusicId IS NOT NULL');
        } else if (service === ServiceType.Spotify) {
            query.andWhere('song.spotifyId IS NOT NULL');
        }

        const songList = await query.getMany();
        const filteredList = playlist.songIds
            .map((songId) => songList.find((song) => song.id === songId))
            .filter(Boolean);

        if (service === ServiceType.AppleMusic) {
            return this.convertAppleMusicFormat(filteredList, countryCode);
        }

        return this.convertSpotifyFormat(filteredList, countryCode);
    }
}
