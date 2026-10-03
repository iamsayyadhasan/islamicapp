import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { StyleSheet, View } from 'react-native';

export default function QuranTab() {
  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.icon}>📖</ThemedText>
        <ThemedText variant="h2" weight="bold">
          Holy Qur&apos;an
        </ThemedText>
        <ThemedText variant="bodySmall" color="secondary" align="center">
          Read, listen, and reflect upon the Holy Quran.
        </ThemedText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF9F4',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  icon: {
    fontSize: 48,
  },
});
