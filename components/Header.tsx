import theme from '@/theme/theme';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Header = () => {
  const insets = useSafeAreaInsets();
  const username = "해냄이"
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate(); 

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerText1}>
          {`${username}의 체크리스트`}
        </Text>
        <Image source={require('@/assets/images/mountain.png')} style={styles.logo} />
      </View>
      <Text style={styles.headerText2}>
        {`${year}년 ${month}월 ${day}일`}
      </Text>
    </View>
  );
};

export const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.purple,
    display: 'flex',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 8,
  },
  headerTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerText1: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  headerText2: {
    fontSize: 20,
    color: 'white',
  },
  logo: {
    width: 30,
    height: 30,
  },
});

export default Header;