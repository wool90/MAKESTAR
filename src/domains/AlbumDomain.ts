import { Service } from 'typedi';
import { In, IsNull } from 'typeorm';

import { appDataSource } from 'orm';
import { IArtWorkInfo } from 'orm/type';
import { AlbumEntity } from 'orm/entities';

@Service()
export default class AlbumDomain {
    private readonly albumRepository = appDataSource.getRepository(AlbumEntity);

    public async getNeedUpdateForApple(albumIds: number[]) {
        return this.albumRepository.find({
            where: {
                id: In(albumIds),
                appleMusicId: IsNull(),
            },
        });
    }

    public async updateAppleInfo(
        songId: number,
        appleMusicId: string,
        artworkList: IArtWorkInfo[],
        additionalInfo: any
    ) {
        return this.albumRepository.update(songId, {
            appleMusicId,
            artworkList,
            additionalInfo,
        });
    }
}
