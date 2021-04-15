import { IconButton } from '@chakra-ui/button';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Link } from '@chakra-ui/layout';
import NextLink from 'next/link'
import React from 'react'
import { useDeleteCommentMutation, useMeQuery } from '../generated/graphql';

interface EditDeleteCommentButtonsProps {
id: number;
creatorId: number;
}

export const EditDeleteCommentButtons: React.FC<EditDeleteCommentButtonsProps> = ({id, creatorId}) => {
  const [{ data: meData }] = useMeQuery()

  const [, deleteComment] = useDeleteCommentMutation()

  if(meData?.me?.id !== creatorId) {
    return null
  }
    return (
      <Box>
        <NextLink href='/comment/edit/[id]' as={`/comment/edit/${id}`}>
        <IconButton
          as={Link}
          mr={4}
          aria-label='Edit Comment'
          icon={<EditIcon w={6} h={6} />}
        />
        </NextLink>

        <IconButton
        onClick={async () => {
            await deleteComment({ id });
        }}
        aria-label='Delete Comment'
        icon={<DeleteIcon w={6} h={6} />}
      />
      </Box>
    );
}