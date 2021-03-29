import { Box, Link } from '@chakra-ui/layout';
import React from 'react';
import NextLink from 'next/link';
import { IconButton } from '@chakra-ui/button';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletPostButtonsProps {
  id: number;
  creatorId: number
}

export const EditDeletPostButtons: React.FC<EditDeletPostButtonsProps> = ({
  id,
  creatorId
}) => {
  const [{ data: meData }] = useMeQuery();

  const [, deletePost] = useDeletePostMutation();

  if (meData?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Box>
      <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
        <IconButton
          as={Link}
          mr={4}
          aria-label='Edit Post'
          icon={<EditIcon w={6} h={6} />}
        />
      </NextLink>

      <IconButton
        onClick={async () => {
          await deletePost({ id });
        }}
        aria-label='Delete Post'
        icon={<DeleteIcon w={6} h={6} />}
      />
    </Box>
  );
};
