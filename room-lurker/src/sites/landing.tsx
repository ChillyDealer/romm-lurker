// landing.tsx
import React, { useEffect, useState } from "react";
import Room from "../components/room";
import mqtt from "mqtt";

type RoomData = {
  name: string;
  imageUrl: string;
  isEmpty: boolean;
};

const AllRooms: Omit<RoomData, "isEmpty">[] = [
  {
    name: "Edison lokale 113",
    imageUrl:
      "https://medarbejdere.au.dk/fileadmin/_processed_/2/c/csm_M1.2_1427-144__1_230b1d36b8.jpg",
  },
  {
    name: "Peter Bøgh Audit",
    imageUrl:
      "https://medarbejdere.au.dk/fileadmin/_processed_/4/0/csm_2636-U1_24b6e59498.jpg",
  },
  {
    name: "Eksamenshus",
    imageUrl:
      "https://studerende.au.dk/fileadmin/_processed_/b/5/csm_Et_af_de_11_eksamenslokaler_lille_4a50132236.jpg",
  },
  {
    name: "Edison lokale 408",
    imageUrl:
      "https://medarbejdere.au.dk/fileadmin/_processed_/4/a/csm_IMG_1041_eea535f21e.jpg",
  },
  {
    name: "Edison lokale 113",
    imageUrl:
      "https://medarbejdere.au.dk/fileadmin/_processed_/2/c/csm_M1.2_1427-144__1_230b1d36b8.jpg",
  },
  {
    name: "Peter Bøgh Audit",
    imageUrl:
      "https://medarbejdere.au.dk/fileadmin/_processed_/4/0/csm_2636-U1_24b6e59498.jpg",
  },
  {
    name: "Eksamenshus",
    imageUrl:
      "https://studerende.au.dk/fileadmin/_processed_/b/5/csm_Et_af_de_11_eksamenslokaler_lille_4a50132236.jpg",
  },
  {
    name: "Edison lokale 408",
    imageUrl:
      "https://medarbejdere.au.dk/fileadmin/_processed_/4/a/csm_IMG_1041_eea535f21e.jpg",
  },
    {
    name: "Eksamenshus",
    imageUrl:
      "https://studerende.au.dk/fileadmin/_processed_/b/5/csm_Et_af_de_11_eksamenslokaler_lille_4a50132236.jpg",
  },
  {
    name: "Edison lokale 408",
    imageUrl:
      "https://medarbejdere.au.dk/fileadmin/_processed_/4/a/csm_IMG_1041_eea535f21e.jpg",
  },
];

const Landing = () => {
  const [rooms, setRooms] = useState<RoomData[]>(
    AllRooms.map((room) => ({ ...room, isEmpty: true })) // default true
  );

  useEffect(() => {
    const client = mqtt.connect("ws://localhost:8083/mqtt"); // use raspberry pi ip

    client.on("connect", () => {
      console.log("connected mqtt");
      client.subscribe("rooms/+/emptyStatus"); // + er wildcard
    });

    client.on("message", (topic, payload) => {
      try {
        const data = JSON.parse(payload.toString()) as {
          roomId: string;
          isEmpty: boolean;
        };

        // room by name
        setRooms((prev) =>
          prev.map((room) =>
            room.name === data.roomId
              ? { ...room, isEmpty: data.isEmpty }
              : room
          )
        );
      } catch (err) {
        console.error("error:", err);
      }
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] py-12 px-4">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800 drop-shadow-sm tracking-tight">
          Room Lurker
        </h1>
        <p className="mt-4 text-gray-600 text-3xl max-w-xl mx-auto">
          Find your perfect study spot for your group 📡📡📡📡
        </p>
      </div>

      <div className="flex flex-wrap justify-center items-start gap-8 animate-fade-in">
        {rooms.map((room, index) => (
          <Room key={index} {...room} />
        ))}
      </div>
    </div>
  );
};

export default Landing;
