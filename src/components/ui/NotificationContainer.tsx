import React from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useUIStore } from "../../stores/uiStore";

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useUIStore();

  if (notifications.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-green-400";
      case "error":
        return "border-l-red-400";
      case "warning":
        return "border-l-yellow-400";
      case "info":
        return "border-l-blue-400";
      default:
        return "border-l-blue-400";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`bg-dark-surface border border-dark-border ${getBorderColor(notification.type)} border-l-4 rounded-lg p-4 shadow-lg animate-in slide-in-from-right duration-300`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-dark-text">
                {notification.title}
              </h4>
              <p className="text-sm text-dark-text-secondary mt-1">
                {notification.message}
              </p>
            </div>

            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 ml-4 p-1 hover:bg-dark-surface-variant rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-dark-text-secondary hover:text-dark-text" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
