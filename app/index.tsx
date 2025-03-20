import CategoryList from '@/components/CategoryList';
import Header from '@/components/Header';
import TodoList from '@/components/TodoList';
import { STORAGE_CATEGORY_KEY, STORAGE_TODO_KEY } from '@/constants/key';
import { CategoryItem } from '@/types/category';
import { TodoItem } from '@/types/todo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const loadList = async (key: string, setList: React.Dispatch<React.SetStateAction<any[]>>) => {
  const value = await AsyncStorage.getItem(key);
  if (value !== null) {
    const parsedValue = JSON.parse(value);
    if (Array.isArray(parsedValue)) {
      setList(parsedValue);
    } else {
      setList([]);
    }
  }
};

const saveList = async (key: string, list: any[]) => {
  try {
    const jsonValue = JSON.stringify(list);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

const TodoScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [categoryList, setCategoryList] = useState<CategoryItem[]>([]);

  const [initTodoList, setInitTodoList] = useState<TodoItem[]>([]); // 모든 투두 리스트
  const [todoList, setTodoList] = useState<TodoItem[]>([]); // 선택된 카테고리로 필터링된 투두 리스트

  useEffect(() => {
    loadList(STORAGE_CATEGORY_KEY, setCategoryList);
    loadList(STORAGE_TODO_KEY, setInitTodoList);
  }, []);

  useEffect(() => {
    saveList(STORAGE_CATEGORY_KEY, categoryList);
  }, [categoryList]);

  useEffect(() => {
    saveList(STORAGE_TODO_KEY, initTodoList);
  }, [initTodoList]);

  useEffect(() => {
    setTodoList((prev) => {
      if (selectedCategory) {
        return initTodoList.filter((item) => item.categoryId === selectedCategory.id);
      }
      return initTodoList;  
    });
  }, [selectedCategory, initTodoList]);

  return (
    <SafeAreaProvider>
      <SafeAreaView 
        style={styles.container} 
        edges={[]}
      >
        <Header />
        <CategoryList 
          categoryList={categoryList}
          setCategoryList={setCategoryList}
          initTodoList={initTodoList}
          setInitTodoList={setInitTodoList}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <TodoList 
          todoList={todoList}
          initTodoList={initTodoList}
          setInitTodoList={setInitTodoList}
          selectedCategory={selectedCategory}
          categoryList={categoryList}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TodoScreen;
