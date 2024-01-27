import { BurritoPeer } from "@/features/peers";
import { BurritoEntry } from "@/app/page";
import React from "react";
import Link from "next/link";
import dayjs from "dayjs";

const colors = ["#C700D1", "#E4028C", "#FF0066", "#FF9B16"];

const randomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

const Entry = ({ entry, peer }: { entry: BurritoEntry; peer: BurritoPeer }) => {
  const color = randomColor();

  return (
    <div
      className="flex flex-col gap-2 rounded-2xl p-2"
      // style={{ boxShadow: `0px 0px 18px 32px ${color}`, background: color }}
    >
      <Link
        href={`${peer.url}/${entry.hash}`}
        className="font-bold text-3xl hover:underline font-lucky text-center"
        // className="font-bold text-3xl hover:underline font-lucky underline"
        style={{
          letterSpacing: "0.075em",
          // textShadow: "0px 0px 16px rgba(0,0,0,.5)",
        }}
      >
        {entry.title.replaceAll('"', "")}
      </Link>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1 text-xl">
          <Link href={peer.url} className="text-burrito-link hover:underline">
            {peer.display}
          </Link>
          <p>•</p>
          <p>{dayjs(entry.created * 1000).format("MMM D, YYYY - h:mma")}</p>
        </div>
        <p>{entry.location}</p>
      </div>
      {/* <p>{entry.hash}</p> */}
      {entry.type === "video" && (
        <video
          src={`${peer.url}/v/${entry.hash}`}
          controls
          className="rounded-3xl shadow-xl mt-4"
          // className="h-96 w-fit self-center"
          style={
            {
              // boxShadow: "0px 0px 18px 4px rgba(0,0,0,.35)",
            }
          }
        />
      )}
      {entry.type === "image" && (
        <img
          src={`${peer.url}/i/${entry.hash}`}
          alt={entry.description}
          className="rounded-3xl shadow-xl mt-2"
          style={
            {
              // boxShadow: "0px 0px 35px 4px rgba(0,0,0,.5)",
            }
          }
        />
      )}
      {entry.type === "audio" && <p>{entry.summary}</p>}
      {entry.description && (
        <p className="italic text-sm">{entry.description}</p>
      )}
    </div>
  );
};

export default Entry;
