import { Service } from 'typedi';
import { IsNull } from 'typeorm';

import { appDataSource } from 'orm';
import { SongEntity } from 'orm/entities';

@Service()
export default class SongDomain {
    private readonly songRepository = appDataSource.getRepository(SongEntity);

    public async getNeedUpdateForApple() {
        return this.songRepository.find({
            where: {
                appleMusicId: IsNull(),
            },
            relations: ['album'],
        });
    }

    public async updateAppleInfo(songId: number, appleMusicId: string, additionalInfo: any) {
        return this.songRepository.update(songId, {
            appleMusicId,
            additionalInfo,
        });
    }
}
