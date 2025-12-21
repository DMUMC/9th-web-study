import { useState, useEffect, useCallback } from "react";

interface MovieFilterProps {
  onFilterChange?: (filters: {
    query: string;
    includeAdult: boolean;
    language: string;
  }) => void;
}

export default function MovieFilter({ onFilterChange }: MovieFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState("ko-KR");

  const notifyFilterChange = useCallback(() => {
    onFilterChange?.({
      query: searchQuery,
      includeAdult,
      language,
    });
  }, [searchQuery, includeAdult, language, onFilterChange]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    notifyFilterChange();
  };

  useEffect(() => {
    notifyFilterChange();
  }, [includeAdult, language, notifyFilterChange]);

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit}>
        <div className="search-area space-y-4">
          <input
            type="text"
            placeholder="영화 제목을 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAdult}
                onChange={(e) => setIncludeAdult(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">성인 콘텐츠 포함</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">언어:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ko-KR">한국어 (ko-KR)</option>
                <option value="en-US">영어 (en-US)</option>
                <option value="ja-JP">일본어 (ja-JP)</option>
              </select>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
