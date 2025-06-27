import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { listarVeiculos } from '@/services/veiculos';
import { Veiculo } from '@/types/veiculo';

export default function ListaVeiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const router = useRouter();

  useEffect(() => {
    listarVeiculos()
      .then(setVeiculos)
      .catch(() => {
        Alert.alert('Erro', 'Não foi possível carregar os veículos.');
      });
  }, []);

  const handleEditar = (id: string) => {
  router.push(`/veiculos/editar/${id}` as const);
};

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Veículos</Text>

      <FlatList
        data={veiculos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.texto}>Modelo: {item.modelo}</Text>
            <Text style={styles.texto}>Placa: {item.placa}</Text>

            <TouchableOpacity
              style={styles.botao}
              onPress={() => handleEditar(item.id)}
            >
              <Text style={styles.botaoTexto}>Editar</Text>
            </TouchableOpacity>
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
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  texto: {
    fontSize: 16,
    marginBottom: 4,
  },
  botao: {
    marginTop: 8,
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
