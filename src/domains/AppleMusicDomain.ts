import { Service } from 'typedi';
import * as config from 'config';
import got from 'got';

import { SearchTypes } from './constants';
import { IAppleMusicSearchResponse, IAppleMusicSongDetailData } from './type';

@Service()
export default class AppleMusicDomain {
    private readonly baseUrl: string = config.get('appleMusic.baseUrl');
    private readonly token: string = config.get('appleMusic.token');
    private readonly pageSize: number = 10;

    private async requestByPath(path: string) {
        const response = await got.get(`${this.baseUrl}${path}`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            resolveBodyOnly: true,
        });

        return JSON.parse(response);
    }

    public async search(
        countryCode: string,
        keyword: string,
        types: SearchTypes[]
    ): Promise<IAppleMusicSearchResponse> {
        const response = await got.get(`${this.baseUrl}/v1/catalog/${countryCode}/search`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            searchParams: {
                term: keyword.replace(/ /g, '+'),
                limit: this.pageSize,
                types: types.join(','),
            },
            resolveBodyOnly: true,
        });

        return JSON.parse(response);
    }

    public async findByIsrc(isrc: string[]): Promise<IAppleMusicSongDetailData[]> {
        const response = await got.get(`${this.baseUrl}/v1/catalog/us/songs`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            searchParams: {
                'filter[isrc]': isrc.join(','),
            },
            resolveBodyOnly: true,
        });

        const detail = JSON.parse(response);
        return detail.data;
    }
}
