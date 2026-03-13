"use client";

import { useState } from "react";

export default function DocumentsPage() {

  const [form, setForm] = useState({
    company_name: "",
    address: "",
    phone: "",
    email: "",
  });

  const [receiver, setReceiver] = useState({
    name: "",
    company: "",
    address: "",
    email: "",
  });

  const [docType, setDocType] = useState("Letter");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState("pdf");

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    const res = await fetch("/api/documents/generate-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        documentType: docType,
        companyProfile: form,
        receiverDetails: receiver,
      }),
    });

    const data = await res.json();

    const aiMessage = {
      role: "assistant",
      content: data.result,
    };

    setMessages((prev) => [...prev, aiMessage]);
    setLoading(false);
  };

  const downloadDoc = async () => {
    const content = messages[messages.length - 1]?.content;
    if (!content) return;

    const res = await fetch("/api/documents/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        companyProfile: form,
        receiverDetails: receiver,
        fileType,
      }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `document.${fileType}`;
    a.click();
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-black text-white">

      <h1 className="text-2xl font-bold mb-6">
        AI Document Studio
      </h1>

      {/* Company Info */}
      <div className="bg-gray-800 p-5 rounded-xl mb-6">
        <h2 className="text-lg font-semibold mb-4">Company Profile</h2>

        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Company Name"
            value={form.company_name}
            onChange={(e) =>
              setForm({ ...form, company_name: e.target.value })
            }
            className="bg-gray-900 p-2 rounded"
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            className="bg-gray-900 p-2 rounded"
          />

          <input
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
            className="bg-gray-900 p-2 rounded"
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="bg-gray-900 p-2 rounded"
          />
        </div>
      </div>

      {/* Receiver Details */}
      <div className="bg-gray-800 p-5 rounded-xl mb-6">
        <h2 className="text-lg font-semibold mb-4">Receiver Details</h2>

        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Receiver Name"
            value={receiver.name}
            onChange={(e) =>
              setReceiver({ ...receiver, name: e.target.value })
            }
            className="bg-gray-900 p-2 rounded"
          />

          <input
            placeholder="Receiver Company"
            value={receiver.company}
            onChange={(e) =>
              setReceiver({ ...receiver, company: e.target.value })
            }
            className="bg-gray-900 p-2 rounded"
          />

          <input
            placeholder="Receiver Address"
            value={receiver.address}
            onChange={(e) =>
              setReceiver({ ...receiver, address: e.target.value })
            }
            className="bg-gray-900 p-2 rounded"
          />

          <input
            placeholder="Receiver Email"
            value={receiver.email}
            onChange={(e) =>
              setReceiver({ ...receiver, email: e.target.value })
            }
            className="bg-gray-900 p-2 rounded"
          />
        </div>
      </div>

      {/* Document Type */}
      <div className="bg-gray-800 p-5 rounded-xl mb-6">
        <h2 className="text-lg font-semibold mb-3">Document Type</h2>

        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="bg-gray-900 p-2 rounded"
        >
          <option>Letter</option>
          <option>Proforma Invoice</option>
          <option>Quotation</option>
          <option>Agreement</option>
          <option>Notice</option>
          <option>Custom</option>
        </select>
      </div>

      {/* Chat Window */}
      <div className="bg-gray-800 rounded-xl p-5 mb-6">

        <div className="h-64 overflow-y-auto mb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 p-2 rounded ${
                msg.role === "user"
                  ? "bg-blue-600 text-right"
                  : "bg-gray-700"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your document request..."
          className="w-full bg-gray-900 p-3 rounded mb-3"
        />

        <button
          onClick={sendMessage}
          className="bg-green-500 px-4 py-2 rounded font-semibold"
        >
          Generate Document
        </button>
      </div>

      {/* Export */}
      <div className="bg-gray-800 p-5 rounded-xl">

        <h2 className="text-lg font-semibold mb-3">
          Export Document
        </h2>

        <select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          className="bg-gray-900 p-2 rounded mr-3"
        >
          <option value="pdf">PDF</option>
          <option value="docx">Word</option>
          <option value="xlsx">Excel</option>
        </select>

        <button
          onClick={downloadDoc}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Download
        </button>

      </div>

    </div>
  );
}