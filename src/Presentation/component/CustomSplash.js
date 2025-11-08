import React, { useEffect, useRef } from "react";
import { View, Image, Animated, Text, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function CustomSplash({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true })
      ]),
      Animated.timing(textAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.delay(800),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
        Animated.timing(textAnim, { toValue: 0, duration: 700, useNativeDriver: true })
      ])
    ]).start(() => onFinish && onFinish());
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/splash-adipan.png")} style={styles.background} />
      <Animated.Image
        source={require("../../../assets/logo4.png")}
        style={[
          styles.logo,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
        resizeMode="contain"
      />
      <Animated.Text
        style={[
          styles.text,
          { opacity: textAnim }
        ]}
      >
        Cargando...
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    width,
    height,
    resizeMode: "cover",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    letterSpacing: 1,
    fontWeight: "500",
  },
});



