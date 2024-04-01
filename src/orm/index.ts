import 'reflect-metadata';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as config from 'config';

import { AlbumEntity, ArtistEntity, PlaylistEntity, SongEntity } from 'orm/entities';

export const appDataSource = new DataSource({
    ...config.get<DataSourceOptions>('db'),
    entities: [AlbumEntity, ArtistEntity, PlaylistEntity, SongEntity],
    migrations: [path.join(__dirname, './migrations/*.[jt]s')],
    subscribers: [],
});
