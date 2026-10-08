import { StyleSheet } from 'react-native';
import { height } from '../../utils/responsiveSize';

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: height(6) },
});

export default styles;
