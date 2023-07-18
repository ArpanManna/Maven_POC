export const initialState = {
  loading: false,
  dashboardProjects: [],
  currentUserDetails: {
    "address": '',
    "tba": '',
    "profileURI": '',
    "userType": '',
    "profileTokenId": '',
    "profileInfo": ''
  }
};

export const reducer = (initialState, action) => {
  switch (action.type) {
    case 'DASHBOARD_UPDATE':
      return {
        ...initialState,
        dashboardProjects: action.payload,
      };
    case 'UPDATE_USER_DATA':
      return {
        ...initialState,
        currentUserDetails: action.payload,
      };
    default:
      return initialState;
  }
};