import theme from "@/theme/theme";
import { CategoryItem } from "@/types/category";
import { Button, FormControl, KeyboardAvoidingView, Modal } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

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
  const [categoryColor, setCategoryColor] = useState("");
  const inputRef = useRef<TextInput | null>(null);
  const textValueRef = useRef<string>(""); // 입력값을 저장할 ref

  useEffect(() => {
    if (category) {
      textValueRef.current = category.name; // 초기 값 설정
      setCategoryColor(category.color);
    } else {
      textValueRef.current = "";
      setCategoryColor("");
    }
  }, [category]);

  // 사용자가 입력하는 동안 상태를 업데이트하지 않고 ref에 저장
  const onChangeText = (value: string) => {
    textValueRef.current = value;
  };

  // 포커스 아웃 시 상태 업데이트 (불필요한 리렌더링 방지)
  const onBlur = () => {
    console.log("입력 종료:", textValueRef.current);
  };

  const addCategory = ({ name, color }: { name: string; color: string }) => {
    setCategoryList([...categoryList, { id: new Date().getTime().toString(), name, color }]);
  };

  const editCategory = ({ name, color, id }: { name: string; color: string; id: string }) => {
    setCategoryList(categoryList.map((item) => (item.id === id ? { ...item, name, color } : item)));
  };

  const onSave = () => {
    const categoryName = textValueRef.current.trim();

    if (!categoryName || !categoryColor) {
      Alert.alert("입력 오류", "카테고리 이름과 색상을 선택해주세요.");
      return;
    }

    if (category) {
      editCategory({ name: categoryName, color: categoryColor, id: category.id });
    } else {
      addCategory({ name: categoryName, color: categoryColor });
    }

    setCategory(null);
    textValueRef.current = ""; // 입력값 초기화
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Modal.Content style={{ minWidth: 300, margin: 20 }}>
          <Modal.CloseButton />
          <Modal.Header>{category ? "카테고리 수정" : "카테고리 추가"}</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>이름</FormControl.Label>
              <TextInput
                ref={inputRef}
                defaultValue={textValueRef.current} // 초기값 설정
                onChangeText={onChangeText} // 입력 중에는 ref에 저장
                onBlur={onBlur} // 포커스가 해제될 때 로그 출력 (여기서도 상태 업데이트 가능)
                placeholder="카테고리 이름 입력"
                style={styles.input}
              />
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
      </KeyboardAvoidingView>
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
  input: {
    borderWidth: 1,
    borderColor: theme.gray_1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
  },
});

export default CategoryFormModal;