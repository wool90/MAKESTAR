import { MigrationInterface, QueryRunner, In } from 'typeorm';
import * as fs from 'fs';

import { AlbumEntity, ArtistEntity, SongEntity, PlaylistEntity } from 'orm/entities';
import { ServiceType, AlbumType } from 'orm/constants';
import { ISpotifyPlaylist, ISpotifyTrack } from 'types/music';

export class SpotifyMigrate1711632611991 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const data = fs.readFileSync('src/orm/migrations/spotify_playlist.json', 'utf-8');
        const spotifyData: ISpotifyPlaylist = JSON.parse(data);
        const albumMap = new Map<string, AlbumEntity>();
        const artistMap = new Map<string, ArtistEntity>();
        const songIds = new Map<string, number>();

        for (const songId of spotifyData.spotify_playlist) {
            const trackInfo = spotifyData.spotify_track_information[songId] as ISpotifyTrack;
            const isrc = trackInfo.external_ids.isrc;
            const songEntity = await queryRunner.manager.findOne(SongEntity, { where: { isrc } });
            if (songEntity) {
                songIds.set(songId, songEntity.id);
                continue;
            }

            for (const artist of trackInfo.artists) {
                if (!artistMap.has(artist.id)) {
                    const artistEntity = await queryRunner.manager.findOne(ArtistEntity, {
                        where: { spotifyId: artist.id },
                    });
                    if (!artistEntity) {
                        const newArtist = new ArtistEntity();
                        newArtist.name = artist.name;
                        newArtist.spotifyId = artist.id;
                        newArtist.additionalInfo = {
                            spotify: {
                                uri: artist.uri,
                                href: artist.href,
                                external_urls: artist.external_urls,
                            },
                        };

                        await queryRunner.manager.save(newArtist);
                        artistMap.set(artist.id, newArtist);
                    } else {
                        artistMap.set(artist.id, artistEntity);
                    }
                }
            }

            if (!albumMap.has(trackInfo.album.id)) {
                const albumEntity = await queryRunner.manager.findOne(AlbumEntity, {
                    where: { spotifyId: trackInfo.album.id },
                });
                if (!albumEntity) {
                    const newAlbum = new AlbumEntity();
                    newAlbum.name = trackInfo.album.name;
                    newAlbum.releaseDate = new Date(trackInfo.album.release_date);
                    newAlbum.totalTracks = trackInfo.album.total_tracks;
                    newAlbum.spotifyId = trackInfo.album.id;
                    newAlbum.artworkList = trackInfo.album.images.map((image) => ({
                        url: image.url,
                        width: image.width,
                        height: image.height,
                        service: ServiceType.Spotify,
                    }));
                    newAlbum.type = trackInfo.album.album_type.toLowerCase() as AlbumType;
                    newAlbum.artists = trackInfo.album.artists.map((artist) => {
                        return artistMap.get(artist.id);
                    });
                    newAlbum.additionalInfo = {
                        spotify: {
                            uri: trackInfo.album.uri,
                            href: trackInfo.album.href,
                            external_urls: trackInfo.album.external_urls,
                            release_date_precision: trackInfo.album.release_date_precision,
                        },
                    };
                    await queryRunner.manager.save(newAlbum);
                    albumMap.set(trackInfo.album.id, newAlbum);
                } else {
                    albumMap.set(trackInfo.album.id, albumEntity);
                }
            }

            const newSong = new SongEntity();
            newSong.isrc = trackInfo.external_ids.isrc;
            newSong.name = trackInfo.name;
            newSong.album = albumMap.get(trackInfo.album.id);
            newSong.artists = trackInfo.artists.map((artist) => {
                return artistMap.get(artist.id);
            });
            newSong.duration = trackInfo.duration_ms;
            newSong.popularity = trackInfo.popularity;
            newSong.genres = [];
            newSong.explicit = trackInfo.explicit;
            newSong.discNumber = trackInfo.disc_number;
            newSong.trackNumber = trackInfo.track_number;
            newSong.spotifyId = trackInfo.id;
            newSong.isPlayable = trackInfo.is_playable;
            newSong.isLocal = trackInfo.is_local;
            newSong.availableMarkets = trackInfo.available_markets;
            newSong.additionalInfo = {
                spotify: {
                    uri: trackInfo.uri,
                    href: trackInfo.href,
                    external_urls: trackInfo.external_urls,
                    preview_url: trackInfo.preview_url,
                    external_ids: trackInfo.external_ids,
                },
            };

            await queryRunner.manager.save(newSong);
            songIds.set(songId, newSong.id);
        }

        const playlistEntity = new PlaylistEntity();
        playlistEntity.name = 'Default Playlist';
        playlistEntity.description = 'Default playlist for all songs';
        playlistEntity.songIds = [...songIds.values()];
        await queryRunner.manager.save(playlistEntity);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const data = fs.readFileSync('src/orm/migrations/spotify_playlist.json', 'utf-8');
        const spotifyData: ISpotifyPlaylist = JSON.parse(data);
        const isrcList = new Set<string>();

        for (const songId of spotifyData.spotify_playlist) {
            const trackInfo = spotifyData.spotify_track_information[songId] as ISpotifyTrack;
            const isrc = trackInfo.external_ids.isrc;
            isrcList.add(isrc);
        }

        await queryRunner.manager.delete(SongEntity, { isrc: In([...isrcList]) });
        await queryRunner.manager.delete(PlaylistEntity, { name: 'Default Playlist' });
    }
}
