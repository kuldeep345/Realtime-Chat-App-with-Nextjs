import { ConversationData , ConversationPopulated} from '@/util/types';
import { Box, ChakraProvider, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useState } from 'react';
import ConversationItem from './ConversationItem';
import ConversationModal from './Modal/Modal'

interface IConversationListProps {
  session:Session;
  conversations:ConversationPopulated[]
}

const ConversationList: React.FC<IConversationListProps> = ({session, conversations}) => {

  const [ isOpen , setIsOpen] = useState(false)

  const onOpen = ()=>setIsOpen(true);
  const onClose = ()=>setIsOpen(false)
  console.log(conversations)

  return (
    <Box width='100%'>
      <Box py={2} px={4} mb={4} bg="blackAlpha.300" borderRadius={4} cursor="pointer" onClick={onOpen}>
        <Text textAlign='center' color="whiteAlpha.800" fontWeight={500}>Find or start a conversation</Text>
      </Box>
      <ChakraProvider>
      <ConversationModal isOpen={isOpen} onClose={onClose} session={session}/>
      </ChakraProvider>
      {conversations.map((conversation)=>(
        <ConversationItem key={conversation.id} conversation={conversation}/>
      ))}
    </Box>
  ) ;
};

export default ConversationList;
