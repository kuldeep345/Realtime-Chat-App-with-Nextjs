// npm install @apollo/server express graphql cors body-parser
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import typeDefs from './graphql/typedefs';
import resolvers from './graphql/resolvers';
import { makeExecutableSchema } from '@graphql-tools/schema'
import * as dotenv from 'dotenv'
import { getSession } from 'next-auth/react'
import { PrismaClient } from '@prisma/client'
import { GraphQlContext, Session, SubscriptionContext } from './util/types';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';


interface MyContext {
    token?: String;
}

async function main() {
    dotenv.config()
    const app = express();
    const httpServer = http.createServer(app);
    const prisma = new PrismaClient()
    const pubsub = new PubSub();
    const schema = makeExecutableSchema({
        typeDefs,
        resolvers
    })

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql/subscriptions',
    });

    const serverCleanup = useServer({ schema , context:(ctx:SubscriptionContext)=>{
        if(ctx.connectionParams && ctx.connectionParams.session) {
            const { session } = ctx.connectionParams
            return { session , prisma , pubsub };
        }
        return {  session:null , prisma, pubsub };
    } }, wsServer); 

    const corsOptions = {
        origin: process.env.CLIENT_ORIGIN,
        credentials: true
    }

   

    const server = new ApolloServer<MyContext>({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),

            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    await server.start();
    app.use(
        '/graphql',
        cors<cors.CorsRequest>(corsOptions),
        json(),
        expressMiddleware(server, {
            context: async ({ req, res }): Promise<GraphQlContext> => {
                const session = await getSession({ req }) as Session
                return { session, prisma , pubsub};
            },
        }),
    );

    await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}

main().catch((err) => console.log(err))