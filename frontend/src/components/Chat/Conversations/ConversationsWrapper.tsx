import { Box, Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from './ConversationList'
import ConversationOperations from '../../../graphql/operations/conversation'
import { useQuery } from "@apollo/client";
import { ConversationData, ConversationPopulated } from "@/util/types";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface IConversationsWrapperProps {
  session:Session
}

const ConversationsWrapper: React.FC<IConversationsWrapperProps> = ({session}) => {

    const { data: conversationsData , error:conversationsErrror , loading:conversationLoading , subscribeToMore} = useQuery<ConversationData>(ConversationOperations.Queries.conversations)

    const router = useRouter()

    const {query:{conversationId}} = router

    const onViewConversation = async(conversationId:string)=>{
      router.push({query:{ conversationId }})
    }

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

  return (
    <Box
    display={{base:conversationId ? "none" : "flex" , md:"flex"}}
     width={{base:'100%' , md:'400px'}} 
     bg="whiteAlpha.50" 
     py={6} 
     px={3}
     >
      {/* Skeleton Loader */}
        <ConversationList session={session} conversations={conversationsData?.conversations || []} onViewConversation={onViewConversation}/>
    </Box>
  );
};

export default ConversationsWrapper;
