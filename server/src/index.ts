import 'reflect-metadata';
import { COOKIE_NAME, __prod__ } from './constants';
// import { Post } from './entities/Post';
import express from 'express';
import 'dotenv-safe/config';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { Post } from './entities/Post';
import { User } from './entities/User';
import path from 'path';
import { Updoot } from './entities/Updoot';
import { createUserLoader } from './utils/createUserLoader';
import { createUpdootLoader } from './utils/createUpdootLoader';
import { Comment } from './entities/Comment';
import { CommentUpdoot } from './entities/CommentUpdoot';
import { createCommentUpdootLoader } from './utils/createCommentUpdootLoader';
import { CommentResolver } from './resolvers/comment';
// import { sendEmail } from './utils/sendEmail';
// import { User } from './entities/User';
// rerun
const main = async () => {
  // sendEmail('nazeehvahora.786@gmail.com', 'First test email')


  // command for generating tables: npx typeorm migartion:generate -n Initial
  
  const conn = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: true,
    // synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [Post, User, Updoot, Comment, CommentUpdoot],
  });

  await conn.runMigrations()

  // await Post.delete({})

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  app.set('trust proxy', 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      // origin: 'https://devdit-kcbamcz6y-nazeeh2000.vercel.app',
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        sameSite: 'lax', //csrf
        secure: __prod__, //cookie only works in https
        domain: __prod__ ? '.devdit.me' : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver, CommentResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
      commentUpdootLoader: createCommentUpdootLoader(),
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(+process.env.PORT, () => {
    console.log('server started on port localhost:4000');
  });

  // const post = orm.em.create(Post, { title: 'my first post' });
  // await orm.em.persistAndFlush(post);

  // const posts = await orm.em.find(Post, {})
  // console.log(posts)
};

main().catch((e) => {
  console.log(e);
});
