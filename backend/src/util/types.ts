import { Prisma, PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";
import { conversationPopulated, participantPopulated } from "../graphql/resolvers/conversations";
import { Context } from "graphql-ws/lib/server";
import { PubSub } from "graphql-subscriptions";

export interface GraphQlContext {
    session?:Session | any;
    prisma:PrismaClient;
    pubsub:PubSub
}

export interface Session{
    user:User;
    expires:ISODateString
}

export interface SubscriptionContext extends Context{
    connectionParams:{
        session?:Session
    }
}

export interface User {
    id:string;
    username:string;
    email:string;
    emailVerified:boolean;
    image:string;
    name:string;
}

export interface CreateUsernameResponse {
    success?:boolean;
    error?:string;
}

/**
 * Conversations
 */

export type ConversationPopulated = Prisma.ConversationGetPayload<{
    include:typeof conversationPopulated;
}>

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
    include :typeof participantPopulated
}>