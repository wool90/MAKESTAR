import { ServiceType } from './constants';

export interface IArtWorkInfo {
    url: string;
    width: number;
    height: number;
    service: ServiceType;
    bgColor?: string;
    textColor1?: string;
    textColor2?: string;
    textColor3?: string;
    textColor4?: string;
}

export interface IAdditionalInfo {
    spotify?: any;
    appleMusic?: any;
}
