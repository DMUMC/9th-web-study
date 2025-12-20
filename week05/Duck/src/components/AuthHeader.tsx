import { Link } from "react-router-dom";

interface AuthHeaderProps {
  title: string;
}

export const AuthHeader = ({ title }: AuthHeaderProps) => {
  return (
    <div className="relative flex justify-center items-center mb-4 text-white">
      <Link to="/" className="absolute left-0">
        <div className="text-2xl cursor-pointer">&lt;</div>
      </Link>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
};
