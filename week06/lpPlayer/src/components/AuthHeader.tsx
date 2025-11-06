import { Link } from "react-router-dom";

interface AuthHeaderProps {
  title: string;
}

export const AuthHeader = ({ title }: AuthHeaderProps) => {
  return (
    <div className="relative mb-6 flex items-center justify-center text-white">
      <Link to="/" className="absolute left-0 text-2xl transition-colors hover:text-[#ff2b9c]">
        &lt;
      </Link>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
};
