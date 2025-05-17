'use client'
import { useState, useEffect } from "react";
import LoginPage from "./login/page";
import supabase from "@/lib/supabase";

export default function Home() {

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUser(user)
      console.log('user :>> ', user);
      
    }

    getUser()
  }, [])

    if (!user) return <LoginPage />

    return (
      <div className="p-4">
        <h1 className="text-2xl">Welcome {user.email} 🎉</h1>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            location.href = '/'
          }}
          className="mt-4 p-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
  );
}
