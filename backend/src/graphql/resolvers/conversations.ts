import { GraphQlContext } from '../../util/types';

const resolvers = {
    Mutation:{
        createConversation:async(_:any , args:{participantsIds:Array<string>} , context:GraphQlContext )=>{
            console.log(args)
        }
    }
}

export default resolvers