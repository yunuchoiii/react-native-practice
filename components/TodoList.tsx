import theme from '@/theme/theme';
import { CategoryItem } from '@/types/category';
import { TodoItem } from '@/types/todo';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from '@bwjohns4/react-native-draggable-flatlist';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckIcon, Divider } from 'native-base';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TodoListProps = {
  todoList: TodoItem[];
  initTodoList: TodoItem[];
  setInitTodoList: React.Dispatch<React.SetStateAction<TodoItem[]>>;
  selectedCategory: CategoryItem | null;
  categoryList: CategoryItem[];
}

const TodoList = ({todoList, initTodoList, setInitTodoList, selectedCategory, categoryList}: TodoListProps) => {
  const insets = useSafeAreaInsets();

  const sortedTodoList = useMemo(() => {
    return [...todoList].sort((a, b) => b.sort - a.sort);
  }, [todoList]);

  const [text, setText] = useState('');

  const onChangeText = (value: string) => {
    setText(value);
  }

  // 할 일 등록
  const addToDo = useCallback(() => {
    if (text === '') {
      return;
    }
  
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text,
      checked: false,
      sort: initTodoList.length + 1,
      categoryId: selectedCategory?.id || "",
    };
  
    setInitTodoList((prev: TodoItem[]) => [...prev, newTodo]);
    setText('');
  }, [text, selectedCategory, setInitTodoList]);

  // 할 일 체크
  const checkTodo = useCallback((id: string) => {
    setInitTodoList(initTodoList.map((item) => item.id === id ? {...item, checked: !item.checked} : item));
  }, [initTodoList, setInitTodoList]);

  // 모두 완료 / 해제
  const checkAllTodo = useCallback(() => {
    const allChecked = todoList.every((item) => item.checked);
    setInitTodoList(initTodoList.map((item) => {
      if (selectedCategory) {
        return item.categoryId === selectedCategory.id ? {...item, checked: !allChecked} : item;
      }
      return {...item, checked: !allChecked};
    }));
  }, [initTodoList, selectedCategory, setInitTodoList, todoList]);

  // 할 일 삭제
  const deleteTodo = useCallback((key: string) => {
    Alert.alert('할 일 삭제', '정말 삭제하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {text: '삭제', style: 'destructive', onPress: () => {
        const newTodoList = initTodoList.filter((item) => item.id !== key);
        setInitTodoList(newTodoList);
      }},
    ])
  }, [initTodoList, setInitTodoList]);

  // 모두 삭제
  const deleteCompletedTodos = useCallback(() => {
    Alert.alert('완료된 항목 삭제', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { 
        text: '삭제', style: 'destructive', onPress: () => {
          setInitTodoList((prev) =>
            prev.filter((item) =>
              selectedCategory ? !(item.categoryId === selectedCategory.id && item.checked) : !item.checked
            )
          );
        }
      },
    ]);
  }, [selectedCategory, setInitTodoList]);

  const renderItem = useCallback(({ item, getIndex, drag, isActive }: RenderItemParams<TodoItem>) => {
    const category = categoryList.find((category) => category.id === item.categoryId);
    return (
      <ScaleDecorator>
        {isActive && <Divider bg={theme.gray_2} />}
        <TouchableOpacity
          style={styles.todoElement}
          onPress={() => checkTodo(item.id)}
          onLongPress={drag}
        >
          <View style={[
            styles.checkContainer,
            item.checked ? { backgroundColor: category ? category.color : theme.purple } : null,
            { borderColor: category ? category.color : theme.purple }
          ]}>
            <CheckIcon color={item.checked ? 'white' : 'transparent'} size={3} />
          </View>
          <View style={styles.container}>
            <Text style={styles.todoText} numberOfLines={2} ellipsizeMode="tail">
              {item.text}
            </Text>
            {category && <Text style={styles.categoryText}>{category.name}</Text>}
          </View>
          {item.checked && (
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTodo(item.id)}>
              <Text style={styles.deleteButtonText}>삭제</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        <Divider bg={theme.gray_2} />
      </ScaleDecorator>
    );
  }, [checkTodo, deleteCompletedTodos, categoryList]);

  const onDragEnd = useCallback(({ data }: { data: TodoItem[] }) => {
    const updatedList = data.map((item, index) => ({
      ...item,
      sort: initTodoList.length - index,
    }));
    setInitTodoList((prev) =>
      prev.map((item) => {
        const updatedItem = updatedList.find((i) => i.id === item.id);
        return updatedItem ? { ...item, sort: updatedItem.sort } : item;
      })
    );
  }, [initTodoList]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'height' : 'height'}>
      <View style={styles.container}>
        {todoList.length > 0 && (
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 1)', 
              'rgba(255, 255, 255, 0)'
            ]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={styles.headerContainer}
          >
          {/* <View style={styles.headerContainer}> */}
            <View style={styles.header}>
              <TouchableOpacity onPress={checkAllTodo}>
                <Text>
                  {Object.values(todoList).every((item) => item.checked) ? '모두 완료 해제' : '모두 완료'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={deleteCompletedTodos}>
                <Text>완료된 항목 삭제</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}
        {todoList.length > 0 ? (
          <View style={[styles.container, { paddingBottom: 50 + insets.bottom }]}>
            <DraggableFlatList
              data={sortedTodoList}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              onDragEnd={onDragEnd}
              style={{ height: '100%' }}
              contentContainerStyle={{ paddingBottom: 50 }}
            />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Image source={require('@/assets/images/target.png')} style={styles.emptyImage} />
            <Text style={styles.emptyText}>체크 리스트에{'\n'}할 일을 등록해주세요</Text>
          </View>
        )}
        <View style={[styles.inputContainer, {bottom: insets.bottom}]}>
          <TextInput 
            value={text}
            style={styles.input} 
            placeholder="오늘은 무엇을 해야하나요?" 
            returnKeyType='done'
            onChangeText={onChangeText}
            clearButtonMode='while-editing'
            onSubmitEditing={addToDo}
          />
          <TouchableOpacity style={styles.addButton} onPress={addToDo}>
            <Text style={styles.addButtonText}>등록</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 10,
    paddingBottom: 0,
  },
  header: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: theme.gray_1,
    borderRadius: 10,
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    zIndex: 1,
    borderWidth: 1,
    borderColor: theme.gray_1,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  input: {
    backgroundColor: 'white',
    height: 50,
    borderRadius: 50,
    flex: 1,
  },
  addButton: {
    marginLeft: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.purple,
  },
  todoContainer: {
    paddingBottom: 120,
  },
  todoElement: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    minHeight: 50,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    backgroundColor: 'white',
  },
  activeItem: {
    backgroundColor: theme.gray_1,
  },
  todoText: {
    fontSize: 18,
  },
  categoryText: {
    fontSize: 11,
    color: "#666",
  },
  checkedText: {
    textDecorationLine: 'line-through',
  },
  checkContainer: {
    width: 18,
    height: 18,
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: theme.gray_2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    paddingBottom: 45,
  },
  emptyImage: {
    width: 50,
    height: 50,
  },
  emptyText: {
    fontSize: 20,
    lineHeight: 29,
    fontWeight: "700",
    color: 'rgba(74, 77, 85, 1)',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: theme.gray_1,
  }
});

export default TodoList;