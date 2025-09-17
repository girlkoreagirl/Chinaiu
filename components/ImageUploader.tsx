import React, { useCallback, useRef } from 'react';
import { UploadIcon, CloseIcon } from './IconComponents';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  preview: string | null;
  onImageRemove: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, preview, onImageRemove }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모의 onClick(파일 탐색기 열기)이 실행되는 것을 방지
    onImageRemove();
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="relative w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors bg-gray-700/50"
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      {preview ? (
        <>
          <img src={preview} alt="미리보기" className="h-full w-full object-contain rounded-lg p-2" />
          <button
            onClick={handleRemoveClick}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white hover:text-red-400 transition-all duration-200"
            title="이미지 삭제"
          >
            <CloseIcon />
          </button>
        </>
      ) : (
        <div className="text-center text-gray-400">
          <UploadIcon />
          <p className="mt-2">클릭하거나 파일을 드래그하세요</p>
          <p className="text-sm">PNG, JPG, WEBP 지원</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;