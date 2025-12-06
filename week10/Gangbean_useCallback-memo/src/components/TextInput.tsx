import { memo } from 'react';

interface ITextInput {
    onChange: (text: string) => void;
}
const TextInput = ({ onChange }: ITextInput) => {
    console.log('TextInput render');
    return (
        <input
            className='border p-4 rounded-lg'
            type='text'
            onChange={(e) => onChange(e.target.value)}
        />
    );
};

export default memo(TextInput);
