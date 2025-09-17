import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/30 backdrop-blur-sm sticky top-0 z-10">
      <div className="px-4 md:px-8 py-3 text-center md:text-left">
        <div className="text-sm text-gray-300">
          <p className="font-semibold text-white mb-1 text-base">
            중국사업 / 이우시장 동행조사 / 로켓그로스 / 로켓배송 / 스마트스토어
          </p>
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <p>
              <span>중국무역의 모든 상담/ </span>
              <a 
                href="https://open.kakao.com/o/gk5gtosf" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                https://open.kakao.com/o/gk5gtosf
              </a>
            </p>
            <p>
              <span>세무/절세/구매대행 부가세 신고의 모든 것. </span>
              <a 
                href="https://cafe.naver.com/kingshopping" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                https://cafe.naver.com/kingshopping
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
    </header>
  );
};

export default Header;