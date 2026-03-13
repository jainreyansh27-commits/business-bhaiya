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

<h1 className="text-3xl font-semibold mb-8 text-gray-900">
AI Tools
</h1>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{tools.map((tool,i)=>(

<Link key={i} href={tool.link}>

<div className="bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-200 rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-md">

<div className="text-4xl mb-4 text-blue-500">
{tool.icon}
</div>

<h2 className="text-lg font-semibold mb-1 text-gray-900">
{tool.name}
</h2>

<p className="text-sm text-gray-600">
{tool.desc}
</p>

</div>

</Link>

))}

</div>

</div>

)
}