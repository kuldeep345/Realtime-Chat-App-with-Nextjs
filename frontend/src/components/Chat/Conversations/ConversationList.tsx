import { ConversationData , ConversationPopulated} from '@/util/types';
import { Box, ChakraProvider, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ConversationItem from './ConversationItem';
import ConversationModal from './Modal/Modal'

interface IConversationListProps {
  session:Session;
  conversations:ConversationPopulated[]
  onViewConversation:(conversationId:string)=>void
}

const ConversationList: React.FC<IConversationListProps> = ({session, conversations , onViewConversation}) => {
  const router = useRouter()
  const {user:{ id:userId }} = session;
  const [ isOpen , setIsOpen] = useState(false)

  const onOpen = ()=>setIsOpen(true);
  const onClose = ()=>setIsOpen(false)
  
  return (
    <Box width='100%'>
      <Box py={2} px={4} mb={4} bg="blackAlpha.300" borderRadius={4} cursor="pointer" onClick={onOpen}>
        <Text textAlign='center' color="whiteAlpha.800" fontWeight={500}>Find or start a conversation</Text>
      </Box>
      <ChakraProvider>
      <ConversationModal isOpen={isOpen} onClose={onClose} session={session}/>
      </ChakraProvider>
      <ChakraProvider>
      {conversations.map((conversation)=>(
        <ConversationItem userId={userId} key={conversation.id} conversation={conversation} onClick={()=>onViewConversation(conversation.id)} isSelected={conversation.id === router.query.conversationId}/>
      ))}
        </ChakraProvider>
    </Box>
  ) ;
};

export default ConversationList;
