import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ChakraProvider, theme } from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client/react'
import { client } from '@/graphql/apollo-client'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ApolloProvider client={client}>
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
    </ApolloProvider>
  )
}
