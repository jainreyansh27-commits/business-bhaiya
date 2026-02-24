"use client";

import { useState } from "react";

type Step =
  | "industry"
  | "currentRevenue"
  | "targetRevenue"
  | "avgOrderValue"
  | "leadsPerMonth"
  | "conversionRate"
  | "result";

export default function DiagnosisChat() {
  const [step, setStep] = useState<Step>("industry");
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<any>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const nextStep = (current: Step): Step => {
    const order: Step[] = [
      "industry",
      "currentRevenue",
      "targetRevenue",
      "avgOrderValue",
      "leadsPerMonth",
      "conversionRate",
      "result",
    ];

    const index = order.indexOf(current);
    return order[index + 1];
  };

  const handleSubmit = async () => {
    if (!input) return;

    const value =
      step === "industry" ? input : Number(input);

    const updated = { ...answers, [step]: value };
    setAnswers(updated);
    setInput("");

    const next = nextStep(step);

    if (next === "result") {
      setLoading(true);

      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      const data = await res.json();
      setResult(data);
      setLoading(false);
    }

    setStep(next);
  };

  const getQuestion = () => {
    switch (step) {
      case "industry":
        return "What industry are you in?";
      case "currentRevenue":
        return "What is your current monthly revenue (₹)?";
      case "targetRevenue":
        return "What is your target monthly revenue (₹)?";
      case "avgOrderValue":
        return "What is your average order value (₹)?";
      case "leadsPerMonth":
        return "How many leads do you get per month?";
      case "conversionRate":
        return "What is your conversion rate (%)?";
      default:
        return "";
    }
  };

  const downloadPlan = () => {
    if (!result) return;

    const content = `
Business Revenue Diagnosis

Revenue Gap: ₹${result.revenueGap}
Orders Needed: ${Math.ceil(result.ordersNeeded)}
Leads Needed: ${Math.ceil(result.leadsNeeded)}

Main Bottleneck:
${result.bottleneck}

Priority This Week:
${result.priority_this_week?.join("\n")}

Risk Warning:
${result.risk_warning}
`;

    const handleDownload = async () => {
  if (!result) return;

  const response = await fetch("/api/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  });

  if (!response.ok) {
    alert("Download failed");
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "Business_Diagnosis.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
};
  };
const handleDownload = async () => {
  if (!result) return;

  const response = await fetch("/api/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  });

  if (!response.ok) {
    alert("Download failed");
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "Business_Diagnosis.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
};
  return (
    <div className="text-white text-center space-y-6">

      {step !== "result" && (
        <>
          <h2 className="text-xl">{getQuestion()}</h2>

         <input
  className="bg-gray-900 text-white placeholder-gray-400 px-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="bg-purple-600 px-6 py-2 rounded"
          >
            Next
          </button>
        </>
      )}

      {loading && <p>Analyzing...</p>}

      {result && (
        <div className="space-y-4">
          <p>Revenue Gap: ₹{result.revenueGap}</p>
          <p>
            Orders Needed:{" "}
            {Math.ceil(result.ordersNeeded)}
          </p>
          <p>
            Leads Needed:{" "}
            {Math.ceil(result.leadsNeeded)}
          </p>

          <h3>Main Bottleneck</h3>
          <p>{result.bottleneck}</p>

          <h3>Priority This Week</h3>
          <ul>
            {result.priority_this_week?.map(
              (item: string, i: number) => (
                <li key={i}>{item}</li>
              )
            )}
          </ul>

          <h3>Risk Warning</h3>
          <p>{result.risk_warning}</p>

          <button
  onClick={handleDownload}
  className="bg-purple-700 px-6 py-2 rounded text-white"
>
  Download My Plan
</button>
        </div>
      )}
    </div>
  );
}