import { Box, Flex, Link } from '@chakra-ui/layout';
import React from 'react';
import NextLink from 'next/link';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  return (
    <Flex bg='tomato' p={4}>
      <Box ml='auto'>
        <NextLink href='/login'>
          <Link color='black' mr={2}>
            Login
          </Link>
        </NextLink>

        <NextLink href='/register'>
          <Link color='black'>Register</Link>
          </NextLink>
      </Box>
      {/* Pretty good */}
    </Flex>
  );
};

export default Navbar;
