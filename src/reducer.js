export const initialState = {
  term: "",
  newSidebarRowNames: [],
  user: null,
  userInfo: null,
  date: new Date(),
  notices: [],
  noticesCount: 0,
};
export const actionTypes = {
  SET_SEARCH_TERM: "SET_SEARCH_TERM", // YouTube 搜尋字元
  SET_NEWSIDEBARROW_NAMES: "SET_NEWSIDEBARROW_NAMES", // 自訂側邊欄新運動訓練選項
  SET_USER: "SET_USER", // 登入登出
  SET_USERINFO: "SET_USERINFO",
  SET_DATE: "SET_DATE", // 食物新增的日期
  SET_NOTICES: "SET_NOTICES", // 提醒訊息
  SET_NOTICESCOUNT: "SET_NOTICESCOUNT", // 提醒訊息數量
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
      
    case "SET_USERINFO":
      return {
        ...state,
        userInfo: action.userInfo,
      };

    case "SET_DATE":
      return {
        ...state,
        date: action.date,
      };

    case "SET_NOTICES":
      return {
        ...state,
        notices: action.notices,
      };

    case "SET_NOTICESCOUNT":
      return {
        ...state,
        noticesCount: action.noticesCount,
      };
    default:
      return state;
  }
};

export default reducer;
