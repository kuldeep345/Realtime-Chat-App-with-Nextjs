import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ChakraProvider } from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client/react'
import { client } from '@/graphql/apollo-client'
import { Toaster } from 'react-hot-toast';
import { theme } from '@/chakra/theme'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
          <Component {...pageProps} />
          </ChakraProvider>
        <Toaster />
      </SessionProvider>
    </ApolloProvider>
  )
}
