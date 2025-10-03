interface PaginationProps {
	currentPage: number
	onPageChange: (page: number) => void
}

export const Pagination = ({ currentPage, onPageChange }: PaginationProps) => {
	const isFirstPage = currentPage === 1

	return (
		<div className='flex items-center justify-center gap-4 py-4'>
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={isFirstPage}
				className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
					isFirstPage
						? 'bg-gray-300 text-gray-500 cursor-not-allowed'
						: 'bg-emerald-600 text-white hover:bg-emerald-700'
				}`}
			>
				&lt;
			</button>

			<span className='text-lg font-semibold text-gray-700'>
				{currentPage} 페이지
			</span>

			<button
				onClick={() => onPageChange(currentPage + 1)}
				className='px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer'
			>
				&gt;
			</button>
		</div>
	)
}
