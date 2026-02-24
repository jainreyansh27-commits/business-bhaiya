"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    industry: "",
    current_revenue: "",
    target_revenue: "",
    avg_order_value: "",
    conversion_rate: "",
    leads_per_month: "",
    bottleneck: "",
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("profiles").insert({
      id: userData.user.id,
      industry: form.industry,
      current_revenue: Number(form.current_revenue),
      target_revenue: Number(form.target_revenue),
      avg_order_value: Number(form.avg_order_value),
      conversion_rate: Number(form.conversion_rate),
      leads_per_month: Number(form.leads_per_month),
      bottleneck: form.bottleneck,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md space-y-6">

        <h1 className="text-2xl font-bold">
          Step {step} of 4
        </h1>

        {step === 1 && (
          <>
            <label>Industry</label>
            <input
              name="industry"
              value={form.industry}
              onChange={handleChange}
              className="w-full p-2 text-black rounded"
            />
          </>
        )}

        {step === 2 && (
          <>
            <label>Current Monthly Revenue</label>
            <input
              name="current_revenue"
              value={form.current_revenue}
              onChange={handleChange}
              className="w-full p-2 text-black rounded"
            />

            <label>Target Monthly Revenue (3 months)</label>
            <input
              name="target_revenue"
              value={form.target_revenue}
              onChange={handleChange}
              className="w-full p-2 text-black rounded"
            />
          </>
        )}

        {step === 3 && (
          <>
            <label>Average Order Value</label>
            <input
              name="avg_order_value"
              value={form.avg_order_value}
              onChange={handleChange}
              className="w-full p-2 text-black rounded"
            />

            <label>Conversion Rate (%)</label>
            <input
              name="conversion_rate"
              value={form.conversion_rate}
              onChange={handleChange}
              className="w-full p-2 text-black rounded"
            />
          </>
        )}

        {step === 4 && (
          <>
            <label>Leads Per Month</label>
            <input
              name="leads_per_month"
              value={form.leads_per_month}
              onChange={handleChange}
              className="w-full p-2 text-black rounded"
            />

            <label>Biggest Bottleneck</label>
            <select
              name="bottleneck"
              value={form.bottleneck}
              onChange={handleChange}
              className="w-full p-2 text-black rounded"
            >
              <option value="">Select</option>
              <option>Leads</option>
              <option>Conversion</option>
              <option>Operations</option>
              <option>Team</option>
              <option>Cash Flow</option>
            </select>
          </>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <button onClick={prevStep} className="bg-gray-700 px-4 py-2 rounded">
              Back
            </button>
          )}

          {step < 4 ? (
            <button onClick={nextStep} className="bg-purple-600 px-4 py-2 rounded">
              Next
            </button>
          ) : (
            <button onClick={handleSubmit} className="bg-green-600 px-4 py-2 rounded">
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}