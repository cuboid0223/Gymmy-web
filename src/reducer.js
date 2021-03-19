export const initialState = {
  term: "",
  newSidebarRowNames: [],
};
export const actionTypes = {
  SET_SEARCH_TERM: "SET_SEARCH_TERM",
  SET_NEWSIDEBARROW_NAMES: " SET_NEWSIDEBARROW_NAMES",
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

    default:
      return state;
  }
};

export default reducer;
