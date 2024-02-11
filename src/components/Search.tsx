"use client";
import { useRouter } from "next/navigation";
import React from "react";

const Search = () => {
  const router = useRouter();
  const [search, setSearch] = React.useState("");

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      router.push(`/?query=${search}`);
    }
  };

  return (
    <input
      type="text"
      placeholder="Search"
      className="p-2 px-4 w-full rounded-2xl outline-none focus:ring-2 focus:ring-[#FF9B16]"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};

export default Search;
