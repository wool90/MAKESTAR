import { Service } from 'typedi';
import { IsNull, In } from 'typeorm';

import { appDataSource } from 'orm';
import { ArtistEntity } from 'orm/entities';

@Service()
export default class ArtistDomain {
    private readonly artistRepository = appDataSource.getRepository(ArtistEntity);

    public getNeedUpdateForApple() {
        return this.artistRepository.find({
            where: {
                appleMusicId: IsNull(),
            },
            relations: ['albums'],
        });
    }

    public updateAppleInfo(songId: number, appleMusicId: string, additionalInfo: any) {
        return this.artistRepository.update(songId, {
            appleMusicId,
            additionalInfo,
        });
    }

    public getArtistByAppleMusicIds(appleMusicIds: string[]) {
        return this.artistRepository.find({
            where: {
                appleMusicId: In(appleMusicIds),
            },
        });
    }

    public searchArtistByName(name: string) {
        return this.artistRepository
            .createQueryBuilder('artist')
            .where('LOWER(artist.name) = :name', { name: name.toLowerCase() })
            .getOne();
    }
}
