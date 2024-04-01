import { ServiceType } from 'orm/constants';

export interface IGetPlaylistInput {
    playlistId: number;
    countryCode: string;
    serviceType: ServiceType;
    availableOnly?: boolean;
}
