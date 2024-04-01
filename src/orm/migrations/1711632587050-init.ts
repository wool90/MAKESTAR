import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1711632587050 implements MigrationInterface {
    name = 'Init1711632587050';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "song" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "isrc" character varying NOT NULL, "duration" integer NOT NULL, "popularity" integer NOT NULL, "genres" jsonb NOT NULL DEFAULT '[]', "explicit" boolean NOT NULL DEFAULT false, "discNumber" integer NOT NULL, "trackNumber" integer NOT NULL, "spotifyId" character varying, "appleMusicId" character varying, "isPlayable" boolean NOT NULL DEFAULT false, "isLocal" boolean NOT NULL DEFAULT false, "availableMarkets" jsonb NOT NULL DEFAULT '[]', "additionalInfo" jsonb NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "albumId" integer, CONSTRAINT "PK_baaa977f861cce6ff954ccee285" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE INDEX "IDX_1cdadc2cd4977bf206354f0dee" ON "song" ("spotifyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a0679a88255aa401dc672aa729" ON "song" ("appleMusicId") `);
        await queryRunner.query(`CREATE INDEX "IDX_af7b72b566a3b5d01a1758e487" ON "song" ("isPlayable") `);
        await queryRunner.query(
            `CREATE TABLE "artist" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "spotifyId" character varying, "appleMusicId" character varying, "imageUrl" character varying, "popularity" integer, "type" character varying, "additionalInfo" jsonb NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "album" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "releaseDate" TIMESTAMP NOT NULL, "totalTracks" integer NOT NULL, "spotifyId" character varying, "appleMusicId" character varying, "isPlayable" boolean NOT NULL DEFAULT true, "popularity" integer, "type" character varying NOT NULL DEFAULT 'album', "artworkList" jsonb NOT NULL DEFAULT '[]', "additionalInfo" jsonb NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "playlist" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "songIds" jsonb NOT NULL DEFAULT '[]', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_538c2893e2024fabc7ae65ad142" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "song_artists_artist" ("songId" integer NOT NULL, "artistId" integer NOT NULL, CONSTRAINT "PK_38fe81fb5fd7ff1e938ab214522" PRIMARY KEY ("songId", "artistId"))`
        );
        await queryRunner.query(`CREATE INDEX "IDX_444e236ce5cc51e9117fdc4b5b" ON "song_artists_artist" ("songId") `);
        await queryRunner.query(`CREATE INDEX "IDX_94917f0a503ce27772bae20e43" ON "song_artists_artist" ("artistId") `);
        await queryRunner.query(
            `CREATE TABLE "artist_albums_album" ("artistId" integer NOT NULL, "albumId" integer NOT NULL, CONSTRAINT "PK_f09d2862fc9ef64ec0ddeea28ec" PRIMARY KEY ("artistId", "albumId"))`
        );
        await queryRunner.query(`CREATE INDEX "IDX_0fc3b07e8f297e7450d86dd502" ON "artist_albums_album" ("artistId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e431e3a12c7375c760ef8a92f4" ON "artist_albums_album" ("albumId") `);
        await queryRunner.query(
            `CREATE TABLE "artist_songs_song" ("artistId" integer NOT NULL, "songId" integer NOT NULL, CONSTRAINT "PK_29476ed90978505b1414f6f94a0" PRIMARY KEY ("artistId", "songId"))`
        );
        await queryRunner.query(`CREATE INDEX "IDX_f9e8e7a3ac642bd35c8d1c5d73" ON "artist_songs_song" ("artistId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f75bfb915dab5c267ba12ed1ca" ON "artist_songs_song" ("songId") `);
        await queryRunner.query(
            `CREATE TABLE "album_artists_artist" ("albumId" integer NOT NULL, "artistId" integer NOT NULL, CONSTRAINT "PK_7ab1f3cfd211e572b529d324662" PRIMARY KEY ("albumId", "artistId"))`
        );
        await queryRunner.query(`CREATE INDEX "IDX_042267cf16006041192432f831" ON "album_artists_artist" ("albumId") `);
        await queryRunner.query(
            `CREATE INDEX "IDX_bce2fa2c71f571a2443d218d1f" ON "album_artists_artist" ("artistId") `
        );
        await queryRunner.query(
            `ALTER TABLE "song" ADD CONSTRAINT "FK_c529927ae410af49faaf2e239a5" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "song_artists_artist" ADD CONSTRAINT "FK_444e236ce5cc51e9117fdc4b5b2" FOREIGN KEY ("songId") REFERENCES "song"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "song_artists_artist" ADD CONSTRAINT "FK_94917f0a503ce27772bae20e430" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "artist_albums_album" ADD CONSTRAINT "FK_0fc3b07e8f297e7450d86dd502e" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "artist_albums_album" ADD CONSTRAINT "FK_e431e3a12c7375c760ef8a92f45" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "artist_songs_song" ADD CONSTRAINT "FK_f9e8e7a3ac642bd35c8d1c5d733" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "artist_songs_song" ADD CONSTRAINT "FK_f75bfb915dab5c267ba12ed1ca5" FOREIGN KEY ("songId") REFERENCES "song"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "album_artists_artist" ADD CONSTRAINT "FK_042267cf16006041192432f8316" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "album_artists_artist" ADD CONSTRAINT "FK_bce2fa2c71f571a2443d218d1f3" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album_artists_artist" DROP CONSTRAINT "FK_bce2fa2c71f571a2443d218d1f3"`);
        await queryRunner.query(`ALTER TABLE "album_artists_artist" DROP CONSTRAINT "FK_042267cf16006041192432f8316"`);
        await queryRunner.query(`ALTER TABLE "artist_songs_song" DROP CONSTRAINT "FK_f75bfb915dab5c267ba12ed1ca5"`);
        await queryRunner.query(`ALTER TABLE "artist_songs_song" DROP CONSTRAINT "FK_f9e8e7a3ac642bd35c8d1c5d733"`);
        await queryRunner.query(`ALTER TABLE "artist_albums_album" DROP CONSTRAINT "FK_e431e3a12c7375c760ef8a92f45"`);
        await queryRunner.query(`ALTER TABLE "artist_albums_album" DROP CONSTRAINT "FK_0fc3b07e8f297e7450d86dd502e"`);
        await queryRunner.query(`ALTER TABLE "song_artists_artist" DROP CONSTRAINT "FK_94917f0a503ce27772bae20e430"`);
        await queryRunner.query(`ALTER TABLE "song_artists_artist" DROP CONSTRAINT "FK_444e236ce5cc51e9117fdc4b5b2"`);
        await queryRunner.query(`ALTER TABLE "song" DROP CONSTRAINT "FK_c529927ae410af49faaf2e239a5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bce2fa2c71f571a2443d218d1f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_042267cf16006041192432f831"`);
        await queryRunner.query(`DROP TABLE "album_artists_artist"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f75bfb915dab5c267ba12ed1ca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f9e8e7a3ac642bd35c8d1c5d73"`);
        await queryRunner.query(`DROP TABLE "artist_songs_song"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e431e3a12c7375c760ef8a92f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0fc3b07e8f297e7450d86dd502"`);
        await queryRunner.query(`DROP TABLE "artist_albums_album"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_94917f0a503ce27772bae20e43"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_444e236ce5cc51e9117fdc4b5b"`);
        await queryRunner.query(`DROP TABLE "song_artists_artist"`);
        await queryRunner.query(`DROP TABLE "playlist"`);
        await queryRunner.query(`DROP TABLE "album"`);
        await queryRunner.query(`DROP TABLE "artist"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_af7b72b566a3b5d01a1758e487"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0679a88255aa401dc672aa729"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1cdadc2cd4977bf206354f0dee"`);
        await queryRunner.query(`DROP TABLE "song"`);
    }
}
