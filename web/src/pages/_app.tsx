import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import theme from '../theme';
import { createUrqlClient } from '../utils/createUrqlClient';

function MyApp({ Component, pageProps }: any) {
  return (
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
  );
}

export default withUrqlClient(createUrqlClient)(MyApp);
// export default MyApp;

