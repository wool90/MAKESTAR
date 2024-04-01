import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
} from 'typeorm';

import { AlbumType } from 'orm/constants';
import { IArtWorkInfo, IAdditionalInfo } from 'orm/type';

import { ArtistEntity } from './ArtistEntity';
import { SongEntity } from './SongEntity';

@Entity('album')
export class AlbumEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    releaseDate: Date;

    @Column()
    totalTracks: number;

    @ManyToMany(() => ArtistEntity)
    @JoinTable()
    artists: ArtistEntity[];

    @OneToMany(() => SongEntity, (song) => song.album)
    songs: SongEntity[];

    @Column({ nullable: true })
    spotifyId: string;

    @Column({ nullable: true })
    appleMusicId: string;

    @Column({ default: true })
    isPlayable: boolean;

    @Column({ nullable: true })
    popularity: number;

    @Column({
        type: 'varchar',
        enum: AlbumType,
        default: AlbumType.Album,
    })
    type: AlbumType;

    @Column({ type: 'jsonb', default: [] })
    artworkList: IArtWorkInfo[];

    @Column({ type: 'jsonb', default: {} })
    additionalInfo: IAdditionalInfo;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
