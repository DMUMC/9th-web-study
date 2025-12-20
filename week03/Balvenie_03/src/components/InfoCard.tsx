interface InfoCard {
	label: string;
	value: string;
}

export const InfoCard = ({ label, value }: InfoCard) => {
	return (
		<div className='bg-gray-100 p-4 rounded-lg'>
			<h3 className='text-sm font-semibold text-gray-500 mb-1'>{label}</h3>
			<p className='text-lg text-gray-800'>{value}</p>
		</div>
	)
}