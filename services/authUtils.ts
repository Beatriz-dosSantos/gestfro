// services/authUtils.ts
import { updateProfile } from 'firebase/auth';
import { auth } from '@/firebase/config';

export async function atualizarNomeUsuario(nome: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  await updateProfile(user, {
    displayName: nome,
  });
}
