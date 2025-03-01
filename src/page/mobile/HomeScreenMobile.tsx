import { useNavigate } from "react-router-dom";

const HomeScreenMobile = () => {
  const navigate = useNavigate();

  return (
    <>
      {new Array(10).fill(0).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 px-4 py-3 my-11px hover:bg-accent-foreground/5 rounded-lg transition-colors duration-200 cursor-pointer"
          onClick={() => navigate("/chat/123")}
        >
          <div className="w-9 h-9 rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src="https://i.pinimg.com/736x/57/ff/d2/57ffd2de1067686f07d41a56b2eb76df.jpg"
              alt=""
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-base">Chat Name</h3>
              <span className="text-[11px] text-muted-foreground">
                12-03-2025
              </span>
            </div>
            <p className="whitespace-nowrap text-ellipsis overflow-hidden text-[12px] text-muted-foreground">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Reprehenderit, voluptatum!
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default HomeScreenMobile;
