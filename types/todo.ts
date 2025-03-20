
export type TodoItem = {
  id: string;
  text: string;
  checked: boolean;
  sort: number; /** 정렬 순서: sort가 높을수록 위에 있음 */
  categoryId?: string;
}
