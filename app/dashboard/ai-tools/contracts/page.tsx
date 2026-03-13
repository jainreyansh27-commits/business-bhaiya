"use client"

import { useState } from "react"

export default function ContractAnalyzer(){

const [text,setText] = useState("")
const [result,setResult] = useState("")
const [loading,setLoading] = useState(false)

async function analyzeContract(){

if(!text){
alert("Paste contract text first")
return
}

setLoading(true)

const res = await fetch("/api/ai/contract",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({text})
})

const data = await res.json()

setResult(data.result)

setLoading(false)

}

return(

<div className="max-w-4xl mx-auto p-10">

<h1 className="text-3xl font-semibold mb-6">
Contract Analyzer
</h1>

<textarea
className="w-full h-60 p-4 bg-slate-900 border border-slate-700 rounded"
placeholder="Paste contract text here..."
value={text}
onChange={(e)=>setText(e.target.value)}
/>

<button
onClick={analyzeContract}
className="mt-4 bg-purple-600 px-6 py-3 rounded-lg"
>
{loading ? "Analyzing..." : "Analyze Contract"}
</button>

{result && (

<div className="mt-8 bg-slate-800 border border-slate-700 p-6 rounded">

<h2 className="font-semibold mb-4">
Contract Insights
</h2>

<pre className="whitespace-pre-wrap text-gray-300">
{result}
</pre>

</div>

)}

</div>

)

}