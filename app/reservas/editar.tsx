//editar.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { listarReservas, atualizarReserva } from '@/services/reservas';
import { Reserva } from '@/types/reserva';

export default function EditarReserva() {
  const { id } = useLocalSearchParams();
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const router = useRouter();

  useEffect(() => {
    listarReservas().then((res) => {
      const alvo = res.find((r) => r.id === id);
      if (alvo) {
        setReserva(alvo);
        setData(alvo.data);
        setHora(alvo.hora);
      }
    });
  }, []);

  const handleSalvar = async () => {
    if (!reserva) return;

    if (reserva.alteracoes >= 3) {
      Alert.alert('Erro', 'Número de alterações excedido');
      return;
    }

    await atualizarReserva(reserva.id, {
      data,
      hora,
      alteracoes: reserva.alteracoes + 1,
    });

    Alert.alert('Sucesso', 'Reserva atualizada!');
    router.replace('/reservas');
  };

  const handleCancelar = async () => {
    if (!reserva) return;

    Alert.alert('Cancelar Reserva', 'Deseja realmente cancelar esta reserva?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        onPress: async () => {
          await atualizarReserva(reserva.id, { status: 'cancelada' });
          Alert.alert('Sucesso', 'Reserva cancelada!');
          router.replace('/reservas');
        },
      },
    ]);
  };

  if (!reserva) return <Text style={styles.loading}>Carregando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar Reserva</Text>

      <TextInput
        placeholder="Data"
        value={data}
        onChangeText={setData}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Hora"
        value={hora}
        onChangeText={setHora}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
        <Text style={styles.textoSalvar}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoCancelar} onPress={handleCancelar}>
        <Text style={styles.textoCancelar}>Cancelar Reserva</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C3E45',
    flex: 1,
    padding: 24,
  },
  titulo: {
    fontSize: 22,
    color: '#CBD5C0',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F0F5F1',
    color: '#000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  voltar: {
    color: '#CBD5C0',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  botaoSalvar: {
    backgroundColor: '#648B7C',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoSalvar: {
    color: '#F0F5F1',
    fontWeight: 'bold',
    fontSize: 16,
  },
  botaoCancelar: {
    backgroundColor: '#C15B5B',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  textoCancelar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loading: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    marginTop: 100,
  },
});