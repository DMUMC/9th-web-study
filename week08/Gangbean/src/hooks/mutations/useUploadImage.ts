import { useMutation } from '@tanstack/react-query';
import { postImageUpload } from '../../apis/upload';

function useUploadImage() {
    return useMutation({
        mutationFn: (file: File) => postImageUpload(file),
    });
}

export default useUploadImage;
