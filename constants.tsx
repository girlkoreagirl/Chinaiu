import React from 'react';
import type { StylePreset, AspectRatio, FrameSetting, OutputSize, OutputFormat } from './types';
import { AspectRatioIcons } from './components/IconComponents';

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'remove-bg',
    name: '배경 제거 (누끼)',
    imageUrl: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=300&h=200&fit=crop',
    prompt: '이 이미지에서 제품만 남기고 배경을 완벽하게 제거해주세요. 최종 결과물은 투명 배경 또는 순백색의 깨끗한 배경이어야 합니다.'
  },
  {
    id: 'marble',
    name: '고급 대리석',
    imageUrl: 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=300&h=200&fit=crop',
    prompt: '제품을 고급스러운 흰색 또는 회색 대리석 배경 위에 자연스럽게 놓아주세요. 은은한 그림자와 사실적인 조명을 추가하여 제품을 돋보이게 만들어주세요.'
  },
  {
    id: 'wood',
    name: '따뜻한 나무 질감',
    imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=300&h=200&fit=crop',
    prompt: '제품을 따뜻하고 자연스러운 느낌의 나무 판이나 테이블 위에 배치해주세요. 햇살이 비치는 듯한 부드러운 조명 효과를 더해 아늑한 분위기를 연출해주세요.'
  },
  {
    id: 'concrete',
    name: '모던 콘크리트',
    imageUrl: 'https://images.unsplash.com/photo-1554189097-463e2a048a14?q=80&w=300&h=200&fit=crop',
    prompt: '제품을 미니멀하고 모던한 콘크리트 질감의 배경에 배치해주세요. 강한 그림자를 활용하여 극적인 효과를 주거나, 부드러운 조명으로 세련된 느낌을 강조해주세요.'
  },
  {
    id: 'water',
    name: '청량한 물결',
    imageUrl: 'https://images.unsplash.com/photo-1530554764233-e79e16c91d08?q=80&w=300&h=200&fit=crop',
    prompt: '제품 주변에 맑고 청량한 물결 효과나 물방울을 추가해주세요. 제품이 물 위에 떠 있거나, 물이 튀는 역동적인 순간을 연출하여 시원한 느낌을 주세요.'
  },
  {
    id: 'forest',
    name: '싱그러운 숲속',
    imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=300&h=200&fit=crop',
    prompt: '제품을 이끼와 나무가 있는 싱그러운 숲속 배경에 자연스럽게 합성해주세요. 아침 햇살이 나뭇잎 사이로 비치는 듯한 신비로운 조명 효과를 추가해주세요.'
  },
];

export const ASPECT_RATIOS: AspectRatio[] = [
  {
    id: 'none',
    label: '선택 없음',
    className: '',
    icon: <AspectRatioIcons.None />,
  },
  {
    id: '4:5',
    label: '4:5',
    className: 'aspect-[4/5]',
    icon: <AspectRatioIcons.Portrait />,
  },
  {
    id: '9:16',
    label: '9:16',
    className: 'aspect-[9/16]',
    icon: <AspectRatioIcons.Story />,
  },
  {
    id: '1:1',
    label: '1:1',
    className: 'aspect-square',
    icon: <AspectRatioIcons.Square />,
  },
  {
    id: '16:9',
    label: '16:9',
    className: 'aspect-video',
    icon: <AspectRatioIcons.Landscape />,
  },
];

export const PRODUCT_DIRECTIONS = ['정면 (정면에서 촬영)', '살짝 위에서', '아래에서 위로', '45도 각도'];
export const LIGHTING_DIRECTIONS = ['왼쪽 위', '오른쪽 위', '정면', '뒤에서 (백라이트)'];
export const LIGHTING_BRIGHTNESS = ['밝은 스튜디오 조명', '부드러운 자연광', '어둡고 극적인 조명', '네온사인 조명'];
export const PRODUCT_ARRANGEMENTS = ['자연스럽게', '일렬로', '삼각형으로', '사각형으로', '원형으로'];

export const FRAME_SETTINGS: FrameSetting[] = [
  { id: 'default', label: '기본' },
  { id: 'filled', label: '꽉 찬 화면' },
  { id: 'left', label: '왼쪽 정렬' },
  { id: 'right', label: '오른쪽 정렬' },
];

export const OUTPUT_SIZES: OutputSize[] = [
  { id: 'none', label: '선택 없음' },
  { id: '1000x1000', label: '1000 x 1000' },
  { id: '850x850', label: '850 x 850' },
  { id: '500x500', label: '500 x 500' },
];

export const OUTPUT_FORMATS: OutputFormat[] = [
  { id: 'none', label: '선택 없음' },
  { id: 'JPG', label: 'JPG' },
  { id: 'PNG', label: 'PNG' },
];