interface ITextInput {
    onChange: (text: string) => void;
}

const TextInput = ({ onChange }: ITextInput) => {
    console.log('TextInput render');

    return (
        <input
            className='border rounded-lg p-4'
            type='text'
            onChange={(e) => onChange(e.target.value)}
        />
    );
};

export default TextInput;