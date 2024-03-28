import { AlbumType } from 'orm/constants';

import { Category } from './constants';

export interface ISpotifyArtwork {
    url: string;
    width: number;
    height: number;
}

export interface ISpotifyArtist {
    id: string;
    uri: string;
    href: string;
    name: string;
    type: Category;
    external_urls: {
        spotify: string;
    };
}

export interface ISpotifyAlbum {
    id: string;
    uri: string;
    href: string;
    name: string;
    type: Category;
    images: ISpotifyArtwork[];
    artists: ISpotifyArtist[];
    album_type: AlbumType;
    release_date: string;
    total_tracks: number;
    external_urls: {
        spotify: string;
    };
    available_markets: string[];
    release_date_precision: string;
}

export interface ISpotifyTrack {
    id: string;
    uri: string;
    href: string;
    name: string;
    type: Category;
    album: ISpotifyAlbum;
    artists: ISpotifyArtist[];
    explicit: boolean;
    is_local: boolean;
    is_playable?: boolean;
    popularity: number;
    disc_number: number;
    duration_ms: number;
    preview_url: string;
    external_ids: {
        isrc: string;
    };
    track_number: number;
    external_urls: {
        spotify: string;
    };
    available_markets: string[];
}

export interface ISpotifyPlaylist {
    spotify_playlist: string[];
    spotify_track_information: {
        [key: string]: ISpotifyTrack;
    };
}

export interface IAppleMusicArtist {
    id: string;
    href: string;
    type: Category;
}

export interface IAppleMusicAlbum extends IAppleMusicArtist {}

export interface IAppleMusicArtwork {
    url: string;
    width: number;
    height: number;
    bgColor?: string;
    textColor1?: string;
    textColor2?: string;
    textColor3?: string;
    textColor4?: string;
}

export interface IAppleMusicPreviewObject {
    url: string;
}

export interface IAppleMusicAttribute {
    url: string;
    isrc: string;
    name: string;
    artwork: IAppleMusicArtwork;
    previews: IAppleMusicPreviewObject[];
    albumName: string;
    hasLyrics: boolean;
    artistName: string;
    discNumber: number;
    genreNames: string[];
    hasCredits: boolean;
    playParams: {
        id: string;
        kind: string;
    };
    releaseDate: string;
    trackNumber: number;
    durationInMillis: number;
    isAppleDigitalMaster: boolean;
}

export interface IAppleMusicTrack {
    id: string;
    href: string;
    type: Category;
    attributes: IAppleMusicAttribute;
    equivalents: {
        [key: string]: string;
    };
    relationships: {
        artists: {
            data: IAppleMusicArtist[];
            href: string;
        };
        albums: {
            data: IAppleMusicAlbum[];
            href: string;
        };
    };
}

export interface IAppleMusicPlaylist {
    apple_music_playlist: string[];
    apple_music_track_information: {
        [key: string]: IAppleMusicTrack;
    };
}
