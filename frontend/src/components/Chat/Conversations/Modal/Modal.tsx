import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack } from '@chakra-ui/react';
import { useLazyQuery } from '@apollo/client';
import { useState } from 'react';
import UserOperations from '../../../../graphql/operations/user'
import { SearchUsersData, SearchUsersInput } from '@/util/types';

interface IModalProps {
    isOpen:boolean;
    onClose:()=>void;
}

const ConversationModal: React.FunctionComponent<IModalProps> = ({isOpen ,onClose}) => {

    const [ username , setUsername] = useState('')
    const [searchUsers , { data , error , loading}] = useLazyQuery<SearchUsersData,SearchUsersInput>(UserOperations.Queries.searchUsers)

    const onSearch = (e:React.FormEvent)=>{
        e.preventDefault()
        searchUsers({variables:{username}})
        
    }

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#2d2d2d" pb={4}>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <form onSubmit={onSearch}>
                <Stack spacing={4}>
                    <Input placeholder='Enter a username' value={username} onChange={(e)=>setUsername(e.target.value)}/>
                    <Button type='submit' disabled={!username} >
                        Search
                    </Button>
                </Stack>
            </form>
        </ModalBody>

      </ModalContent>
    </Modal>
  </>
  );
};

export default ConversationModal;
