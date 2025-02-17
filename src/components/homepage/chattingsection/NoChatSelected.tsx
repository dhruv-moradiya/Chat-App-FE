const NoChatSelected = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
      <div className="w-[200px] h-[200px] ">
        <img
          src="/src/assets/3.png"
          alt=""
          className="invert w-full h-full object-cover"
        />
      </div>
      <p>No chat selected</p>
    </div>
  );
};

export default NoChatSelected;
