import { Button, Modal, Input, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, ChakraProvider } from '@chakra-ui/react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import UserOperations from '../../../../graphql/operations/user'
import ConversationOperations from '../../../../graphql/operations/conversation'
import { CreateConversationData, CreateConversationInput, SearchedUser, SearchUsersData, SearchUsersInput } from '@/util/types';
import UserSearchList from './UserSearchList';
import  { theme } from '@/chakra/theme'
import Participants from './Participants';
import { toast } from 'react-hot-toast';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';

interface IModalProps {
    isOpen:boolean;
    onClose:()=>void;
    session:Session
}

const ConversationModal: React.FunctionComponent<IModalProps> = ({isOpen ,onClose,  session}) => {
  const router = useRouter()
    const { user:{id:userId} } = session
    const [ username , setUsername] = useState('')
    const [participants ,setParticipants] = useState<Array<SearchedUser>>([])
    const [searchUsers , { data , error , loading}] = useLazyQuery<SearchUsersData,SearchUsersInput>(UserOperations.Queries.searchUsers)

    const [createConversation , { loading:createConversationLoading }] = useMutation<CreateConversationData , CreateConversationInput>(ConversationOperations.Mutations.createConversation)

    const onCreateConversation = async ()=>{
      const participantIds = [userId , ...participants.map(p=>p.id)];
      try {
        // create conversation mutation
        const { data } = await createConversation({
          variables:{participantIds}
        })

        if(!data?.createConversation){
           throw new Error("Failed to create conversation")
        }

        const { createConversation:{ conversationId }} = data

        router.push({query:{conversationId}})

        //clear state and close model
        setParticipants([])
        setUsername("");
        onClose();

      } catch (error:any) {
        console.log('onCreateConverstion error' , error)
        toast.error(error?.message)
      }
    }

    const onSearch = (e:React.FormEvent)=>{
        e.preventDefault()
        searchUsers({variables:{username}})
        
    }

   const appParticipant = (user:SearchedUser)=>{
    setParticipants((prev) => [...prev,user])
    setUsername("")
   }

   const removeParticipant = (userId:string)=>{
    setParticipants((prev) => prev.filter(p =>p.id !== userId))
   }

  return (
   
    <Modal isOpen={isOpen} onClose={onClose}>
      
      <ModalContent bg="#2d2d2d" pb={4}>
        <ModalHeader>Create a Conversation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <form onSubmit={onSearch}>
                <Stack spacing={4}>
                    <Input placeholder='Enter a username' value={username} onChange={(e)=>setUsername(e.target.value)}/>
                    <Button type='submit' disabled={!username} isLoading={loading}>
                        Search
                    </Button>
                </Stack>
            </form>
            {data?.searchUsers && <UserSearchList users={data.searchUsers} appParticipant={appParticipant}/>}

           {participants.length !== 0 && (
            <>
           <Participants 
              participants={participants}
              removeParticipant={removeParticipant}
            />
            <Button bg="blue.500" width="100%" mt={6} _hover={{bg:"blue.600"}} isLoading={createConversationLoading} onClick={onCreateConversation}>Create Conversation</Button>
            </>
            )}
        </ModalBody>

      </ModalContent>
    </Modal>
    
  );
};

export default ConversationModal;
