import { auth } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function getCurrentUserRole(): Promise<'admin' | 'funcionario' | null> {
  const user = auth.currentUser;
  if (!user) return null;

  const userDoc = await getDoc(doc(db, 'funcionarios', user.uid));
  const data = userDoc.data();
  return data?.role ?? null;
}
