import { useRouter } from 'expo-router';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Voltar() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
      <Text style={styles.textoVoltar}>← Voltar</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botaoVoltar: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  textoVoltar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
