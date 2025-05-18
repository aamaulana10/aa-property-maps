'use client'
import { useState, useEffect } from "react";
import LoginPage from "./login/page";
import supabase from "@/lib/supabase";
import MapPage from "./map/page";

import dotenv from "dotenv"
import { User } from "@supabase/supabase-js";
dotenv.config()

export default function Home() {

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUser(user)
      console.log('user :>> ', user?.id);
      
    }

    getUser()
  }, [])

    if (!user) return <LoginPage />

    return (
      <div>
        <div className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-800">
                Welcome back, <span className="text-blue-600">{user.email}</span>
              </h1>
              <span className="animate-bounce">👋</span>
            </div>
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                location.href = '/'
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3zm11 4.414l-4.293 4.293a1 1 0 0 1-1.414 0L4 7.414 5.414 6l3.293 3.293L12 6l2 1.414z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto">
          <MapPage />
        </div>
      </div>
    );
}
