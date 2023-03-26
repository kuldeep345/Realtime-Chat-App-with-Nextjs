import { Button, Center, Stack, Text, Image, Input } from "@chakra-ui/react";
import { Session } from "inspector";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface IAuthProps {
  session:Session | any;
  reloadSession:()=>void;
}

const Auth: React.FC<IAuthProps> = ({session,reloadSession}) => {

  const [ username , setUsername ] = useState("")

  const onSubmit = async()=>{
      try {
        
      } catch (error) {
        console.log("onSubmit error" , error)
      }
  }

  return (
    <Center height="100vh">
        <Stack align="center" spacing={8}>
          {session ? (
            <>
            <Text fontSize="3xl">Create a Username</Text>
            <Input placeholder="Enter a username" value={username} onChange={(e)=>e.target.value}/>
            <Button width="100%"  onClick={onSubmit}>Save</Button>
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
