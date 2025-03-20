import { getRGBAFromHex } from "@/utils/color";
import { LinearGradient } from "expo-linear-gradient";
import { Menu, ThreeDotsIcon } from "native-base";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ProgressBar } from "./ProgressBar";

type CategoryCardProps = {
  name: string;
  color: string;
  selected: boolean;
  progress: {all: number, checked: number};
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const getGradientColors = (color: string): [string, string] => [
  getRGBAFromHex(color).replace(", 1)", ", 0.2)"),
  getRGBAFromHex(color).replace(", 1)", ", 0.5)"),
];

const CategoryCard = ({ name, color, selected, progress, onPress, onEdit, onDelete }: CategoryCardProps) => {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth * 0.7;

  return (
    <TouchableOpacity onPress={onPress} style={styles.cardShadow}>
      <LinearGradient 
        colors={selected ? getGradientColors(color) : ["#FFF", "#FFF"]} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }} 
        style={[styles.card, {width: cardWidth}]}
      >
        <Text style={styles.categoryName}>{name}</Text>
        <ProgressBar 
          all={progress.all}
          checked={progress.checked}
          color={color}
          backgroundColor={selected ? "#FFF" : "#E9E9E9"}
        />
        {(onEdit || onDelete) && (
          <Menu
            trigger={(triggerProps) => (
              <TouchableOpacity style={styles.menuIcon} accessibilityLabel="메뉴" {...triggerProps}>
                <ThreeDotsIcon />
              </TouchableOpacity>
            )}
            borderRadius={10}
          >
            {onEdit && <Menu.Item onPress={onEdit}>수정</Menu.Item>}
            {onDelete && <Menu.Item onPress={onDelete}>삭제</Menu.Item>}
          </Menu>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    aspectRatio: 1.5,
    borderRadius: 15,
    backgroundColor: "white",
    padding: 20,
    justifyContent: "space-between",
    marginLeft: 10,
  },
  cardShadow: {
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  menuIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
});

export default CategoryCard;