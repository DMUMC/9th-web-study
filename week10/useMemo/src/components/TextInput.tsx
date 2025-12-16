interface ITextInput {
    onChange: (text: string) => void;
}

const TextInput = ({ onChange }: ITextInput) => {
    // 컴포넌트가 재렌더링되는지 확인용 로그
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
