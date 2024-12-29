import { Input } from "./input";

export const IconInput = ({
  icon,
  ...props
}: { icon?: JSX.Element } & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="w-full flex items-center border-2 border-gray-300 px-2 py-1 rounded-xl ">
      {icon && <div className="mr-2">{icon}</div>}
      <Input
        {...props}
        className="w-full border-none outline-none focus-visible:ring-0"
      />
    </div>
  );
};
