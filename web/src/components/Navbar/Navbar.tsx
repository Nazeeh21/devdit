import { Box, Flex, Link } from '@chakra-ui/layout';
import React from 'react';
import NextLink from 'next/link';
import { useMeQuery, useLogoutMutation } from '../../generated/graphql';
import { Button } from '@chakra-ui/button';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{fetching: logoutFetching}, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();

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
        <Box mr={2}>{data.me.username}</Box>
        <Button onClick={() => {
          logout()
        }} isLoading={logoutFetching} variant='link'>Logout</Button>
      </Flex>
    );
  }
  return (
    <Flex bg='tan' p={4}>
      <Box ml='auto'>{body}</Box>
      {/* Pretty good */}
    </Flex>
  );
};

export default Navbar;
