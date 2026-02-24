"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function WeeklyPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (!profile) {
      router.push("/onboarding");
    } else {
      router.push("/dashboard");
    }
  };

  checkUser();
}, []);

  if (!user) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold">
        Weekly Check-In
      </h1>

      <p className="mt-4">
        Welcome {user.email}
      </p>
    </div>
  );
}