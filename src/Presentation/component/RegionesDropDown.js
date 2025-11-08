import { useState, useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  FlatList,
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import { masterData } from './data';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../const/colors';

const DropDown = ({onSelect }) => {
  const [data, setData] = useState(masterData);
  const [text, setText] = useState('');
  const [dropdown, setDropdown] = useState({
    itemValue: null,
    itemLabel: null,
  });

  const { itemValue, itemLabel } = dropdown;

  const [toggle, setToggle] = useState(false);
  const [toggleLong, setToggleLong] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    handleAnimatedLong();
  }, [toggleLong]);

  useEffect(() => {
    handleAnimated();
  }, [toggle]);

  const handleAnimatedLong = () => {
    Animated.spring(scale, {
      toValue: toggleLong ? 1 : 0,
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  const handleAnimated = () => {
    Animated.timing(animation, {
      toValue: toggle ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const arrowStyle = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '90deg'],
        }),
      },
    ],
  };

  const translate = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [itemValue ? -40 : 0, -40],
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [itemValue ? -25 : 0, -25],
        }),
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [itemValue ? 0.8 : 1, 0.8],
        }),
      },
    ],
  };

  const listStyle = {
    height: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 215],
    }),
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 60],
        }),
      },
    ],
  };

  const scaleStyle = {
    transform: [{ scale }],
  };

  const handleInputChange = (text) => {
    setText(text);
    if (text) {
      const filtered = masterData.filter((item) =>
        item.label.toLowerCase().includes(text.toLowerCase())
      );
      setData(filtered);
    } else {
      setData(masterData);
    }
  };

  const Item = ({ value, label }) => (
    <TouchableOpacity
      onPress={() => {
  setDropdown({ itemValue: value, itemLabel: label });
  setData(masterData);
  setToggle(false);
  setText('');

  // Si el componente padre envía una función onSelect, la ejecutamos
  if (typeof onSelect === 'function') {
    onSelect(label); // o onSelect(value), depende de lo que necesites guardar
  }
}}

      style={styles.item}
    >
      <View style={styles.titleContainer}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '300',
            color: itemValue === value ? '#adadad' : '#383838',
          }}
        >
          {label}
        </Text>
      </View>
      {itemValue === value && (
        <View style={styles.checkContainer}>
          <MaterialCommunityIcons name="check" size={18} color="green" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <View style={{ padding: 20 }} />

      <View style={styles.dropdownContainer}>
        <TouchableWithoutFeedback
          onPressIn={() => setToggleLong(true)}
          onPressOut={() => setToggleLong(false)}
          onPress={() => setToggle(!toggle)}
        >
          <View style={styles.button}>
            <View style={styles.leftIcon}>
              <MaterialCommunityIcons
                name={toggle ? 'folder-open-outline' : 'folder-outline'}
                size={18}
                color={COLORS.chocoplom}
              />
            </View>

            {/* Placeholder animado */}
            {!itemLabel && (
              <Animated.View style={[styles.titleBox, translate]}>
                <Text style={{ fontSize: 14, color: '#8C4600', fontWeight: '300' }}>
                    Región
                </Text>
              </Animated.View>

            )}

            {/* Valor seleccionado centrado */}
            {itemLabel && (
              <View style={styles.selectedRegion}>
                <Text style={{ fontSize: 14, color: '#8C4600', fontWeight: '300' }}>
                  {itemLabel}
                </Text>
              </View>
            )}

            <Animated.View style={[styles.arrowRight, arrowStyle]}>
              <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.chocoplom} />
              <Animated.View style={[styles.circle, scaleStyle]} />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.container, listStyle]}>
          <View style={styles.listContainer}>
            {/* Search bar */}
            <View style={styles.searchBar}>
              <View style={styles.magnify}>
                <MaterialCommunityIcons name="magnify" size={22} color={COLORS.orange} />
              </View>
              <TextInput
                value={text}
                onChangeText={handleInputChange}
                style={styles.input}
                placeholder="Buscar elemento"
                placeholderTextColor="#adadad"
              />
            </View>

            {/* Lista */}
            <View style={styles.list}>
              <FlatList
                data={data}
                keyExtractor={(item) => item.value.toString()}
                renderItem={({ item }) => <Item {...item} />}
                nestedScrollEnabled={true} // ✅ evita el warning
                style={{ maxHeight: 250 }} // opcional: limita el alto de la lista
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    height: 'auto',
    alignSelf: 'stretch',
    bottom: 10,
    zIndex: 1000,
    elevation: 1000,
  },
  button: {
    height: 55,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderWidth: 1.8,
    borderColor: '#ffff',
    borderRadius: 5,
    zIndex: 1000,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  leftIcon: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 5,
    zIndex: 10,
  },
  titleBox: {
    position: 'absolute',
    left: 37,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    zIndex: 0,
    borderRadius: 8,
  },
  selectedRegion: {
  position: 'absolute',
  left: 37,
  right: 40,
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,           // <- aseguramos que esté sobre todo
  backgroundColor: 'white', // opcional, para que no tape nada
  },
  arrowRight: {
    height: 50,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    zIndex: 10,
  },
  circle: {
    height: 35,
    width: 35,
    backgroundColor: 'rgba(64, 122, 195, 0.08)',
    borderRadius: 50,
    position: 'absolute',
    zIndex: 0,
  },
  container: {
    width: '100%',
  backgroundColor: '#fff',
  position: 'absolute',
  left: 0,
  borderRadius: 4,
  borderWidth: 1.8,
  borderColor: COLORS.azul,
  paddingHorizontal: 8,
  paddingTop: 8,
  zIndex: 999,
  elevation: 9999,
  },
  listContainer: {
    flex: 1,
  },
  searchBar: {
    height: 43,
    alignSelf: 'stretch',
    flexDirection: 'row',
    backgroundColor: COLORS.azul,
    borderRadius: 4,
    marginBottom: 5,
  },
  magnify: {
    height: '100%',
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontWeight: '300',
    fontSize: 15,
    padding: 10,
    color: COLORS.blanco,
  },
  list: {
    flex: 1,
    alignSelf: 'stretch',
  },
  item: {
    height: 40,
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  checkContainer: {
    height: '100%',
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DropDown;







