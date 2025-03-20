import theme from "@/theme/theme";
import { CategoryItem } from "@/types/category";
import { Button, FormControl, Input, Modal } from "native-base";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

type CategoryFormModalProps = {
  category?: CategoryItem;
  setCategory: (category: CategoryItem | null) => void;
  isModalVisible: boolean;
  setIsModalVisible: (isModalVisible: boolean) => void;
  categoryList: CategoryItem[];
  setCategoryList: (categoryList: CategoryItem[]) => void;
};

const CategoryFormModal = ({
  isModalVisible,
  setIsModalVisible,
  categoryList,
  setCategoryList,
  category,
  setCategory,
}: CategoryFormModalProps) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("");

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setCategoryColor(category.color);
    } else {
      setCategoryName("");
      setCategoryColor("");
    }
  }, [category]);

  const addCategory = ({ name, color }: { name: string; color: string }) => {
    setCategoryList([...categoryList, { id: new Date().getTime().toString(), name, color }]);
  };

  const editCategory = ({ name, color, id }: { name: string; color: string; id: string }) => {
    setCategoryList(categoryList.map((item) => (item.id === id ? { ...item, name, color } : item)));
  };

  const onSave = () => {
    if (!categoryName.trim() || !categoryColor) {
      Alert.alert("입력 오류", "카테고리 이름과 색상을 선택해주세요.");
      return;
    }

    if (category) {
      editCategory({ name: categoryName, color: categoryColor, id: category.id });
    } else {
      addCategory({ name: categoryName, color: categoryColor });
    }

    setCategory(null);
    setCategoryName("");
    setCategoryColor("");
    setIsModalVisible(false);
  };

  return (
    <Modal
      isOpen={isModalVisible}
      onClose={() => {
        setCategory(null);
        setIsModalVisible(false);
      }}
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{category ? "카테고리 수정" : "카테고리 추가"}</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>이름</FormControl.Label>
            <Input value={categoryName} onChangeText={setCategoryName} placeholder="카테고리 이름 입력" />
          </FormControl>
          <FormControl mt="3">
            <FormControl.Label>색상</FormControl.Label>
            <View style={styles.colorDotContainer}>
              {theme.category_colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorDot, { backgroundColor: color, borderColor: categoryColor === color ? "#666" : "white" }]}
                  onPress={() => setCategoryColor(color)}
                  activeOpacity={0.7}
                />
              ))}
            </View>
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" colorScheme="blueGray" onPress={() => setIsModalVisible(false)}>
              취소
            </Button>
            <Button onPress={onSave}>저장</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

const styles = StyleSheet.create({
  colorDotContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
});

export default CategoryFormModal;