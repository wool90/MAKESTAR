import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';

import { AlbumEntity } from './AlbumEntity';
import { SongEntity } from './SongEntity';

@Entity('artist')
export class ArtistEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    spotifyId: string;

    @Column({ nullable: true })
    appleMusicId: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ nullable: true })
    popularity: number;

    @Column({ nullable: true })
    type: string;

    @ManyToMany(() => AlbumEntity)
    @JoinTable()
    albums: AlbumEntity[];

    @ManyToMany(() => SongEntity)
    @JoinTable()
    songs: SongEntity[];

    @Column({ type: 'jsonb', default: {} })
    additionalInfo: {};

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
