import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { criarReserva } from '@/services/reservas';
import { listarVeiculos } from '@/services/veiculos';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const isWeb = Platform.OS === 'web';

export default function NovaReserva() {
  const [usuario, setUsuario] = useState<{ id: string; nome: string } | null>(null);
  const [veiculos, setVeiculos] = useState<any[]>([]);
  const [veiculoId, setVeiculoId] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const router = useRouter();

  useEffect(() => {
    listarVeiculos().then((v) => setVeiculos(v.filter((v) => v.ativo)));

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const ref = doc(db, 'funcionarios', user.uid);
        const snap = await getDoc(ref);
        const dados = snap.data();

        setUsuario({
          id: user.uid,
          nome: dados?.nomeCompleto || 'Usuário sem nome',
        });
      }
    });

    return unsubscribe;
  }, []);

  const handleSalvar = async () => {
    if (!usuario || !veiculoId || !data || !hora || !objetivo) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const veiculo = veiculos.find((v) => v.id === veiculoId);

    await criarReserva({
      funcionarioId: usuario.id,
      nomeFuncionario: usuario.nome,
      data,
      hora,
      objetivo,
      veiculoId,
      modeloCarro: veiculo.modelo,
      placaCarro: veiculo.placa,
    });

    Alert.alert('Sucesso', 'Reserva cadastrada');
    router.replace('/reservas');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nova Reserva</Text>

      <Text style={styles.label}>Funcionário:</Text>
      <TextInput
        style={[styles.input, { backgroundColor: '#444' }]}
        value={usuario?.nome || ''}
        editable={false}
      />

      <Text style={styles.label}>Veículo:</Text>
      {isWeb ? (
        <select
          style={styles.webSelect}
          value={veiculoId}
          onChange={(e) => setVeiculoId(e.target.value)}
        >
          <option value="">Selecione</option>
          {veiculos.map((vei) => (
            <option key={vei.id} value={vei.id}>
              {vei.modelo} ({vei.placa})
            </option>
          ))}
        </select>
      ) : (
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={veiculoId}
            onValueChange={setVeiculoId}
            style={styles.picker}
            dropdownIconColor="#F0F0F0"
          >
            <Picker.Item label="Selecione" value="" />
            {veiculos.map((vei) => (
              <Picker.Item
                key={vei.id}
                label={`${vei.modelo} (${vei.placa})`}
                value={vei.id}
              />
            ))}
          </Picker>
        </View>
      )}

      <Text style={styles.label}>Data:</Text>
      {isWeb ? (
        <TextInput
          style={styles.input}
          value={data}
          onChangeText={setData}
          placeholder="Selecionar data"
          placeholderTextColor="#888"
          ref={(ref) => {
            if (ref && typeof document !== 'undefined') {
              const input = ref as any;
              try {
                const node = input._internalFiberInstanceHandleDEV?.stateNode;
                if (node && node.setAttribute) {
                  node.setAttribute('type', 'date');
                }
              } catch {}
            }
          }}
        />
      ) : (
        <>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text style={{ color: data ? '#fff' : '#888' }}>{data || 'Selecionar data'}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  const iso = selectedDate.toISOString().split('T')[0];
                  setData(iso);
                }
              }}
            />
          )}
        </>
      )}

      <Text style={styles.label}>Hora:</Text>
      {isWeb ? (
        <TextInput
          style={styles.input}
          value={hora}
          onChangeText={setHora}
          placeholder="Selecionar hora"
          placeholderTextColor="#888"
          ref={(ref) => {
            if (ref && typeof document !== 'undefined') {
              const input = ref as any;
              try {
                const node = input._internalFiberInstanceHandleDEV?.stateNode;
                if (node && node.setAttribute) {
                  node.setAttribute('type', 'time');
                }
              } catch {}
            }
          }}
        />
      ) : (
        <>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
            <Text style={{ color: hora ? '#fff' : '#888' }}>{hora || 'Selecionar hora'}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  const time = selectedTime.toTimeString().substring(0, 5);
                  setHora(time);
                }
              }}
            />
          )}
        </>
      )}

      <Text style={styles.label}>Objetivo da Reserva:</Text>
      <TextInput
        style={styles.input}
        placeholder="Objetivo"
        placeholderTextColor="#888"
        value={objetivo}
        onChangeText={setObjetivo}
      />

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#2C3E45',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: {
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    color: '#fff',
  },
  webSelect: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 12,
    width: '100%',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2ECC71',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
  },
  picker: {
    color: '#fff',
  },
});
