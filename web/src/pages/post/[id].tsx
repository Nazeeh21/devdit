import { withUrqlClient } from 'next-urql';
import React from 'react';
import { createUrqlClient } from '../../utils/createUrqlClient';
import Layout from '../../components/Layout';
import { Box, Heading } from '@chakra-ui/layout';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { EditDeletPostButtons } from '../../components/EditDeletPostButtons';
import Comments from '../../components/Comments/Comments';
import CreateComment from '../../components/CreateComment';
// import { Button } from '@chakra-ui/button';
// import { useRouter } from 'next/router';
// import { useGetIntId } from '../../utils/useGetIntId';
// import { useMeQuery } from '../../generated/graphql';

const Post = ({}) => {
  const [{ data, error, fetching }] = useGetPostFromUrl();
//   const router = useRouter();
//   const intId = useGetIntId();
//   const [{ data: meData }] = useMeQuery();

  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    console.log('error in fetching post', error.message);
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>Post not found</Box>
      </Layout>
    );
  }
  return (
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      {data?.post?.text}
      <Box mt={4}>
        <EditDeletPostButtons creatorId={data.post.creator.id} id={data.post.id} />
      </Box>
      {/* {meData?.me?.id === data.post.creator.id && (
        <Box mt={2}>
          <Button
            onClick={() => {
              router.push(`/post/edit/${intId}`);
            }}
            mt={4}
            type='submit'
            colorScheme='teal'
          >
            Update Post
          </Button>
        </Box>
      )} */}
      <Comments pageProps />
      <CreateComment pageProps />
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
