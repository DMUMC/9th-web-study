import { memo, useState } from "react";
import type { MovieFilters } from "../types/movie";
import Input from "./Input";
import SelectBox from "./SelectBox";
import LanguageSelecter from "./LanguageSelecter";
import { LANGUAGE_OPTIONS } from "../constants/movie";

interface MovieFilterProps {
  onChange: (filters: MovieFilters) => void;
}

const MovieFilter = ({ onChange }: MovieFilterProps) => {
  const [query, setQuery] = useState<string>("");
  const [includeAdult, setIncludeAdult] = useState<boolean>(false);
  const [language, setLanguage] = useState("ko-KR");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filters: MovieFilters = {
      query,
      include_adult: includeAdult,
      language,
    };
    onChange(filters);
    console.log(filters);
  };

  return (
    <div className="transform space-y-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-8 shadow-2xl transition-all hover:shadow-purple-500/20 hover:bg-white/15">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-6">
          <div className="min-w-[450px] flex-1">
            <label className="mb-3 block text-sm font-semibold text-white">
              🎬 영화 제목
            </label>
            <Input
              value={query}
              onChange={setQuery}
              placeholder="영화 제목을 입력하세요"
            />
          </div>
          <div className="min-w-[250px] flex-1">
            <label className="mb-3 block text-sm font-semibold text-white">
              ⚙️ 옵션
            </label>
            <SelectBox
              checked={includeAdult}
              onChange={setIncludeAdult}
              label="성인 콘텐츠 표시"
              id="include-adult"
              className="w-full rounded-lg border-gray-300 py-2 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="min-w-[250px] flex-1">
            <label className="mb-3 block text-sm font-semibold text-white">
              🌐 언어
            </label>
            <LanguageSelecter
              value={language}
              onChange={setLanguage}
              options={LANGUAGE_OPTIONS}
              className="w-full rounded-lg border-gray-300 py-2 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-xl"
            >
              🔍 검색
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default memo(MovieFilter);
