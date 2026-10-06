import { Platform } from 'react-native';

export const COLORS = {
  bg: '#FFF8F1',
  card: '#FFFFFF',
  primary: '#E4572E',
  primaryDark: '#C2431F',
  primarySoft: '#FDE6DC',
  text: '#2B2118',
  muted: '#7A6A5C',
  border: '#EFE3D6',
  chip: '#FBEFE4',
  danger: '#D64545',
  dangerSoft: '#FBE3E3',
  heart: '#E63950',
  white: '#FFFFFF',
};

export const SHADOW = Platform.select({
  web: { boxShadow: '0px 4px 10px rgba(90, 58, 30, 0.1)' },
  default: {
    shadowColor: '#5A3A1E',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
});
