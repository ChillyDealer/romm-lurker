import React from 'react';

type RoomProps = {
  name: string;
  imageUrl: string;
  isEmpty: boolean;
};

const Room: React.FC<RoomProps> = ({ name, imageUrl, isEmpty }) => {
  return (
    <div className="w-64 rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-white/90 backdrop-blur-md m-4 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
      <img
        src={imageUrl}
        alt={name}
        className="h-40 w-full object-cover rounded-t-3xl"
      />
      <div className="p-5">
        <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
        <div className="mt-3">
          <span
            className={`inline-block px-4 py-1 text-sm font-bold rounded-full ${
              isEmpty
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {isEmpty ? 'Empty' : 'Not Empty'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Room;
