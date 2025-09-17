import React, { useState, useCallback } from 'react';
import type { StylePreset, AspectRatio, AdCopy, FrameSetting, OutputSize, OutputFormat } from './types';
import { 
  STYLE_PRESETS, 
  ASPECT_RATIOS,
  PRODUCT_DIRECTIONS,
  LIGHTING_DIRECTIONS,
  LIGHTING_BRIGHTNESS,
  PRODUCT_ARRANGEMENTS,
  FRAME_SETTINGS,
  OUTPUT_SIZES,
  OUTPUT_FORMATS
} from './constants';
import { editImageWithNanoBanana, generateAdCopy } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import AspectRatioSelector from './components/AspectRatioSelector';
import ResultDisplay from './components/ResultDisplay';
import { GenerateIcon } from './components/IconComponents';

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function App() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StylePreset | null>(null);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[0]);
  const [brandName, setBrandName] = useState<string>('');
  const [toneAndManner, setToneAndManner] = useState<string>('');
  
  // Image customization state
  const [productDirection, setProductDirection] = useState<string>(PRODUCT_DIRECTIONS[0]);
  const [lightingDirection, setLightingDirection] = useState<string>(LIGHTING_DIRECTIONS[0]);
  const [lightingBrightness, setLightingBrightness] = useState<string>(LIGHTING_BRIGHTNESS[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [productArrangement, setProductArrangement] = useState<string>(PRODUCT_ARRANGEMENTS[0]);
  const [frameSetting, setFrameSetting] = useState<FrameSetting>(FRAME_SETTINGS[0]);
  const [outputSize, setOutputSize] = useState<OutputSize>(OUTPUT_SIZES[0]);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(OUTPUT_FORMATS[0]);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedCopies, setGeneratedCopies] = useState<AdCopy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      setError('지원하지 않는 파일 형식입니다. JPG, PNG, WEBP 파일만 지원합니다.');
      setOriginalImage(null);
      setOriginalImagePreview(null);
      return;
    }
    setError(null); // 유효한 파일이 업로드되면 이전 오류 메시지 제거
    setOriginalImage(file);
    setOriginalImagePreview(URL.createObjectURL(file));
  };

  const handleImageRemove = useCallback(() => {
    setOriginalImage(null);
    setOriginalImagePreview(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!originalImage || !selectedStyle) {
      setError('이미지를 업로드하고, 스타일을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedCopies([]);

    try {
      let customizationPrompt = `제품은 ${productDirection} 방향에서 보이게 촬영한 것처럼 연출해주세요. 조명은 ${lightingDirection}에서 비추는 것처럼, 조명 밝기는 ${lightingBrightness}으로 연출해주세요. 이미지에는 제품 ${quantity}개를 ${productArrangement}으로 배치해주세요.`;
      
      switch (frameSetting.id) {
        case 'filled':
          customizationPrompt += ' 제품이 프레임을 가득 채우도록 클로즈업해서 연출해주세요.';
          break;
        case 'left':
          customizationPrompt += ' 제품을 프레임의 왼쪽에 여백을 두고 배치해주세요.';
          break;
        case 'right':
          customizationPrompt += ' 제품을 프레임의 오른쪽에 여백을 두고 배치해주세요.';
          break;
      }
      
      const promptParts: string[] = [selectedStyle.prompt, customizationPrompt];

      if (selectedAspectRatio.id !== 'none') {
        promptParts.push(`최종 이미지의 종횡비는 ${selectedAspectRatio.label}로 맞춰주세요.`);
      }

      const outputSettings = [];
      if (outputSize.id !== 'none') {
        outputSettings.push(`해상도는 ${outputSize.id} 픽셀`);
      }
      if (outputFormat.id !== 'none') {
        outputSettings.push(`파일 형식은 ${outputFormat.id}`);
      }
      if (outputSettings.length > 0) {
        promptParts.push(`최종 이미지는 ${outputSettings.join(', ')}로 생성해주세요.`);
      }

      promptParts.push('광고에 사용될 수 있도록 제품을 더욱 매력적이고 선명하게 만들어주세요.');
      
      const fullPrompt = promptParts.join(' ').replace(/\s+/g, ' ').trim();
      
      const [imageResult, copyResult] = await Promise.all([
        editImageWithNanoBanana(originalImage, fullPrompt),
        generateAdCopy(brandName, toneAndManner),
      ]);
      
      if (!imageResult) {
        throw new Error('이미지 생성에 실패했습니다. 모델이 이미지를 반환하지 않았습니다.');
      }

      setGeneratedImage(imageResult);
      setGeneratedCopies(copyResult);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, selectedStyle, selectedAspectRatio, brandName, toneAndManner, productDirection, lightingDirection, lightingBrightness, quantity, productArrangement, frameSetting, outputSize, outputFormat]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-grow p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section: Controls */}
        <div className="w-full bg-gray-800/50 rounded-2xl p-6 flex flex-col gap-6 self-start">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
             <div>
              <h2 className="text-xl font-semibold mb-3 text-indigo-400">1. 제품 이미지 업로드</h2>
              <ImageUploader 
                onImageUpload={handleImageUpload} 
                preview={originalImagePreview}
                onImageRemove={handleImageRemove}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3 text-indigo-400">2. 스타일 선택</h2>
              <StyleSelector
                presets={STYLE_PRESETS}
                selectedPreset={selectedStyle}
                onSelect={setSelectedStyle}
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3 text-indigo-400">3. 이미지 맞춤 설정</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label htmlFor="product-direction" className="block text-sm font-medium text-gray-300 mb-1">제품 방향</label>
                <select 
                  id="product-direction" 
                  value={productDirection}
                  onChange={(e) => setProductDirection(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                >
                  {PRODUCT_DIRECTIONS.map(dir => <option key={dir} value={dir}>{dir}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="lighting-direction" className="block text-sm font-medium text-gray-300 mb-1">조명 방향</label>
                <select 
                  id="lighting-direction" 
                  value={lightingDirection}
                  onChange={(e) => setLightingDirection(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                >
                  {LIGHTING_DIRECTIONS.map(dir => <option key={dir} value={dir}>{dir}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="lighting-brightness" className="block text-sm font-medium text-gray-300 mb-1">조명 밝기</label>
                <select 
                  id="lighting-brightness" 
                  value={lightingBrightness}
                  onChange={(e) => setLightingBrightness(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                >
                  {LIGHTING_BRIGHTNESS.map(br => <option key={br} value={br}>{br}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1">수량</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <label htmlFor="product-arrangement" className="block text-sm font-medium text-gray-300 mb-1">제품 배열</label>
                <select 
                  id="product-arrangement" 
                  value={productArrangement}
                  onChange={(e) => setProductArrangement(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                >
                  {PRODUCT_ARRANGEMENTS.map(arr => <option key={arr} value={arr}>{arr}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3 text-indigo-400">4. 광고 정보 입력 <span className="text-gray-400 font-normal text-base">(선택)</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="브랜드 이름 (예: '아우라 코스메틱')"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
              <input
                type="text"
                placeholder="톤앤매너 (예: '재치있고 발랄하게')"
                value={toneAndManner}
                onChange={(e) => setToneAndManner(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-3 text-indigo-400">5. 프레임 설정</h2>
              <div className="flex flex-wrap items-center justify-start gap-2 bg-gray-700/50 p-2 rounded-lg h-full">
                {FRAME_SETTINGS.map((setting) => (
                  <button
                    key={setting.id}
                    onClick={() => setFrameSetting(setting)}
                    className={`flex-grow px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${
                      frameSetting.id === setting.id
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    {setting.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-3 text-indigo-400">6. 종횡비 선택</h2>
              <AspectRatioSelector
                ratios={ASPECT_RATIOS}
                selectedRatio={selectedAspectRatio}
                onSelect={setSelectedAspectRatio}
              />
            </div>
          </div>
          

          <div>
            <h2 className="text-xl font-semibold mb-3 text-indigo-400">7. 출력 설정</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">이미지 사이즈</label>
                <div className="flex flex-wrap items-center justify-start gap-2 bg-gray-700/50 p-2 rounded-lg">
                  {OUTPUT_SIZES.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setOutputSize(size)}
                       className={`flex-grow px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${
                        outputSize.id === size.id
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">이미지 형식</label>
                <div className="flex flex-wrap items-center justify-start gap-2 bg-gray-700/50 p-2 rounded-lg">
                  {OUTPUT_FORMATS.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setOutputFormat(format)}
                      className={`flex-grow px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${
                        outputFormat.id === format.id
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`w-full text-lg font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3
                ${isLoading 
                  ? 'bg-gray-600 cursor-wait' 
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transform hover:-translate-y-1'
                }
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  생성 중...
                </>
              ) : (
                <>
                  <GenerateIcon />
                  광고 크리에이티브 생성
                </>
              )}
            </button>
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
          </div>
        </div>

        {/* Right Section: Results */}
        <div className="w-full bg-gray-800/50 rounded-2xl p-6">
          <ResultDisplay
            isLoading={isLoading}
            generatedImage={generatedImage}
            generatedCopies={generatedCopies}
          />
        </div>
      </main>
    </div>
  );
}