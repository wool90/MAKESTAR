import { IAppleMusicSongAttributes, IAppleMusicArtistData, IAppleMusicAlbumData } from 'common/type';

export interface IAppleMusicTrackInformation {
    id: string;
    href: string;
    type: string;
    attributes: IAppleMusicSongAttributes;
    equivalents: {
        [key: string]: string;
    };
    relationships: {
        artists: {
            data: IAppleMusicArtistData[];
            href: string;
        };
        albums: {
            data: IAppleMusicAlbumData[];
            href: string;
        };
    };
}
