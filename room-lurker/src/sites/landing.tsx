import React from 'react';
import Room from '../components/room';

const rooms = [
  {
    name: 'Edison lokale 113',
    imageUrl:
      'https://medarbejdere.au.dk/fileadmin/_processed_/2/c/csm_M1.2_1427-144__1_230b1d36b8.jpg',
    isEmpty: false,
  },
  {
    name: 'Incuba 2.0 - Broen',
    imageUrl:
      'https://incuba.dk/media/33035/Broen_560pixw.jpg',
    isEmpty: true,
  },
  {
    name: 'Peter Bøgh audit',
    imageUrl:
      'https://medarbejdere.au.dk/fileadmin/_processed_/4/0/csm_2636-U1_24b6e59498.jpg',
    isEmpty: false,
  },
    {
    name: 'Storcenter Nord audit',
    imageUrl:
      'https://kfxproddk.blob.core.windows.net/kfx-prod-dk/venue/6196/images/04c19ecc-3092-4847-bff1-fd813329a8dd.jpg',
    isEmpty: true,
  },
  {
    name: 'Eksamenshus',
    imageUrl:'https://studerende.au.dk/fileadmin/_processed_/b/5/csm_Et_af_de_11_eksamenslokaler_lille_4a50132236.jpg',
    isEmpty: false,
  },
  {
    name: 'Edison lokale 408',
    imageUrl:'https://medarbejdere.au.dk/fileadmin/_processed_/4/a/csm_IMG_1041_eea535f21e.jpg',
    isEmpty: true,
  }
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] py-12 px-4">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800 drop-shadow-sm tracking-tight">
          Room Lurker
        </h1>
        <p className="mt-4 text-gray-600 text-3xl max-w-xl mx-auto">
          📡📡📡
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
