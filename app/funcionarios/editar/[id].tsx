import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export default function EditarFuncionario() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [login, setLogin] = useState('');
  const [telefone, setTelefone] = useState('');
  const [role, setRole] = useState<'admin' | 'funcionario'>('funcionario');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const carregarFuncionario = async () => {
      try {
        const ref = doc(db, 'funcionarios', id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setNomeCompleto(data.nomeCompleto || '');
          setLogin(data.login || '');
          setTelefone(data.telefone || '');
          setRole(data.role || 'funcionario');
        } else {
          Alert.alert('Erro', 'Funcionário não encontrado.');
          router.back();
        }
      } catch (error) {
        Alert.alert('Erro ao carregar funcionário');
      } finally {
        setLoading(false);
      }
    };

    carregarFuncionario();
  }, [id]);

  const salvarAlteracoes = async () => {
    if (!nomeCompleto || !login || !telefone) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      await updateDoc(doc(db, 'funcionarios', id), {
        nomeCompleto,
        login,
        telefone,
        role,
      });

      Alert.alert('Sucesso', 'Funcionário atualizado com sucesso!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome Completo:</Text>
      <TextInput
        style={styles.input}
        value={nomeCompleto}
        onChangeText={setNomeCompleto}
      />

      <Text style={styles.label}>Login (Email):</Text>
      <TextInput
        style={styles.input}
        value={login}
        onChangeText={setLogin}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Telefone:</Text>
      <TextInput
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Tipo de usuário:</Text>
      <View style={styles.roleContainer}>
        <Button
          title="Administrador"
          color={role === 'admin' ? '#007bff' : '#ccc'}
          onPress={() => setRole('admin')}
        />
        <Button
          title="Funcionário"
          color={role === 'funcionario' ? '#007bff' : '#ccc'}
          onPress={() => setRole('funcionario')}
        />
      </View>

      <View style={{ marginTop: 24 }}>
        <Button title="Salvar alterações" onPress={salvarAlteracoes} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2C3E45', padding: 20 },
  label: { color: '#EAEED6', fontWeight: 'bold', marginTop: 16, marginBottom: 4 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});
