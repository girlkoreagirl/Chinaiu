import React, { useState } from 'react';
import type { AdCopy } from '../types';
import { CopyIcon, CheckIcon, ImageIcon, DownloadIcon } from './IconComponents';

interface ResultDisplayProps {
  isLoading: boolean;
  generatedImage: string | null;
  generatedCopies: AdCopy[];
}

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-600/50 hover:bg-gray-500/50 text-gray-300 hover:text-white transition">
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, generatedImage, generatedCopies }) => {
  
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    const mimeType = generatedImage.split(';')[0].split(':')[1];
    const extension = mimeType.split('/')[1] || 'png';
    link.download = `ai-generated-image.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400 min-h-[400px]">
        <svg className="animate-spin h-10 w-10 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg font-semibold">광고 크리에이티브 생성 중...</p>
        <p className="text-sm">잠시만 기다려주세요.</p>
      </div>
    );
  }

  if (!generatedImage && generatedCopies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 min-h-[400px]">
        <ImageIcon />
        <h3 className="mt-4 text-xl font-semibold text-gray-300">결과물이 여기에 표시됩니다</h3>
        <p className="mt-1 max-w-sm">위의 단계를 완료하고 '생성' 버튼을 누르면 마법이 펼쳐집니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 h-full">
      <div>
        <h2 className="text-xl font-semibold mb-3 text-indigo-400">생성된 이미지</h2>
        <div className="relative w-full mx-auto bg-gray-900 rounded-lg overflow-hidden aspect-[4/5]">
            {generatedImage ? (
              <>
                <img src={generatedImage} alt="생성된 광고" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex items-center gap-2">
                   <button
                    onClick={handleDownload}
                    className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white hover:text-indigo-300 transition-all duration-200"
                    title="이미지 다운로드"
                  >
                    <DownloadIcon />
                  </button>
                </div>
              </>
            ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-500">
                  이미지 생성 결과가 없습니다.
               </div>
            )}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-3 text-indigo-400">생성된 광고 카피</h2>
        {generatedCopies.length > 0 ? (
          <div className="space-y-3">
            {generatedCopies.map((item, index) => (
              <div key={index} className="relative bg-gray-700 p-4 rounded-lg text-gray-200">
                <p>{item.copy}</p>
                <CopyButton textToCopy={item.copy} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-700 p-4 rounded-lg text-gray-400 h-full flex items-center justify-center">
            <p>광고 카피가 생성되지 않았습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;