import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

export const ProgressBar = ({all, checked, color, backgroundColor}: {all: number, checked: number, color: string, backgroundColor?: string}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const progress = useMemo(() => {
    return all > 0 ? Math.round((checked / all) * 100) : 0;
  }, [all, checked]);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start();
  }, [progress]);

  if (isNaN(progress)) {
    return <Text style={{textAlign: 'center', color: '#666'}}>
      항목을 추가해주세요!
    </Text>;
  }

  return (
    <View>
      <Text style={styles.progressText}>
        {checked} / {all} 완료
      </Text>
      <View style={[styles.progressBar, {backgroundColor: backgroundColor || '#FFF'}]}>
        <Animated.View style={[styles.progress, {width: animatedWidth.interpolate({inputRange: [0, 100], outputRange: ['0%', '100%']}), backgroundColor: color}]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 5,
  },
  progress: {
    height: 8,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  progressText: {
    textAlign: 'right',
    marginBottom: 6,
    fontSize: 12,
  }
})

export default ProgressBar