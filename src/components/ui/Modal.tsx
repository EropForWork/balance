import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "modal-sm",
    md: "modal-md",
    lg: "modal-lg",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Modal */}
      <div
        className={`modal ${sizeClasses[size]} animate-slide-in-scale`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-icon hover:bg-surface-hover transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body custom-scrollbar">{children}</div>
      </div>
    </div>
  );
};
