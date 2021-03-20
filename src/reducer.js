export const initialState = {
  term: "",
  newSidebarRowNames: [],
  user: null,
};
export const actionTypes = {
  SET_SEARCH_TERM: "SET_SEARCH_TERM",
  SET_NEWSIDEBARROW_NAMES: "SET_NEWSIDEBARROW_NAMES",
  SET_USER: "SET_USER",
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

    default:
      return state;
  }
};

export default reducer;
