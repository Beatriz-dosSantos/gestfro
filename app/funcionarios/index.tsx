import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';

interface Funcionario {
  id: string;
  nomeCompleto: string;
  login: string;
  telefone: string;
  role: 'admin' | 'funcionario';
}

export default function FuncionariosList() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const router = useRouter();
  const { userRole } = useUser(); 

  const carregarFuncionarios = async () => {
    const querySnapshot = await getDocs(collection(db, 'funcionarios'));
    const lista: Funcionario[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      lista.push({
        id: docSnap.id,
        nomeCompleto: data.nomeCompleto ?? 'Sem nome',
        login: data.login ?? '',
        telefone: data.telefone ?? '',
        role: data.role ?? 'funcionario',
      });
    });
    setFuncionarios(lista);
  };

  const excluirFuncionario = async (id: string) => {
    Alert.alert('Confirmar exclusão', 'Tem certeza que deseja excluir este funcionário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'funcionarios', id));
          carregarFuncionarios();
        },
      },
    ]);
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Funcionários</Text>
      <FlatList
        data={funcionarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nomeCompleto}</Text>
            <Text style={styles.text}>Email: {item.login}</Text>
            <Text style={styles.text}>Telefone: {item.telefone}</Text>
            <Text style={styles.text}>Tipo: {item.role}</Text>

            {userRole === 'admin' && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => router.push({  pathname: '/funcionarios/editar/[id]',
                   params: { id: item.id }})}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => excluirFuncionario(item.id)}
                >
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#2C3E45',
  },
  title: {
    fontSize: 24,
    color: '#EAEED6',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#A0D6B4',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
    marginBottom: 4,
  },
  text: {
    color: '#000',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
