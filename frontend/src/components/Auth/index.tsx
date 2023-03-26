import { CreateUsernameData, CreateUsernameVariables } from "@/util/types";
import { useMutation } from "@apollo/client";
import { Button, Center, Stack, Text, Image, Input } from "@chakra-ui/react";
import { Session } from "inspector";
import { signIn } from "next-auth/react";
import { useState } from "react";
import UserOperations from '../../graphql/operations/user'
import toast from 'react-hot-toast';

interface IAuthProps {
  session:Session | any;
  reloadSession:()=>void;
}

const Auth: React.FC<IAuthProps> = ({session,reloadSession}) => {

  const [ username , setUsername ] = useState("")

  const [createUsername , { loading , error }] = useMutation<CreateUsernameData , CreateUsernameVariables>(UserOperations.Mutations.createUsername)

  const onSubmit = async()=>{
      try {
      const { data } = await createUsername({variables:{username}})

      if(!data){
        throw new Error()
      }

      if(data.createUsername.error){
        const { createUsername:{error} } = data
        throw new Error(error)
      }

      //reload session to obtain new username
      reloadSession()

      toast.success('Username successfully created!')

       reloadSession()
      } catch (error:any) {
        toast.error(error.message)
        console.log("onSubmit error" , error)
      }
  }

  return (
    <Center height="100vh">
        <Stack align="center" spacing={8}>
          {session ? (
            <>
            <Text fontSize="3xl">Create a Username</Text>
            <Input placeholder="Enter a username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
            <Button width="100%"  onClick={onSubmit} isLoading={loading}>Save</Button>
            </>
          ) :(
            <>
            <Text fontSize="3xl">MessengerQl</Text>
            <Button onClick={()=> signIn("google")} leftIcon={<Image height="20px" src="/googlelogo.png"/>}> 
              Continue with google
            </Button>
            </>
          )}
        </Stack>
    </Center>
  );
};

export default Auth;
