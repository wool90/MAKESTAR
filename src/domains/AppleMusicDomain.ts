import { Service } from 'typedi';
import * as config from 'config';
import got from 'got';

import { SearchTypes } from './constants';

@Service()
export default class AppleMusicDomain {
    private readonly baseUrl: string = config.get('appleMusic.baseUrl');
    private readonly token: string = config.get('appleMusic.token');
    private readonly pageSize: number = 10;

    async requestByPath(path: string) {
        const response = await got.get(`${this.baseUrl}${path}`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });

        return JSON.parse(response.body);
    }

    public async search(countryCode: string, keyword: string, types: SearchTypes[]) {
        const response = await got.get(`${this.baseUrl}/v1/catalog/${countryCode}/search`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            searchParams: {
                term: keyword,
                limit: this.pageSize,
                types: types.join(','),
            },
        });

        return JSON.parse(response.body);
    }
}
