import { Check, Settings, X } from 'lucide-react'
import useGetMyInfo from '../hooks/queries/useGetMyInfo'
import { useState } from 'react'
import type { RequestEditMyInfoDto } from '../types/auth'
import { uploadImage } from '../apis/image'
import { useEditMyInfo } from '../hooks/mutation/auth/useEditMyInfo'

const MyPage = () => {
	const { data } = useGetMyInfo()
	const [isEditMode, setIsEditMode] = useState(false)
	const [editData, setEditData] = useState<RequestEditMyInfoDto>({
		name: data?.data.name ?? '',
		bio: data?.data.bio ?? null,
		avatar: data?.data.avatar ?? null,
	})
	const editMyInfoMutation = useEditMyInfo()

	const handleEditMode = () => {
		setIsEditMode(!isEditMode)
		setEditData({
			name: data?.data.name ?? '',
			bio: data?.data.bio ?? null,
			avatar: data?.data.avatar ?? null,
		})
	}

	const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const { data } = await uploadImage(file)
			setEditData({ ...editData, avatar: data.imageUrl })
		}
	}

	const handleUpdateMyInfo = () => {
		editMyInfoMutation.mutate({
			name: editData.name,
			bio: editData.bio,
			avatar: editData.avatar,
		})
		setIsEditMode(false)
	}

	return (
		<div className='self-center w-160'>
			{isEditMode ? <></> : <Settings className='w-8 h-8 cursor-pointer ml-auto mb-4' onClick={handleEditMode} />}
			<div className='flex gap-6'>
				{isEditMode ? (
					<>
						<label htmlFor='avatar' className='w-24 h-24 rounded-full border border-gray-300 cursor-pointer relative'>
							<img src={editData.avatar ?? undefined} alt='avatar' className='w-24 h-24 rounded-full border border-gray-300' />
							<input type='file' id='avatar' className='absolute opacity-0 cursor-pointer' accept='image/*' onChange={handleUploadImage} />
						</label>
						<div className='flex flex-col gap-2 w-1/2'>
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
						<Check className='w-8 h-8 cursor-pointer' onClick={handleUpdateMyInfo} />
						<X className='w-8 h-8 cursor-pointer' onClick={() => setIsEditMode(false)} />
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
