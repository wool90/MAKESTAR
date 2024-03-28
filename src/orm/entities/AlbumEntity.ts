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

import { ArtWorkInfo } from 'orm/type';

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

    @Column({ default: false })
    isPlayable: boolean;

    @Column({ nullable: true })
    popularity: number;

    @Column({ nullable: true })
    type: string;

    @Column({ type: 'jsonb', default: [] })
    artworkList: ArtWorkInfo[];

    @Column({ type: 'jsonb', default: {} })
    additionalInfo: {};

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
