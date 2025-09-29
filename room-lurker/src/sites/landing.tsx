import React from 'react';
import Room from '../components/room';

const rooms = [
  {
    name: 'Epison',
    imageUrl:
      'https://cdn.shopify.com/s/files/1/1825/4895/files/DSC_7015_1024x1024.jpg?v=1613664053',
    isEmpty: false,
  },
  {
    name: 'Incuba 2.0',
    imageUrl:
      'https://hips.hearstapps.com/hmg-prod/images/cute-room-ideas-1677096334.png?crop=0.597xw:1.00xh;0.134xw,0&resize=640:*',
    isEmpty: true,
  },
  {
    name: 'Peter Ø',
    imageUrl:
      'https://media.licdn.com/dms/image/v2/D4D12AQGXqFq-9fjwSw/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1729177188850?e=2147483647&v=beta&t=PrpnZnJqqhdAt_Y7y3zhJ5MG9NiDwIpYfklQAFk4G3I',
    isEmpty: false,
  },
    {
    name: 'Storcenter Nord',
    imageUrl:
      'https://cdn.thecoolist.com/wp-content/uploads/2022/06/Biggest-Mall-in-America.jpg',
    isEmpty: true,
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] py-12 px-4">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800 drop-shadow-md tracking-tight">
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
