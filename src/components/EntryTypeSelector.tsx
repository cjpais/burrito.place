import Link from "next/link";
import React from "react";

const TYPES = ["all", "text", "image", "video", "audio"];

const EntryTypeSelector = ({ selected }: { selected: string }) => {
  return (
    <div className="flex gap-4">
      {TYPES.map((type, i) => (
        <Link
          href={`/?type=${type}`}
          key={i}
          className={`p-1 px-4 text-xs rounded-2xl shadow-md ${
            selected
              ? selected === type
                ? "bg-[#FF9B16] text-white"
                : "bg-white text-[#FF9B16]"
              : "bg-white text-[#FF9B16]"
          }`}
        >
          {type}
        </Link>
      ))}
    </div>
  );
};

export default EntryTypeSelector;
