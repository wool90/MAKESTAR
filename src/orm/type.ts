import { ServiceType } from './constants';

export interface ArtWorkInfo {
    url: string;
    width: number;
    height: number;
    service: ServiceType;
}
