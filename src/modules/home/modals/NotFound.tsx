const NotFoundModal = ({ id }: { id: string }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold text-red-600">Room Not Found</h2>
      <p className="text-center text-gray-600">
        The room with ID <span className="font-mono font-bold">{id}</span> does
        not exist or is full.
      </p>
      <p className="text-sm text-gray-500">
        Please check the room ID and try again.
      </p>
    </div>
  );
};

export default NotFoundModal;
