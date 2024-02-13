import { BurritoPeer, PEERS, getAuth } from "@/features/peers";
import React from "react";

type PhotoData = {
  hash: string;
  created: number;
  userData: string;
  location: string;
  caption: string;
  description: string;
  title: string;
};

type PeerPhoto = {
  peer: BurritoPeer;
  photo: PhotoData;
};

const fetchLatestImage = async () => {
  const images = await Promise.all(
    PEERS.map((peer) =>
      fetch(`${peer.url}/query/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuth(peer.name)}`,
        },
        body: JSON.stringify({
          query: "can you get the latest photo? please return all the data",
        }),
        next: { revalidate: 300 },
      })
        .then((r) => r.json())
        .then((d) => ({ peer, photo: d } as PeerPhoto))
        .catch((e) => {
          console.error(`error for peer ${peer.name}`, e);
          return null;
        })
    )
  );

  return images
    .filter((i) => i !== null)
    .filter((i) => i?.photo.hash !== undefined) as PeerPhoto[];
};

const Page = async () => {
  const photos = await fetchLatestImage();

  return (
    <div className="grid grid-cols-3 gap-8">
      {photos.map((photo) => (
        <div key={photo.photo.hash}>
          <div>{photo.peer.name}</div>
          <img src={`${photo.peer.url}/i/${photo.photo.hash}`} />
          <div>{photo.photo.title}</div>
          <div>{photo.photo.caption}</div>
          <div>{photo.photo.description}</div>
          <div>{photo.photo.location}</div>
          <div>{photo.photo.userData}</div>
        </div>
      ))}
    </div>
  );
};

export default Page;
