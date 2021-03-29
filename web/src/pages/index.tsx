import { Button } from '@chakra-ui/button';
import { Box, Flex, Heading, Link, Stack, Text } from '@chakra-ui/layout';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { EditDeletPostButtons } from '../components/EditDeletPostButtons';
import Layout from '../components/Layout';
import { UpdootSection } from '../components/UpdootSection';
import { useMeQuery, usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as string | null,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  // const [{ data: meData }] = useMeQuery()

  if (!data && !fetching) {
    return <div>You got no posts, query failed for some reason</div>;
  }

  return (
    <Layout>
      <br />
      <div>Assalamu alaikum</div>
      {fetching && !data ? (
        <div>loading...</div>
      ) : (
        <Stack mt={8}>
          {data!.posts.posts.map((post) =>
            !post ? null : (
              <Flex key={post.id} p={5} shadow='md' borderWidth='1px'>
                <UpdootSection post={post} />
                <Box>
                  <NextLink href='/post/[id]' as={`/post/${post.id}`}>
                    <Link>
                      <Heading fontSize='xl'>{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>Posted by: {post.creator.username}</Text>
                  <Text mt={4}>{post.textSnippet}</Text>
                </Box>
                {/* console.log(post) */}
                <Box mt={4} ml='auto'>
                  <EditDeletPostButtons id={post.id} creatorId={post.creator.id} />
                </Box>

                {/* {meData?.me?.id === post.creator.id && <Box mt={4} ml='auto'>
                  <EditDeletPostButtons id={post.id} />
                </Box>} */}
              </Flex>
              // <div key={post.id}>{post.title}</div>
            )
          )}
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
