const useOrganizationState = () => {
  const route = useRoute();

  const searchState = ref({
    xm: '',
    dwh: ''
  });

  watchEffect(() => {
    searchState.value.dwh = route.query.dwh as string;
  });

  return {
    searchState
  };
};

export default useOrganizationState;
