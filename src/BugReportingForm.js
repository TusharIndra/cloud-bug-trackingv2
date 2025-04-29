/* Assuming you're using React for the frontend */
import React, { useState } from "react";
import "./BugReportingForm.css";
import BugReportResult from "./BugReportResult";
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const BugReportingForm = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "", // This will be populated by Gemini
    label: "",
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: "",
    environment: "",
    affectedModules: "",
    attachments: "",
  });
  const [mlResponse, setMlResponse] = useState({ severity: null, confidence: null });
  const [showResultPage, setShowResultPage] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  //console.log(process.env.REACT_APP_test);
  const steps = [
    { name: "title", label: "Bug Title" },
    { name: "description", label: "Bug Description" },
    { name: "label", label: "Label (Bug, Feature, Enhancement)" },
    { name: "stepsToReproduce", label: "Steps to Reproduce" },
    { name: "expectedBehavior", label: "Expected Behavior" },
    { name: "actualBehavior", label: "Actual Behavior" },
    { name: "environment", label: "Environment (OS, Browser, etc.)" },
    { name: "affectedModules", label: "Affected Modules/Components" },
    { name: "attachments", label: "Attachments (Screenshots, Logs, etc.)" },
  ];

  const handleNextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateFormData = () => {
    const missing = [];

    if (!formData.title) missing.push("title");
    if (!formData.description) missing.push("description");
    if (!formData.stepsToReproduce) missing.push("stepsToReproduce");
    if (!formData.environment) missing.push("environment");

    setMissingFields(missing);
    return missing.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFormData()) {
      setStep(0);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMNIKEY); // **REPLACE WITH YOUR ACTUAL API KEY**
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `Analyze the following bug report description and provide the predicted severity (e.g., Low, Medium, High, Critical) and a confidence level (as a percentage) for your severity prediction. Respond in a structured format like:

Severity: [Predicted Severity]
Confidence: [Confidence Level]%

Bug Report Description: "${formData.description}"`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      let severity = null;
      let confidence = null;

      const severityMatch = responseText.match(/Severity: (.*)/i);
      if (severityMatch && severityMatch[1]) {
        severity = severityMatch[1].trim();
      }

      const confidenceMatch = responseText.match(/Confidence: (.*)%/i);
      if (confidenceMatch && confidenceMatch[1]) {
        confidence = confidenceMatch[1].trim();
      }

      setMlResponse({ severity: severity, confidence: confidence });
      setShowResultPage(true);
    } catch (error) {
      console.error("Error calling Gemini API: ", error);
      alert("Failed to analyze bug using AI, please try again.");
    }
  };

  if (showResultPage) {
    return <BugReportResult formData={formData} mlResponse={mlResponse} />;
  }

  return (
    <div className="bug-reporting-container">
      <h2 className="form-title">Bug Reporting Form</h2>
      <div className="form-step">
        <label htmlFor={steps[step].name} className="form-label">
          {steps[step].label}
          {missingFields.includes(steps[step].name) && (
            <span className="error-message"> - This field is required</span>
          )}
        </label>
        <input
          type="text"
          name={steps[step].name}
          value={formData[steps[step].name]}
          onChange={handleInputChange}
          className={`form-input ${missingFields.includes(steps[step].name) ? "input-error" : ""}`}
          placeholder={steps[step].label}
        />
      </div>
      <div className="form-navigation">
        {step > 0 && <button onClick={handlePreviousStep} className="btn prev-btn">Previous</button>}
        {step < steps.length - 1 ? (
          <button onClick={handleNextStep} className="btn next-btn">Next</button>
        ) : (
          <button onClick={handleSubmit} className="btn submit-btn">Submit</button>
        )}
      </div>
    </div>
  );
};

export default BugReportingForm;