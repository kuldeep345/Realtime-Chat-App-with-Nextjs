import { CreateUsernameResponse, GraphQlContext } from "../../util/types"

const resolvers = {
    Query:{
        searchUsers:()=>{}
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