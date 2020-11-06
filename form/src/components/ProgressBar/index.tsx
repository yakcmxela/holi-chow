import React from "react";

interface ProgressBarProps {
  progress: number;
  onNavigateForm: (section: number) => void;
  onSavePet: () => void;
}

export const ProgressBar = ({
  progress,
  onNavigateForm,
  onSavePet,
}: ProgressBarProps) => {
  return progress === 0 ? null : (
    <div className="pet-profile-section">
      <div className="pet-profile-top-nav">
        <div className="form-progress">
          <div className="progress-bar">
            <div
              className={`fill fill-1 ${progress > 0 ? "active" : ""}`}
            ></div>
            <div
              className={`fill fill-2 ${progress > 1 ? "active" : ""}`}
            ></div>
            <div
              className={`fill fill-3 ${progress > 2 ? "active" : ""}`}
            ></div>
            <div
              className={`fill fill-4 ${progress > 3 ? "active" : ""}`}
            ></div>
            <div
              className={`fill fill-5 ${progress > 4 ? "active" : ""}`}
            ></div>
            <div
              className={`fill fill-6 ${progress > 5 ? "active" : ""}`}
            ></div>
          </div>
        </div>
        {progress !== 0 && progress !== 5 && (
          <div className="pet-profile-form-nav">
            <a
              href="#pet-profile-section-3"
              className="button-text"
              onClick={() => {
                onSavePet && onSavePet();
                onNavigateForm(progress - 1);
              }}
            >
              <i className="fa fa-angle-left"></i> Back
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
