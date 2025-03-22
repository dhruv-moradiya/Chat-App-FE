const NoChatSelected = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1">
      <div className="h-[200px] w-[200px]">
        <img src="/src/assets/3.png" alt="" className="h-full w-full object-cover invert" />
      </div>
      <p>No chat selected</p>
    </div>
  );
};

export default NoChatSelected;
