const CircleLoader = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="loader" />
    </div>
  );
};

const SearchLoader = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="search-loader" />
    </div>
  );
};

export { CircleLoader, SearchLoader };
