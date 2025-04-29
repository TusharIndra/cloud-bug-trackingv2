/* BugReportResult Component (BugReportResult.js) */
import React from "react";
import "./BugReportResult.css";

const BugReportResult = ({ formData, mlResponse }) => {
  return (
    <div className="bug-report-result-container">
      <h2 className="result-title">Bug Report Summary</h2>
      <div className="result-details">
        <p><strong>Title:</strong> {formData.title}</p>
        <p><strong>Description:</strong> {formData.description}</p>
        {mlResponse.severity && (
          <p><strong>Predicted Severity:</strong> {mlResponse.severity}</p>
        )}
        {mlResponse.confidence && (
          <p><strong>Confidence:</strong> {mlResponse.confidence}%</p>
        )}
        <p><strong>Label:</strong> {formData.label}</p>
        <p><strong>Steps to Reproduce:</strong> {formData.stepsToReproduce}</p>
        <p><strong>Expected Behavior:</strong> {formData.expectedBehavior}</p>
        <p><strong>Actual Behavior:</strong> {formData.actualBehavior}</p>
        <p><strong>Environment:</strong> {formData.environment}</p>
        <p><strong>Affected Modules:</strong> {formData.affectedModules}</p>
        <p><strong>Attachments:</strong> {formData.attachments}</p>
      </div>
      <button className="btn back-btn" onClick={() => window.location.reload()}>Back to Form</button>
    </div>
  );
};

export default BugReportResult;