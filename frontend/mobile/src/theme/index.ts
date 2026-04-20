import { StyleSheet } from 'react-native';
import { C } from './colors';
import { FONTS } from './fonts';

export const globalStyles = StyleSheet.create({
  cardStyle: {
    backgroundColor: C.SURFACE,
    borderWidth: 1,
    borderColor: C.BORDER,
    borderRadius: 20,
    padding: 20,
    
    // Soft shadow for light mode
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  
  glassCardStyle: {
    backgroundColor: C.SURFACE,
    borderWidth: 1,
    borderColor: C.BORDER,
    borderRadius: 20,
    
    // Deeper reflection shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 5,
  },
  
  sectionLabelStyle: {
    fontFamily: FONTS.MONO,
    fontSize: 11,
    color: C.T2,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  
  monoAmountStyle: {
    fontFamily: FONTS.MONO,
  },
  
  headingStyle: {
    fontFamily: FONTS.SYNE,
    color: C.T1,
    fontSize: 24,
  }
});

export { C } from './colors';
export { FONTS } from './fonts';
