import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from './ConversationList'
import ConversationOperations from '../../../graphql/operations/conversation'
import { useQuery } from "@apollo/client";
import { ConversationData, ConversationPopulated } from "@/util/types";
import { useEffect } from "react";

interface IConversationsWrapperProps {
  session:Session
}

const ConversationsWrapper: React.FC<IConversationsWrapperProps> = ({session}) => {

    const { data: conversationsData , error:conversationsErrror , loading:conversationLoading , subscribeToMore} = useQuery<ConversationData>(ConversationOperations.Queries.conversations)

    console.log('query data' , conversationsData)

    const subscribeToNewConversations = ()=>{
      subscribeToMore({
        document:ConversationOperations.Subscriptions.conversationCreated,
        updateQuery:(prev , { subscriptionData }:{subscriptionData:{data:{conversationCreated:ConversationPopulated}}}) => {

          if(!subscriptionData.data) return prev;

          console.log("subscription data" , subscriptionData)
          const newConversation = subscriptionData.data.conversationCreated 
          return Object.assign({} , prev , {
            conversations:[newConversation , ...prev.conversations]
          });
        },
      });
    };

    useEffect(() => {
      subscribeToNewConversations();
    }, [])
    

    console.log(conversationsData , conversationLoading , conversationsErrror)

  return (
    <Box width={{base:'100%' , md:'400px'}} bg="whiteAlpha.50" py={6} px={3}>
      {/* Skeleton Loader */}
        <ConversationList session={session} conversations={conversationsData?.conversations || []}/>
    </Box>
  );
};

export default ConversationsWrapper;
