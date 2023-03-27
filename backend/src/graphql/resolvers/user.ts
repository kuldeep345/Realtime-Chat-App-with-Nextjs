import { User } from "@prisma/client";
import { CreateUsernameResponse, GraphQlContext } from "../../util/types"
import { ApolloError } from 'apollo-server-errors'

const resolvers = {
    Query:{
        searchUsers:async(_:any , args:{ username:string}, context:GraphQlContext ):Promise<Array<User>>=>{
            const { username : searchedUser } = args;
            const { session , prisma } = context;

            if(!session?.user){
               throw new ApolloError("Not authorized")
            }

            const { user:{username : myUsername} } = session

            try {

                const users = await prisma.user.findMany({
                    where:{
                        username:{
                            contains:searchedUser,
                            not:myUsername,
                            mode:'insensitive'
                        }
                    }
                })

                return users
                
            } catch (error:any) {
                console.log("searchedUsers error" , error)
                throw new ApolloError(error?.message)
            }
        }
    },
    
    Mutation:{
        createUsername:async(_:any , args:{ username:string } , context:GraphQlContext):Promise<CreateUsernameResponse>=>{
            const { username } = args
            const { prisma , session } = context

            if(!session?.user){
                return {
                    error:"Not authorized"
                }
            }

            const { id:userId} = session.user
            try {

            const exisitingUser = await prisma.user.findUnique({
                where:{
                    username
                }
             })

             if(exisitingUser) {
                return {
                    error:"Username already taken. Try another"
                }
             }

             await prisma.user.update({
                where:{
                    id:userId
                },
                data:{
                    username
                }
             })

             return { success:true }
                
            } catch (error:any) {
                console.log("createUsername error" , error)
                return {
                    error:error?.message
                }
            }

        }
    },

}

export default resolvers