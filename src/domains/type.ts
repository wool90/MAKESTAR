import { SearchTypes } from './constants';

export interface IAppleMusicRelationship {
    albums?: {
        href: string;
        next?: string;
        data: IAppleMusicAlbumData[];
    };
    artists?: {
        href: string;
        next?: string;
        data: IAppleMusicArtistData[];
    };
    songs?: {
        href: string;
        next?: string;
        data: IAppleMusicSongData[];
    };
    playlists?: {
        href: string;
        next?: string;
        data: any[];
    };
    stations?: {
        href: string;
        next?: string;
        data: any[];
    };
    activities?: {
        href: string;
        next?: string;
        data: any[];
    };
    'apple-curators'?: {
        href: string;
        next?: string;
        data: any[];
    };
    curators?: {
        href: string;
        next?: string;
        data: any[];
    };
    'music-videos'?: {
        href: string;
        next?: string;
        data: any[];
    };
    'record-labels'?: {
        href: string;
        next?: string;
        data: any[];
    };
}

export interface IAppleMusicArtwork {
    width: number;
    height: number;
    url: string;
    bgColor: string;
    textColor1: string;
    textColor2: string;
    textColor3: string;
    textColor4: string;
}

export interface IAppleMusicArtistData {
    id: string;
    type: string;
    href: string;
}

export interface IAppleMusicArtistAttributes {
    genreNames: string[];
    name: string;
    url: string;
    artwork: IAppleMusicArtwork;
}

export interface IAppleMusicArtistDetailData extends IAppleMusicArtistData {
    attributes: IAppleMusicArtistAttributes;
    relationships: IAppleMusicRelationship;
}

export interface IAppleMusicAlbumAttributes {
    copyright: string;
    genreNames: string[];
    releaseDate: string;
    isMasteredForItunes: boolean;
    upc: string;
    artwork: IAppleMusicArtwork;
    playParams: {
        id: string;
        kind: string;
    };
    url: string;
    recordLabel: string;
    isCompilation: boolean;
    trackCount: number;
    isSingle: boolean;
    name: string;
    artistName: string;
    isComplete: boolean;
}

export interface IAppleMusicAlbumData {
    id: string;
    type: string;
    href: string;
}

export interface IAppleMusicAlbumDetailData extends IAppleMusicAlbumData {
    attributes: IAppleMusicAlbumAttributes;
    relationships: IAppleMusicRelationship;
}

export interface IAppleMusicSongData {
    id: string;
    type: string;
    href: string;
}

export interface IAppleMusicSongAttributes {
    albumName: string;
    genreNames: string[];
    trackNumber: number;
    releaseDate: string;
    durationInMillis: number;
    isrc: string;
    artwork: IAppleMusicArtwork;
    composerName: string;
    playParams: {
        id: string;
        kind: string;
    };
    url: string;
    discNumber: number;
    hasCredits: boolean;
    isAppleDigitalMaster: boolean;
    hasLyrics: boolean;
    name: string;
    previews: {
        url: string;
    }[];
    artistName: string;
}

export interface IAppleMusicSongDetailData extends IAppleMusicSongData {
    attributes: IAppleMusicSongAttributes;
    relationships: IAppleMusicRelationship;
}

export interface IAppleMusicSearchResponse {
    results: {
        albums?: {
            href: string;
            next?: string;
            data: IAppleMusicAlbumDetailData[];
        };
        artists?: {
            href: string;
            next?: string;
            data: IAppleMusicArtistDetailData[];
        };
        songs?: {
            href: string;
            next?: string;
            data: IAppleMusicSongDetailData[];
        };
        playlists?: {
            href: string;
            next?: string;
            data: any[];
        };
        stations?: {
            href: string;
            next?: string;
            data: any[];
        };
        activities?: {
            href: string;
            next?: string;
            data: any[];
        };
        'apple-curators'?: {
            href: string;
            next?: string;
            data: any[];
        };
        curators?: {
            href: string;
            next?: string;
            data: any[];
        };
        'music-videos'?: {
            href: string;
            next?: string;
            data: any[];
        };
        'record-labels'?: {
            href: string;
            next?: string;
            data: any[];
        };
    };
    meta: {
        results: {
            order: SearchTypes[];
            rawOrder: SearchTypes[];
        };
    };
}
