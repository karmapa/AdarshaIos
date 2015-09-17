export const SET_SELECTED_TAB = 'SET_SELECTED_TAB';

export function setSelectedTab(selectedTab) {
  return {
    type: SET_SELECTED_TAB,
    selectedTab
  };
}
