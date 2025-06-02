export interface RouteState {
  dwh: string;
  depth: number;
  multiple: boolean;
  maxSelected: number;
  roleType: string;
  path: string;
}

const useOrganizationRouteParams = () => {
  const route = useRoute();
  const routeState = reactive<RouteState> ({
    dwh: '',
    depth: 1,
    multiple: false,
    maxSelected: 10,
    roleType: '',
    path: ''
  });

  watchEffect(() => {
    routeState.dwh = route.query.dwh as string;
    routeState.depth = Number(route.query.depth) || 1;
    routeState.multiple = route.query.multiple === 'true';
    routeState.maxSelected = Number(route.query.maxSelected) || 10;
    routeState.roleType = route.query.roleType as string;
    routeState.path = route.path;
  });
  return {
    routeState
  };
};

export default useOrganizationRouteParams;
