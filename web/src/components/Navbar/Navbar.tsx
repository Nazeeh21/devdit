import { Box, Flex, Heading, Link } from '@chakra-ui/layout';
import React from 'react';
import NextLink from 'next/link';
import { useMeQuery, useLogoutMutation } from '../../generated/graphql';
import { Button } from '@chakra-ui/button';
import { isServer } from '../../utils/isServer';
import { useRouter } from 'next/router';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const router = useRouter()
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  // console.log('data : ', data)
  let body = null;

  if (fetching) {
    // data is loading
  } else if (!data?.me) {
    // user not logged in
    body = (
      <>
        <NextLink href='/login'>
          <Link color='black' mr={2}>
            Login
          </Link>
        </NextLink>

        <NextLink href='/register'>
          <Link color='black'>Register</Link>
        </NextLink>
      </>
    );
  } else {
    // user is logged in
    body = (
      <Flex alignItems='center'>
        <NextLink href='/create-post'>
          <Button mr={4} as={Link}>create post</Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async() => {
            await logout();
            router.reload()
          }}
          isLoading={logoutFetching}
          variant='link'
        >
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} position='sticky' top={3} bg='#b8b5ff' p={4} >
      <Flex flex={1} m='auto' alignItems='center' maxW={800}>
      <NextLink href='/'>
        <Link>
          <Heading>
            Devdit
          </Heading>
        </Link>
      </NextLink>
      <Box ml='auto'>{body}</Box>
      {/* Pretty good */}
      </Flex>
    </Flex>
  );
};

export default Navbar;
