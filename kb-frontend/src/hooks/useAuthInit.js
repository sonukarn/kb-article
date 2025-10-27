import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRefreshQuery } from "@/features/auth/authApi";
import { setCredentials } from "@/features/auth/authSlice";

export default function useAuthInit() {
  const dispatch = useDispatch();
  const { data, isSuccess, isError } = useRefreshQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isSuccess && data?.user) {
      dispatch(setCredentials(data));
    } else if (isError) {
      dispatch(setCredentials({ success: false, user: null }));
    }
  }, [isSuccess, isError, data, dispatch]);
}
