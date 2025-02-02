import { Input } from "./input";

export const IconInput = ({
  icon,
  ...props
}: { icon?: JSX.Element } & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="w-full flex items-center border border-secondary p-1 px-4 rounded-lg transition duration-200 hover:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:outline focus-within:outline-offset-2 focus-within:outline-1 focus-within:outline-secondary">
      {icon && <div className="mr-2">{icon}</div>}
      <Input
        {...props}
        className="w-full border-none outline-none focus-visible:ring-0 bg-transparent autofill:bg-transparent"
      />
    </div>
  );
};
