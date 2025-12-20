import { X } from 'lucide-react'
import useLpModal from '../store/useLpModal'
import { useForm, type SubmitHandler, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useMemo } from 'react'
import { LpTag } from './LpTag'
import useAddLp from '../hooks/mutation/Lp/useAddLp'
import { uploadImage } from '../apis/image'

const schema = z.object({
    thumbnail: z.string(),
    name: z.string().min(1, {message: 'Name is required'}),
    content: z.string().min(1, {message: 'Content is required'}),
    tags: z.array(z.string()).min(1, {message: 'Tags is required'}),
})

type Formfields = z.infer<typeof schema>

const LpModal = () => {
    const {setIsOpen} = useLpModal()
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')
    const {register, handleSubmit, formState: {errors}, control, setValue} = useForm<Formfields>({
        resolver: zodResolver(schema),
        defaultValues: {
            thumbnail: '',
            name: '',
            content: '',
            tags: []
        },
        mode: 'onBlur',
    })
    const addLpMutation = useAddLp()
    const watchedValues = useWatch({ control })

    const onSubmit: SubmitHandler<Formfields> = (data) => {
        addLpMutation.mutate({
            title: data.name,
            content: data.content,
            thumbnail: data.thumbnail,
            tags: data.tags,
            published: true
        })
    }

    const handleClose = () => {
        setIsOpen(false)
    }

    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        handleClose()
    }

    const isDisabled = useMemo(() => {
        const thumbnail = watchedValues?.thumbnail
        const name = watchedValues?.name
        const content = watchedValues?.content
        const tags = watchedValues?.tags || []

        return !thumbnail ||
               !!errors.thumbnail ||
               !name ||
               !!errors.name ||
               !content ||
               !!errors.content ||
               !Array.isArray(tags) ||
               tags.length === 0 ||
               !!errors.tags
    }, [watchedValues, errors])

    const handleAddTag = (newTag: string) => {
        if (!newTag.trim() || tags.includes(newTag.trim())) {
            return
        }
        const newTags = [...tags, newTag.trim()]
        setTags(newTags)
        setTagInput('')
        setValue('tags', newTags)
    }

    const handleDeleteTag = (tag: string) => {
        const newTags = tags.filter((t) => t !== tag)
        setTags(newTags)
        setValue('tags', newTags)
    }

    const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const { data } = await uploadImage(file)
            setValue('thumbnail', data.imageUrl, { shouldValidate: true, shouldDirty: true })
        }
    }

    return (
        <div className='absolute inset-0 flex justify-center items-center z-60'>
            <form className='flex flex-col gap-4 bg-neutral-600 rounded-md p-4 z-100 w-[500px]' onSubmit={handleSubmit(onSubmit)}>
                <X className='self-end text-white' onClick={handleClose} />
                <input
                    type="file"
                    className='w-full h-64 object-cover self-center'
                    placeholder='LP Thumbnail'
                    accept='image/*'
                    onChange={handleThumbnailChange}
                />
                <input type="text" placeholder='LP Name' className='w-full h-10 rounded-md p-2 border-2 border-neutral-400' {...register('name')} />
                <input type="text" placeholder='LP Content' className='w-full h-10 rounded-md p-2 border-2 border-neutral-400' {...register('content')} />
                <div className='flex gap-4'>
                    <input type="text" placeholder='LP Tags' className='w-full h-10 rounded-md p-2 border-2 border-neutral-400'  value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(tagInput); } }} />
                    <button type="button" className='w-20 h-10 rounded-md p-2 bg-teal-500 text-white hover:bg-teal-600 transition-all duration-300' onClick={() => handleAddTag(tagInput)}>Add</button>
                </div>
                <div className='flex gap-2 flex-wrap'>
                    {tags.map((tag) => (
                        <LpTag key={tag} tag={tag} onDelete={() => handleDeleteTag(tag)} />
                    ))}
                </div>
                <button className='w-full h-10 rounded-md p-2 bg-teal-500 text-white hover:bg-teal-600 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:bg-neutral-700' disabled={isDisabled}>Add Lp</button>
            </form>
            <div className='absolute inset-0 bg-black opacity-70 flex justify-center items-center z-60' onClick={handleBackgroundClick} />
        </div>
    )
}

export default LpModal