"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Papa from "papaparse";

type Lead = {
  id: string;
  name: string;
  phone: string;
  company: string;
  status: string;
};

export default function SalesCalling() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [sheetLink, setSheetLink] = useState("");

  // ---------------- FETCH LEADS ----------------
  const fetchLeads = async () => {
    const { data } = await supabase.from("leads").select("*");
    setLeads(data || []);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // ---------------- MANUAL ADD ----------------
  const handleManualAdd = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Not authenticated");
    return;
  }

  await fetch("/api/leads/manual", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      phone,
      company,
      userId: user.id,
    }),
  });

  setName("");
  setPhone("");
  setCompany("");
  fetchLeads();
};

  // ---------------- STATUS UPDATE ----------------
  const updateStatus = async (leadId: string, newStatus: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await fetch("/api/leads/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId,
        newStatus,
        userId: user?.id,
      }),
    });

    fetchLeads();
  };

  // ---------------- CSV UPLOAD ----------------
  const handleCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: async (results: any) => {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const cleaned = results.data
          .filter((row: any) => row.name)
          .map((row: any) => ({
            name: row.name,
            phone: row.phone,
            company: row.company,
          }));

        await fetch("/api/leads/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leads: cleaned,
            userId: user?.id,
            source: "csv",
          }),
        });

        fetchLeads();
      },
    });
  };

  // ---------------- GOOGLE SHEET IMPORT ----------------
  const importSheet = async () => {
    const csvUrl = sheetLink.replace("/edit", "/export?format=csv");
    const response = await fetch(csvUrl);
    const text = await response.text();

    Papa.parse(text, {
      header: true,
      complete: async (results: any) => {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const cleaned = results.data
          .filter((row: any) => row.name)
          .map((row: any) => ({
            name: row.name,
            phone: row.phone,
            company: row.company,
          }));

        await fetch("/api/leads/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leads: cleaned,
            userId: user?.id,
            source: "sheet",
          }),
        });

        fetchLeads();
      },
    });
  };

  const pending = leads.filter((l) => l.status === "pending");
  const meetings = leads.filter((l) => l.status === "meeting");
  const closed = leads.filter((l) => l.status === "closed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6 text-white">
      <h1 className="text-2xl font-semibold mb-6">📞 Sales Calling</h1>

      {/* IMPORT SECTION */}
      <div className="bg-gray-900 p-6 rounded-xl mb-8 space-y-4">
        <h2 className="font-semibold">Add Leads</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-800 p-2 rounded"
          />
          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-gray-800 p-2 rounded"
          />
          <input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="bg-gray-800 p-2 rounded"
          />
        </div>

        <button
          onClick={handleManualAdd}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Add Lead
        </button>

        <div>
          <input
            type="file"
            accept=".csv"
            onChange={(e) =>
              e.target.files && handleCSV(e.target.files[0])
            }
          />
        </div>

        <div className="flex gap-2">
          <input
            placeholder="Google Sheet Link"
            value={sheetLink}
            onChange={(e) => setSheetLink(e.target.value)}
            className="bg-gray-800 p-2 rounded flex-1"
          />
          <button
            onClick={importSheet}
            className="bg-green-600 px-4 rounded"
          >
            Import
          </button>
        </div>
      </div>

      {/* PIPELINE */}
      <div className="grid md:grid-cols-3 gap-6">
        <Column
          title="Pending Calls"
          leads={pending}
          actions={[
            { label: "No Meeting", status: "called_no_meeting" },
            { label: "Got Meeting", status: "meeting" },
          ]}
          updateStatus={updateStatus}
        />

        <Column
          title="Meetings"
          leads={meetings}
          actions={[
            { label: "Closed", status: "closed" },
            { label: "Lost", status: "lost" },
          ]}
          updateStatus={updateStatus}
        />

        <Column title="Closed Deals" leads={closed} />
      </div>
    </div>
  );
}

function Column({
  title,
  leads,
  actions,
  updateStatus,
}: any) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl">
      <h2 className="font-semibold mb-4">{title}</h2>
      <div className="space-y-3">
        {leads.map((lead: any) => (
          <div
            key={lead.id}
            className="bg-gray-800 p-3 rounded-lg shadow"
          >
            <p className="font-medium">{lead.name}</p>
            <p className="text-sm text-gray-400">
              {lead.company}
            </p>
            <p className="text-sm text-gray-400">
              {lead.phone}
            </p>

            {actions && (
              <div className="flex gap-2 mt-3">
                {actions.map((a: any) => (
                  <button
                    key={a.status}
                    onClick={() =>
                      updateStatus(lead.id, a.status)
                    }
                    className="text-xs bg-blue-600 px-2 py-1 rounded"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}