import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import COLORS from '../../Presentation/const/colors';
const Button = ({title, onPress = () => {}}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        height: 55,
        width: '100%',
        backgroundColor: COLORS.orange,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40
      }}>
      <Text style={{color: COLORS.white, fontWeight: 'bold', fontSize: 18}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;