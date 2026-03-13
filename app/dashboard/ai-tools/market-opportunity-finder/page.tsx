"use client"

import { useState } from "react"

export default function MarketOpportunityFinder(){

const [industry,setIndustry] = useState("")
const [product,setProduct] = useState("")
const [location,setLocation] = useState("")
const [result,setResult] = useState("")
const [loading,setLoading] = useState(false)

async function runAI(){

setLoading(true)

const res = await fetch("/api/ai/market-finder",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
industry,
product,
location
})
})

const data = await res.json()

setResult(data.result)

setLoading(false)

}

return(

<div className="p-10 max-w-3xl mx-auto">

<h1 className="text-3xl font-semibold mb-6">
Market Opportunity Finder
</h1>

<div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">

<input
className="w-full p-3 rounded bg-slate-900 border border-slate-700"
placeholder="Industry"
value={industry}
onChange={(e)=>setIndustry(e.target.value)}
/>

<input
className="w-full p-3 rounded bg-slate-900 border border-slate-700"
placeholder="Product"
value={product}
onChange={(e)=>setProduct(e.target.value)}
/>

<input
className="w-full p-3 rounded bg-slate-900 border border-slate-700"
placeholder="Location"
value={location}
onChange={(e)=>setLocation(e.target.value)}
/>

<button
onClick={runAI}
className="bg-purple-600 px-5 py-3 rounded-lg"
>
{loading ? "Analyzing..." : "Find Opportunities"}
</button>

</div>

{result && (

<div className="mt-8 bg-slate-800 border border-slate-700 rounded-xl p-6">

<h2 className="font-semibold mb-4">
AI Market Opportunities
</h2>

<pre className="whitespace-pre-wrap text-gray-300">
{result}
</pre>

</div>

)}

</div>

)

}