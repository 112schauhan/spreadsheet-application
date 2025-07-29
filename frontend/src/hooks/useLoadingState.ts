import { useDispatch } from "react-redux";
import { setLoading, setNotification } from "../store/uiSlice";

export const useLoadingState = () => {
  const dispatch = useDispatch();

  const withLoading = async <T>(
    asyncOperation: () => Promise<T>,
    options?: {
      loadingMessage?: string;
      successMessage?: string;
      errorMessage?: string;
    }
  ): Promise<T | null> => {
    try {
      dispatch(setLoading(true));
      
      if (options?.loadingMessage) {
        dispatch(setNotification({ 
          type: "success", 
          message: options.loadingMessage 
        }));
      }

      const result = await asyncOperation();

      if (options?.successMessage) {
        dispatch(setNotification({ 
          type: "success", 
          message: options.successMessage 
        }));
      }

      return result;
    } catch (error) {
      const errorMsg = options?.errorMessage || "An error occurred";
      dispatch(setNotification({ 
        type: "error", 
        message: errorMsg 
      }));
      console.error("Loading operation failed:", error);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { withLoading };
};

export default useLoadingState;
