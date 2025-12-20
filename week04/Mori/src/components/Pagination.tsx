import { usePage } from "../contexts/PageProvider";

interface PaginationProps {
  totalPage?: number;
}

export const Pagination = ({ totalPage }:PaginationProps ) => {
  const { page, setPage } = usePage();

  return (
    <div className="flex items-center justify-center gap-6 mt-5">
      <button
        className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
          hover:bg-[#c86fdc] transition-all duration-200 disabled:bg-gray-300
          disabled:cursor-not-allowed cursor-pointer"
        disabled={page === 1} 
        onClick={() => setPage((prev) => prev -1)}>
        {'<'}
      </button>
      <span>{page} 페이지</span>
      <button
        className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
          hover:bg-[#c86fdc] transition-all duration-200 disabled:bg-gray-300
          disabled:cursor-not-allowed cursor-pointer"
        disabled={page === totalPage}
        onClick={() => setPage((prev) => prev +1)}>
        {'>'}
      </button>
    </div>
  );
}