import { memo, useState } from 'react';
import type { MovieFilters } from '../types/movie';
import Input from './Input';
import SelectBox from './SelectBox';
import LanguageSelecter from './LanguageSelecter';
import { LANGUAGE_OPTIONS } from '../constants/movie';

interface MovieFilterProps {
    onChange: (filters: MovieFilters) => void;
}

const MovieFilter = ({ onChange }: MovieFilterProps) => {
    const [query, setQuery] = useState<string>('');
    const [includeAdult, setIncludeAdult] =
        useState<boolean>(false);
    const [language, setLanguage] = useState('ko-KR');

    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement>
    ) => {
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
        <div className='transform space-y-6 rounded-2xl border-gray-300 bg-white p-6 shadow-xl p-6 transiton-all hover:shadow-2xl'>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-wrap gap-6'>
                    <div className='min-w-[450px] flex-1'>
                        <label className='mb-2 block text-sm font-medium text-gray-700'>
                            영화 제목
                        </label>
                        <Input
                            value={query}
                            onChange={setQuery}
                            placeholder='영화 제목을 입력하세요'
                        />
                    </div>
                    <div className='min-w-[250px] flex-1'>
                        <label className='mb-2 block text-sm font-medium text-gray-700'>
                            옵션
                        </label>
                        <SelectBox
                            checked={includeAdult}
                            onChange={setIncludeAdult}
                            label='성인 콘텐츠 표시'
                            id='include-adult'
                            className='w-full rounded-lg border-gray-300 py-2 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <div className='min-w-[250px] flex-1'>
                        <label className='mb-2 block text-sm font-medium text-gray-700'>
                            언어
                        </label>
                        <LanguageSelecter
                            value={language}
                            onChange={setLanguage}
                            options={LANGUAGE_OPTIONS}
                            className='w-full rounded-lg border-gray-300 py-2 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <div className='pt-4'>
                        <button type='submit'>
                            영화 검색
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default memo(MovieFilter);
