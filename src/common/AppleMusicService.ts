import { Service } from 'typedi';
import * as config from 'config';
import got from 'got';

import { SearchTypes } from './constants';
import { IAppleMusicSearchResponse, IAppleMusicSongDetailData, IAppleMusicSearchArtistsResponse } from './type';

@Service()
export default class AppleMusicService {
    private readonly baseUrl: string = config.get('appleMusic.baseUrl');
    private readonly token: string = config.get('appleMusic.token');
    private readonly pageSize: number = 10;

    public async search(
        countryCode: string,
        keyword: string,
        types: SearchTypes[],
        page: number = 1
    ): Promise<IAppleMusicSearchResponse> {
        const response = await got.get(`${this.baseUrl}/v1/catalog/${countryCode}/search`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            searchParams: {
                term: keyword.replace(/ /g, '+'),
                limit: this.pageSize,
                offset: (page - 1) * this.pageSize,
                types: types.join(','),
            },
            resolveBodyOnly: true,
        });

        return JSON.parse(response);
    }

    public async findByIsrc(isrc: string[]): Promise<IAppleMusicSongDetailData[]> {
        const result: IAppleMusicSongDetailData[] = [];
        const chunkSize = 25; // Apple Music API limit

        for (let i = 0; i < isrc.length; i += chunkSize) {
            const isrcChunk = isrc.slice(i, i + chunkSize);
            const response = await got.get(`${this.baseUrl}/v1/catalog/us/songs`, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
                searchParams: {
                    'filter[isrc]': isrcChunk.join(','),
                },
                resolveBodyOnly: true,
            });

            const detail = JSON.parse(response);
            result.push(...detail.data);
        }

        return result;
    }

    public async findArtistById(appleMusicId: string): Promise<IAppleMusicSearchArtistsResponse> {
        const response = await got.get(`${this.baseUrl}/v1/catalog/us/artists/${appleMusicId}`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            resolveBodyOnly: true,
        });

        return JSON.parse(response);
    }
}
