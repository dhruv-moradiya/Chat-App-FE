const CircleLoader = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <span className="loader" />
    </div>
  );
};

const SearchLoader = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <span className="search-loader" />
    </div>
  );
};

export { CircleLoader, SearchLoader };
