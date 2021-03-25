import { Box, Flex, Heading, Link, Stack, Text } from '@chakra-ui/layout';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import { Button, IconButton } from '@chakra-ui/button';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { UpdootSection } from '../components/UpdootSection';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as string | null,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
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
          {data!.posts.posts.map((post) => (
            <Flex key={post.id} p={5} shadow='md' borderWidth='1px'>
              <UpdootSection post={post} />
              <Box>
                <Heading fontSize='xl'>{post.title}</Heading>
                <Text>Posted by: {post.creator.username}</Text>
                <Text mt={4}>{post.textSnippet}</Text>
              </Box>
              {/* console.log(post) */}
            </Flex>
            // <div key={post.id}>{post.title}</div>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore && (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            mx='auto'
            my={8}
            colorScheme='cyan'
          >
            Load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
