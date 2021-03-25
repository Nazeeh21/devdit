import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { usePostQuery } from '../../generated/graphql';
import Layout from '../../components/Layout';

const Post = ({}) => {
  const router = useRouter();
  const id = router.query.id;

  const intId = typeof id === 'string' ? +id : -1;

  const [{ data, error, fetching }] = usePostQuery({
      pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  let body: any = ''

  if(fetching) {
      body = 'loading'
  } else {
      body = data?.post?.text
  }

  if(error) {
      console.log('error in fetching post', error.message)
  }
  return <Layout>
      <div>{body}</div>
  </Layout>;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
