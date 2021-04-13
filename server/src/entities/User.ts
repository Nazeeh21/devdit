import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './Comment';
import { CommentUpdoot } from './CommentUpdoot';
import { Post } from './Post';
import { Updoot } from './Updoot';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number; // string is also supported

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column()
  password!: string;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  // field for comment
  @OneToMany(() => Comment, (comment) => comment.creator)
  comments: Comment[];

  @OneToMany(() => Updoot, (updoot) => updoot.user)
  updoots: Updoot[];

  // field for comment updoot
  @OneToMany(() => CommentUpdoot, (commentUpdoot) => commentUpdoot.user)
  commentUpdoots: CommentUpdoot[];

  @Field(() => String)
  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
