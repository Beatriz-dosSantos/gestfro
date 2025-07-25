import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    if (router && router.replace) {
      const timeout = setTimeout(() => {
        router.replace('/auth/login');
      }, 10); 

      return () => clearTimeout(timeout);
    }
  }, [router]);

  return null;
}
