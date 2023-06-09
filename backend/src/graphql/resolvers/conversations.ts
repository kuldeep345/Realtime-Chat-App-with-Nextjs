import { ConversationPopulated, GraphQlContext } from '../../util/types';
import { ApolloError } from 'apollo-server-errors'
import { Prisma } from '@prisma/client';
import { withFilter } from 'graphql-subscriptions';

const resolvers = {

    Query:{
        conversations:async( _: any , __:any , context:GraphQlContext):Promise<Array<ConversationPopulated>>=>{
            const { session , prisma } = context;
            
            if(!session?.user){
                throw new ApolloError("Not authorized")
            }

            const { user:{id:userId}} = session

        try {

            const conversations = await prisma.conversation.findMany({
                include:conversationPopulated
            })

            return conversations.filter(conversation => !!conversation.participants.find(p => p.userId === userId))
            
        } catch (error:any) {
            console.log('conversations error' , error)
            throw new ApolloError(error?.message)
        }
        }
    },

    Mutation:{
        createConversation:async(_:any , args:{participantIds:Array<string>} , context:GraphQlContext):Promise<{conversationId:string}>=>{
            const { session , prisma , pubsub} = context;
            const { participantIds } = args; 

            if(!session?.user){
                throw new ApolloError("Not authorized")
            }

            const { user:{ id:userId } } = session;

            try {
                const conversation = await prisma.conversation.create({
                    data:{
                        participants:{
                            createMany:{
                                data:participantIds.map(id=>({
                                    userId:id,
                                    hasSeenLatestMessage:id === userId
                                }))
                            }
                        }
                    },
                    include:conversationPopulated
                })

                pubsub.publish('CONVERSATION_CREATED' , {
                    conversationCreated:conversation
                })

                return {
                    conversationId : conversation.id
                }
            } catch (error) {
                console.log('create conversation error', error)
                throw new ApolloError("Error creating conversation")
            }
        },
    },
    Subscription:{
        conversationCreated:{
            
            subscribe:withFilter((_:any, __:any, context:GraphQlContext)=>{
                const { pubsub } = context;
              return pubsub.asyncIterator(['CONVERSATION_CREATED'])
            } ,
             (payload , _ , context:GraphQlContext)=>{
                const { session } = context;
                const { conversationCreated:{participants} } = payload;

                const userIsParticipant = !!participants.find((p:any) => p.userId === session?.user.id)

                return userIsParticipant
             })
        },
    },
};



export const participantPopulated = Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user:{
        select:{
            id:true,
            username:true
        }
    }
})

export const conversationPopulated = Prisma.validator<Prisma.ConversationInclude>()({
    participants:{
        include:participantPopulated
    },
    latestMessage:{
        include:{
            sender:{
                select:{
                    id:true,
                    username:true
                }
            }
        }
    }
})

export default resolvers