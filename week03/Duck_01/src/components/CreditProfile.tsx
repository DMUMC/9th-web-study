interface CreditProfileProps {
    profile_path: string
    name: string
    character: string | null
    department: string | null
}

export const CreditProfile = ({ profile_path, name, character, department }: CreditProfileProps) => {
    return (
        <div className='flex flex-col items-center w-36'>
            <img className='rounded-full w-24 h-24 object-cover border-2 border-gray-700' src={`https://image.tmdb.org/t/p/w200${profile_path}`} alt={''} />
            <h3 className='text-sm font-bold line-clamp-1'>{name}</h3>
            <p className='text-xs text-gray-500 line-clamp-1'>{character}</p>
            <p className='text-xs text-gray-500 line-clamp-1'>{department}</p>
        </div>
    )
}
