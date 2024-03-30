import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    Index,
    ManyToOne,
    ManyToMany,
    JoinTable,
} from 'typeorm';

import { IAdditionalInfo } from 'orm/type';

import { AlbumEntity } from './AlbumEntity';
import { ArtistEntity } from './ArtistEntity';

@Entity('song')
export class SongEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    isrc: string;

    @ManyToOne(() => AlbumEntity, (album) => album.songs)
    @JoinColumn()
    album: AlbumEntity;

    @ManyToMany(() => ArtistEntity)
    @JoinTable()
    artists: ArtistEntity[];

    @Column()
    duration: number;

    @Column()
    popularity: number;

    @Column({ type: 'jsonb', default: [] })
    genres: string[];

    @Column({ default: false })
    explicit: boolean;

    @Column()
    discNumber: number;

    @Column()
    trackNumber: number;

    @Index()
    @Column({ nullable: true })
    spotifyId: string;

    @Index()
    @Column({ nullable: true })
    appleMusicId: string;

    @Index()
    @Column({ default: false })
    isPlayable: boolean;

    @Column({ default: false })
    isLocal: boolean;

    @Column({ type: 'jsonb', default: [] })
    availableMarkets: string[];

    @Column({ type: 'jsonb', default: {} })
    additionalInfo: IAdditionalInfo;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
