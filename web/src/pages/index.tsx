import { Box, Flex, Heading, Link, Stack, Text } from '@chakra-ui/layout';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import Layout from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import { Button } from '@chakra-ui/button';

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });

  if (!data && !fetching) {
    return <div>You got no posts, query failed for some reason</div>;
  }
  
  return (
    <Layout>
      <Flex alignItems='center' justifyContent='space-between'>
        <Heading>DevDit</Heading>
        <NextLink href='/create-post'>
          <Link>create post</Link>
        </NextLink>
      </Flex>
      <br />
      <div>Assalamu alaikum</div>
      {fetching && !data ? (
        <div>loading...</div>
      ) : (
        <Stack mt={8}>
          {data!.posts.map((post) => (
            <Box key={post.id} p={5} shadow='md' borderWidth='1px'>
              <Heading fontSize='xl'>{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
              {/* console.log(post) */}
            </Box>
            // <div key={post.id}>{post.title}</div>
          ))}
        </Stack>
      )}
      {data && (
        <Flex>
          <Button isLoading={fetching} mx='auto' my={8} colorScheme='cyan'>
            Load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
