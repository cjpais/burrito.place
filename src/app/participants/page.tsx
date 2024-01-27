import { PEERS } from "@/features/peers";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <main className="flex flex-col w-full items-center p-8">
      <div className="flex flex-col max-w-2xl gap-8 items-center">
        <Link href="/">
          <img src="/header.svg" className="h-24" />
        </Link>

        <div className="flex flex-col gap-4 pt-8 items-center">
          <h1
            className="font-lucky font-bold text-4xl pb-4"
            style={{
              letterSpacing: "0.075em",
            }}
          >
            Participants
          </h1>
          {PEERS.map((peer, i) => (
            <div key={i}>
              <Link
                href={peer.url}
                className="font-bold text-2xl hover:underline font-lucky text-center text-burrito-link underline"
                style={{
                  letterSpacing: "0.075em",
                }}
              >
                {peer.display}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Page;
