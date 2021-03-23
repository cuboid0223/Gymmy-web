export const initialState = {
  term: "",
  newSidebarRowNames: [],
  user: null,
  date: new Date(),
};
export const actionTypes = {
  SET_SEARCH_TERM: "SET_SEARCH_TERM", // YouTube 搜尋字元
  SET_NEWSIDEBARROW_NAMES: "SET_NEWSIDEBARROW_NAMES", // 自訂側邊欄新欄位
  SET_USER: "SET_USER",// 登入登出
  SET_DATE: "SET_DATE",// 食物新增的日期
};
const reducer = (state, action) => {
  console.log(action); //debug
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return {
        ...state,
        term: action.term,
      };

    case "SET_NEWSIDEBARROW_NAMES":
      return {
        ...state,
        newSidebarRowNames: action.newSidebarRowNames,
      };

    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };

    case "SET_DATE":
      return {
        ...state,
        date: action.date,
      };

    default:
      return state;
  }
};

export default reducer;
