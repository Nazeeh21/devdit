import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { usePostQuery } from '../../generated/graphql';
import Layout from '../../components/Layout';
import { Box, Heading } from '@chakra-ui/layout';

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

  if(fetching) {
     return <Layout>
         <div>loading...</div>
     </Layout>
  } 

  if(error) {
      console.log('error in fetching post', error.message)
  }

  if(!data?.post) {
      return <Layout>
          <Box>
              Post not found
          </Box>
      </Layout>
  }
  return <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      {data?.post?.text}
  </Layout>;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
