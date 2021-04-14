import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

export const useIsAuth = () => {
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery();
  // console.log('router: ', router)
  useEffect(() => {
    if (!fetching && !data?.me) {
      // router.replace('/login?next=' + router.pathname);
      router.replace('/login?next=' + router.asPath);
    }
  }, [data, router, fetching]);
};
