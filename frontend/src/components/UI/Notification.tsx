import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../store";
import { setNotification } from "../../store/uiSlice";

const Notification: React.FC = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state: RootState) => state.ui.notification);

  useEffect(() => {
    if (notification) {
      // Auto-hide notification after 3 seconds
      const timer = setTimeout(() => {
        dispatch(setNotification(null));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification) return null;

  const bgColor = notification.type === "success" ? "bg-green-500" : "bg-red-500";
  const textColor = "text-white";

  return (
    <div className={`fixed top-4 right-4 ${bgColor} ${textColor} px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{notification.message}</span>
        <button
          onClick={() => dispatch(setNotification(null))}
          className="ml-4 text-white hover:text-gray-200 text-lg font-bold"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;
