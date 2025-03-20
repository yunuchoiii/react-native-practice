import theme from "@/theme/theme";
import { CategoryItem } from "@/types/category";
import { TodoItem } from "@/types/todo";
import { AddIcon, Center } from "native-base";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Alert, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import CategoryCard from "./CategoryCard";
import CategoryFormModal from "./CategoryFormModal";

type CategoryListProps = {
  categoryList: CategoryItem[];
  setCategoryList: (categoryList: CategoryItem[]) => void;
  initTodoList: TodoItem[];
  setInitTodoList: (initTodoList: TodoItem[]) => void;
  selectedCategory: CategoryItem | null;
  setSelectedCategory: (selectedCategory: CategoryItem | null) => void;
};

const CategoryList = ({
  categoryList,
  setCategoryList,
  initTodoList,
  setInitTodoList,
  selectedCategory,
  setSelectedCategory,
}: CategoryListProps) => {
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth * 0.7;
  const gap = 10;
  const scrollViewRef = useRef<ScrollView>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedCategory, setEditedCategory] = useState<CategoryItem | null>(null);

  // 카테고리 수정
  const editCategory = useCallback((category: CategoryItem) => {
    setEditedCategory(category);
    setIsModalVisible(true);
  }, []);

  // 카테고리 삭제
  const deleteCategory = useCallback(
    (id: string) => {
      Alert.alert("카테고리 삭제", "정말 삭제하시겠습니까?", [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => {
            setCategoryList(categoryList.filter((item) => item.id !== id));
            setInitTodoList(initTodoList.filter((item) => item.categoryId !== id));
          },
        },
      ]);
    },
    [categoryList, initTodoList, setCategoryList, setInitTodoList]
  );

  // 카테고리 선택 시 자동 스크롤 위치 계산
  const calculateOffset = (index: number) => {
    return index * (cardWidth + gap) - (screenWidth - cardWidth - gap) / 2;
  };

  // 카테고리 선택 시 핸들러
  const onPressCategory = useCallback(
    (item: CategoryItem, index: number) => {
      const isSelected = selectedCategory?.id === item.id;
      setSelectedCategory(isSelected ? null : item);
      // 카테고리 선택 시 자동 스크롤 (중앙 정렬)
      const offset = isSelected ? 0 : calculateOffset(index);
      scrollViewRef.current?.scrollTo({ x: offset, y: 0, animated: true });
    },
    [selectedCategory, setSelectedCategory, calculateOffset]
  );

  // 카테고리별 할 일 진행률 계산
  const progressMap = useMemo(() => {
    const map: Record<string, { all: number; checked: number }> = {};
    categoryList.forEach((item) => {
      const todos = initTodoList.filter((i) => i.categoryId === item.id);
      const checkedCount = todos.filter((i) => i.checked).length;
      map[item.id] = { all: todos.length, checked: checkedCount };
    });
    return map;
  }, [categoryList, initTodoList]);

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        contentContainerStyle={styles.cardContainer}
        snapToInterval={cardWidth + gap}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
      >
        <CategoryCard
          name="모든 할 일"
          color={theme.purple_light}
          selected={selectedCategory === null}
          progress={{ all: initTodoList.length, checked: initTodoList.filter((i) => i.checked).length }}
          onPress={() => {
            setSelectedCategory(null);
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
          }}
        />
        {categoryList.map((item, index) => (
          <CategoryCard
            key={`category-${item.id}`}
            name={item.name}
            color={item.color}
            selected={selectedCategory?.id === item.id}
            progress={progressMap[item.id]}
            onPress={() => onPressCategory(item, index + 1)}
            onEdit={() => editCategory(item)}
            onDelete={() => deleteCategory(item.id)}
          />
        ))}
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={{ paddingHorizontal: 50 }}
        >
          <Center flex={1}>
            <AddIcon size={12} color="#AAA" />
          </Center>
        </TouchableOpacity>
      </ScrollView>
      <CategoryFormModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        categoryList={categoryList}
        setCategoryList={setCategoryList}
        category={editedCategory || undefined}
        setCategory={setEditedCategory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
  },
});

export default CategoryList;