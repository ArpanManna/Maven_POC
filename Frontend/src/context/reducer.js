export const initialState = {
    loading: false,
    dashboardProjects: []
  };
  
  export const reducer = (initialState, action) => {
    switch (action.type) {
      case 'DASHBOARD_UPDATE':
        return {
          ...initialState,
          dashboardProjects: action.payload,
        };
      default:
        return initialState;
    }
  };