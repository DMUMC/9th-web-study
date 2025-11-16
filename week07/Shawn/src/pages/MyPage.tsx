import { Settings } from 'lucide-react'
import useGetMyInfo from '../hooks/queries/useGetMyInfo'
import { useState } from 'react'
import type { RequestEditMyInfoDto } from '../types/auth'

const MyPage = () => {
	const { data } = useGetMyInfo()
	const [isEditMode, setIsEditMode] = useState(false)
	const [editData, setEditData] = useState<RequestEditMyInfoDto>({
		name: data?.data.name ?? '',
		bio: data?.data.bio ?? null,
		avatar: data?.data.avatar ?? null,
	})

	const handleEditMode = () => {
		setIsEditMode(!isEditMode)
		setEditData({
			name: data?.data.name ?? '',
			bio: data?.data.bio ?? null,
			avatar: data?.data.avatar ?? null,
		})
	}

	return (
		<div className='self-center w-160'>
			<Settings className='w-8 h-8 cursor-pointer ml-auto mb-4' onClick={handleEditMode} />
			<div className='flex gap-6'>
				{isEditMode ? (
					<>
						<img src={data?.data.avatar ?? undefined} alt='avatar' className='w-24 h-24 rounded-full border border-gray-300' />
						<div className='flex flex-col gap-2 w-full'>
							<input
								type='text'
								value={editData.name}
								onChange={(e) => setEditData({ ...editData, name: e.target.value })}
								className='w-full p-2 rounded-md border-2 border-gray-300'
							/>
							<input
								type='text'
								value={editData.bio ?? ''}
								onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
								className='w-full p-2 rounded-md border-2 border-gray-300'
							/>
						</div>
					</>
				) : (
					<>
						<img src={data?.data.avatar ?? undefined} alt='avatar' className='w-24 h-24 rounded-full border border-gray-300' />
						<div className='flex flex-col gap-2'>
							<p className='text-2xl font-bold'>{data?.data.name}</p>
							<p className='text-lg'>{data?.data.email}</p>
							<p className='text-lg'>{data?.data.bio}</p>
						</div>
					</>
				)}
			</div>

		</div>
	)
}

export default MyPage
