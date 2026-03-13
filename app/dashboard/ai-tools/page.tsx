"use client"

import Link from "next/link"

const tools = [
{
name:"Business Card Scanner",
desc:"Convert business cards into leads or Excel.",
link:"/dashboard/ai-tools/business-card-scanner",
icon:"📇"
},
{
name:"Voice Assistant",
desc:"Talk to Business Bhaiya and execute actions.",
link:"/dashboard/voice",
icon:"🎤"
},
{
name:"Contract Analyzer",
desc:"Upload a contract and understand key clauses.",
link:"/dashboard/ai-tools/contracts",
icon:"📄"
},
{
name:"Meeting → Tasks",
desc:"Convert meeting notes into tasks automatically.",
link:"/dashboard/ai-tools/meeting-tasks",
icon:"📝"
},
{
name:"Market Opportunity Finder",
desc:"Discover new markets and customers.",
link:"/dashboard/ai-tools/market-opportunity-finder",
icon:"🌍"
}
]

export default function AITools(){

return (

<div className="p-10">

<h1 className="text-3xl font-semibold mb-8">
AI Tools
</h1>

<div className="grid grid-cols-3 gap-6">

{tools.map((tool,i)=>(

<Link key={i} href={tool.link}>

<div className="bg-slate-800 hover:bg-slate-700 transition border border-slate-700 rounded-xl p-6 cursor-pointer">

<div className="text-3xl mb-4">
{tool.icon}
</div>

<h2 className="text-lg font-semibold mb-1">
{tool.name}
</h2>

<p className="text-sm text-slate-400">
{tool.desc}
</p>

</div>

</Link>

))}

</div>

</div>

)
}