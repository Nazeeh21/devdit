import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1618470637614 implements MigrationInterface {
    name = 'Initial1618470637614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment_updoot" ("value" integer NOT NULL, "userId" integer NOT NULL, "commentId" integer NOT NULL, "postId" integer NOT NULL, CONSTRAINT "PK_c991c46466783171c8a7a96fd0f" PRIMARY KEY ("userId", "commentId"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "points" integer NOT NULL DEFAULT '0', "creatorId" integer NOT NULL, "postId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comment_updoot" ADD CONSTRAINT "FK_c037dfddcb2d0b259bb49d0d143" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_updoot" ADD CONSTRAINT "FK_3a1b3e9e4fba4b428d9da203e7d" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_b6bf60ecb9f6c398e349adff52f" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_b6bf60ecb9f6c398e349adff52f"`);
        await queryRunner.query(`ALTER TABLE "comment_updoot" DROP CONSTRAINT "FK_3a1b3e9e4fba4b428d9da203e7d"`);
        await queryRunner.query(`ALTER TABLE "comment_updoot" DROP CONSTRAINT "FK_c037dfddcb2d0b259bb49d0d143"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "comment_updoot"`);
    }

}
