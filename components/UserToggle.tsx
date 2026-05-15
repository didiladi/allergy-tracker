"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "allergie_user";

export function useUser(users: string[]): [string, (u: string) => void] {
  const [user, setUser] = useState<string>("");

  useEffect(() => {
    if (users.length === 0) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    setUser(stored && users.includes(stored) ? stored : users[0]);
  }, [users.join(",")]);

  const setAndStore = (u: string) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, u);
  };

  return [user, setAndStore];
}

interface Props {
  users: string[];
  value: string;
  onChange: (u: string) => void;
}

export default function UserToggle({ users, value, onChange }: Props) {
  if (users.length === 0) return null;
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1 w-fit">
      {users.map((u) => (
        <button
          key={u}
          onClick={() => onChange(u)}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
            value === u
              ? "bg-white shadow text-emerald-700 font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {u}
        </button>
      ))}
    </div>
  );
}
