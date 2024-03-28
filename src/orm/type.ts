export enum ServiceType {
    Spotify = 'spotify',
    AppleMusic = 'appleMusic',
}

export interface ArtWorkInfo {
    url: string;
    width: number;
    height: number;
    service: ServiceType;
}
