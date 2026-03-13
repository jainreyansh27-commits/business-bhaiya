"use client"

import { useState } from "react"

export default function OpportunitiesPage() {

  const [industry, setIndustry] = useState("")
  const [product, setProduct] = useState("")
  const [location, setLocation] = useState("")
  const [results, setResults] = useState("")
  const [loading, setLoading] = useState(false)

  async function findOpportunities() {

    setLoading(true)

    const res = await fetch("/api/ai/opportunities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        industry,
        product,
        location
      })
    })

    const data = await res.json()

    setResults(data.result)
    setLoading(false)
  }

  return (

    <div className="p-10">

      <h1 className="text-3xl font-semibold mb-8 text-gray-900">
        Market Opportunities
      </h1>

      <div className="bg-white p-6 rounded-lg max-w-xl space-y-4 shadow-sm border border-gray-200">

        <input
          placeholder="Product (example: Wire Harness)"
          value={product}
          onChange={(e)=>setProduct(e.target.value)}
          className="w-full p-3 rounded bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <input
          placeholder="Industry (example: HVAC, Appliances)"
          value={industry}
          onChange={(e)=>setIndustry(e.target.value)}
          className="w-full p-3 rounded bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <input
          placeholder="Location (India / Export / Global)"
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
          className="w-full p-3 rounded bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <button
          onClick={findOpportunities}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium transition-colors"
        >
          {loading ? "Finding..." : "Find Opportunities"}
        </button>

      </div>

      {results && (

        <div className="mt-10 bg-white p-6 rounded-lg shadow-sm border border-gray-200">

          <h2 className="font-semibold mb-4 text-gray-900">
            AI Opportunities
          </h2>

          <pre className="whitespace-pre-wrap text-gray-700">
            {results}
          </pre>

        </div>

      )}

    </div>
  )
}