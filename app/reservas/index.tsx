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
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

interface Reserva {
  id: string;
  data: string;
  hora: string;
  nomeFuncionario: string;
  modeloCarro: string;
  placaCarro: string;
  objetivo: string;
  userId: string;
}

export default function ListaReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [userIdAtual, setUserIdAtual] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const carregarReservas = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        setUserIdAtual(user.uid);

        const funcionariosSnap = await getDocs(collection(db, 'funcionarios'));
        const funcionario = funcionariosSnap.docs.find(
          (doc) => doc.data().login === user.email
        );

        if (funcionario?.data().role === 'admin') {
          setIsAdmin(true);
        }

        const snapshot = await getDocs(collection(db, 'reservas'));
        const lista: Reserva[] = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          lista.push({
            id: docSnap.id,
            data: data.data ?? '',
            hora: data.hora ?? '',
            nomeFuncionario: data.nomeFuncionario ?? '',
            modeloCarro: data.modeloCarro ?? '',
            placaCarro: data.placaCarro ?? '',
            objetivo: data.objetivo ?? '',
            userId: data.userId ?? '',
          });
        });

        setReservas(lista);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar as reservas.');
      }
    };

    carregarReservas();
  }, []);

  const excluirReserva = async (id: string) => {
    Alert.alert('Confirmar', 'Deseja cancelar esta reserva?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'reservas', id));
          setReservas((antigas) => antigas.filter((r) => r.id !== id));
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Reservas</Text>
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const podeEditarOuCancelar = isAdmin || item.userId === userIdAtual;

          return (
            <View style={styles.card}>
              <Text style={styles.texto}>
                {item.nomeFuncionario} — {item.modeloCarro} ({item.placaCarro})
              </Text>
              <Text style={styles.texto}>
                {item.data} às {item.hora}
              </Text>
              <Text style={styles.texto}>Objetivo: {item.objetivo}</Text>

              {podeEditarOuCancelar && (
                <View style={styles.botoes}>
                  <TouchableOpacity
                    style={styles.botaoEditar}
                    onPress={() => router.push(`/reservas/editar?id=${item.id}`)}
                  >
                    <Text style={styles.textoBotao}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.botaoExcluir}
                    onPress={() => excluirReserva(item.id)}
                  >
                    <Text style={styles.textoBotao}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
            Nenhuma reserva cadastrada.
          </Text>
        }
      />
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
  card: {
    backgroundColor: '#A9D9B0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  texto: {
    color: '#000',
    fontSize: 16,
    marginBottom: 4,
  },
  botoes: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  botaoEditar: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  botaoExcluir: {
    backgroundColor: '#e67e22',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
