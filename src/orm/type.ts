import { ServiceType } from './constants';

export interface IArtWorkInfo {
    url: string;
    width: number;
    height: number;
    service: ServiceType;
}

export interface IAdditionalInfo {
    spotify?: any;
    appleMusic?: any;
}
