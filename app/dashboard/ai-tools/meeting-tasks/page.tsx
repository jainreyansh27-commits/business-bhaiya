"use client"

import { useState } from "react"

export default function MeetingTasks(){

const [notes,setNotes] = useState("")
const [audio,setAudio] = useState<File | null>(null)
const [tasks,setTasks] = useState("")
const [loading,setLoading] = useState(false)

async function generateTasks(){

if(!notes && !audio){
alert("Add meeting notes or upload recording")
return
}

setLoading(true)

let formData = new FormData()

formData.append("notes",notes)

if(audio){
formData.append("audio",audio)
}

const res = await fetch("/api/ai/meeting-tasks",{
method:"POST",
body:formData
})

const data = await res.json()

setTasks(data.tasks)

setLoading(false)

}

return(

<div className="max-w-4xl mx-auto p-10">

<h1 className="text-3xl font-semibold mb-6">
Meeting → Tasks
</h1>

<textarea
className="w-full h-48 p-4 bg-slate-900 border border-slate-700 rounded"
placeholder="Paste meeting notes here..."
value={notes}
onChange={(e)=>setNotes(e.target.value)}
/>

<div className="mt-6">

<label className="text-sm text-gray-400">
Upload Meeting Recording
</label>

<input
type="file"
accept="audio/*"
onChange={(e)=>setAudio(e.target.files?.[0] || null)}
className="mt-2"
/>

</div>

<button
onClick={generateTasks}
className="mt-6 bg-purple-600 px-6 py-3 rounded-lg"
>
{loading ? "Processing..." : "Generate Tasks"}
</button>

{tasks && (

<div className="mt-8 bg-slate-800 border border-slate-700 p-6 rounded">

<h2 className="font-semibold mb-4">
Generated Tasks
</h2>

<pre className="whitespace-pre-wrap text-gray-300 mb-6">
{tasks}
</pre>

<button
onClick={async()=>{

const res = await fetch("/api/tasks/add-ai-tasks",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({tasks})
})

const data = await res.json()

alert("Tasks added successfully")

}}
className="bg-green-600 px-6 py-3 rounded-lg"
>
Add Tasks to Task Manager
</button>

</div>

)}

</div>

)

}