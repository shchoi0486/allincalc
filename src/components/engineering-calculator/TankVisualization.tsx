'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useI18n } from '@/i18n/I18nProvider';

interface TankVisualizationProps {
  tankType: string;
  diameter?: number;
  height?: number;
  length?: number;
  width?: number;
  radius1?: number;
  radius2?: number;
  topDiameter?: number;
  bottomDiameter?: number;
  cylinderHeight?: number;
  coneHeight?: number;
  unit?: string;
}

// Tank 타입과 이미지 파일 매핑
const TANK_TYPE_IMAGES = {
  'vertical-cylinder': '/tank type/vertical-cylinder-tank-volume.webp',
  'horizontal-cylinder': '/tank type/horizontal-cylinder-tank-volume.webp',
  'rectangular-prism': '/tank type/rectangular-prism-tank-volume.webp',
  'vertical-capsule': '/tank type/vertical-capsule-tank-volume.webp',
  'horizontal-capsule': '/tank type/horizontal-capsule-tank-volume.webp',
  'vertical-elliptical': '/tank type/vertical-elliptical-tank-volume.webp',
  'horizontal-elliptical': '/tank type/horizontal-elliptical-tank-volume.webp',
  'cone-bottom': '/tank type/cone-bottom-tank-volume.webp',
  'cone-top': '/tank type/cone-top-tank-volume.webp',
  'frustum': '/tank type/frustum-tank-volume.webp',
} as const;

// Tank 타입별 이름 (한글/영문)
const TANK_TYPE_NAMES_KO = {
  'vertical-cylinder': '수직 원통형',
  'horizontal-cylinder': '수평 원통형',
  'rectangular-prism': '직육면체',
  'vertical-capsule': '수직 캡슐형',
  'horizontal-capsule': '수평 캡슐형',
  'vertical-elliptical': '수직 타원형',
  'horizontal-elliptical': '수평 타원형',
  'cone-bottom': '원뿔 바닥형',
  'cone-top': '원뿔 상단형',
  'frustum': '절두체 (깔때기형)',
} as const;

const TANK_TYPE_NAMES_EN = {
  'vertical-cylinder': 'Vertical Cylinder',
  'horizontal-cylinder': 'Horizontal Cylinder',
  'rectangular-prism': 'Rectangular Prism',
  'vertical-capsule': 'Vertical Capsule',
  'horizontal-capsule': 'Horizontal Capsule',
  'vertical-elliptical': 'Vertical Elliptical',
  'horizontal-elliptical': 'Horizontal Elliptical',
  'cone-bottom': 'Cone Bottom',
  'cone-top': 'Cone Top',
  'frustum': 'Frustum (Truncated Cone)',
} as const;

// Tank 타입별 특징 설명 (한글/영문)
const TANK_TYPE_DESC_KO: Record<string, string> = {
  'vertical-cylinder': '수직으로 설치되는 원통형 탱크',
  'horizontal-cylinder': '수평으로 설치되는 원통형 탱크',
  'rectangular-prism': '직육면체 형태의 저장 탱크',
  'vertical-capsule': '양 끝이 반구형인 수직 캡슐 탱크',
  'horizontal-capsule': '양 끝이 반구형인 수평 캡슐 탱크',
  'vertical-elliptical': '타원형 헤드를 가진 수직 탱크',
  'horizontal-elliptical': '타원형 헤드를 가진 수평 탱크',
  'cone-bottom': '바닥이 원뿔 형태인 탱크',
  'cone-top': '상단이 원뿔 형태인 탱크',
  'frustum': '절두체(깔때기) 형태의 탱크',
};

const TANK_TYPE_DESC_EN: Record<string, string> = {
  'vertical-cylinder': 'A cylindrical tank installed vertically',
  'horizontal-cylinder': 'A cylindrical tank installed horizontally',
  'rectangular-prism': 'A rectangular box-shaped storage tank',
  'vertical-capsule': 'A vertical capsule tank with hemispherical ends',
  'horizontal-capsule': 'A horizontal capsule tank with hemispherical ends',
  'vertical-elliptical': 'A vertical tank with elliptical heads',
  'horizontal-elliptical': 'A horizontal tank with elliptical heads',
  'cone-bottom': 'A tank with a conical bottom',
  'cone-top': 'A tank with a conical top',
  'frustum': 'A frustum (funnel) shaped tank',
};

export default function TankVisualization({
  tankType,
  diameter,
  height,
  length,
  width,
  radius1,
  radius2,
  topDiameter,
  bottomDiameter,
  cylinderHeight,
  coneHeight,
  unit = 'm'
}: TankVisualizationProps) {
  const { locale } = useI18n();
  const isKo = locale === 'ko';
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Tank 타입이 변경될 때마다 이미지 로딩 상태 초기화
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [tankType]);

  // 현재 Tank 타입에 해당하는 이미지 경로
  const currentImage = TANK_TYPE_IMAGES[tankType as keyof typeof TANK_TYPE_IMAGES];
  const currentName = isKo
    ? TANK_TYPE_NAMES_KO[tankType as keyof typeof TANK_TYPE_NAMES_KO]
    : TANK_TYPE_NAMES_EN[tankType as keyof typeof TANK_TYPE_NAMES_EN];
  const currentDesc = isKo ? TANK_TYPE_DESC_KO[tankType] : TANK_TYPE_DESC_EN[tankType];

  // 치수 정보 생성
  const L = {
    diameter: isKo ? '직경' : 'Diameter',
    height: isKo ? '높이' : 'Height',
    length: isKo ? '길이' : 'Length',
    width: isKo ? '폭' : 'Width',
    topDiameter: isKo ? '상단 직경' : 'Top Diameter',
    bottomDiameter: isKo ? '하단 직경' : 'Bottom Diameter',
    cylinderHeight: isKo ? '원통 높이' : 'Cylinder Height',
    coneHeight: isKo ? '원뿔 높이' : 'Cone Height',
    topRadius: isKo ? '상단 반지름' : 'Top Radius',
    bottomRadius: isKo ? '하단 반지름' : 'Bottom Radius',
  };

  const getDimensionInfo = () => {
    const dimensions: string[] = [];
    
    switch (tankType) {
      case 'vertical-cylinder':
      case 'horizontal-cylinder':
        if (diameter) dimensions.push(`${L.diameter}: ${diameter}${unit}`);
        if (height) dimensions.push(`${L.height}: ${height}${unit}`);
        if (length) dimensions.push(`${L.length}: ${length}${unit}`);
        break;
      
      case 'rectangular-prism':
        if (length) dimensions.push(`${L.length}: ${length}${unit}`);
        if (width) dimensions.push(`${L.width}: ${width}${unit}`);
        if (height) dimensions.push(`${L.height}: ${height}${unit}`);
        break;
      
      case 'vertical-capsule':
      case 'horizontal-capsule':
      case 'vertical-elliptical':
      case 'horizontal-elliptical':
        if (diameter) dimensions.push(`${L.diameter}: ${diameter}${unit}`);
        if (height) dimensions.push(`${L.height}: ${height}${unit}`);
        if (length) dimensions.push(`${L.length}: ${length}${unit}`);
        break;
      
      case 'cone-bottom':
      case 'cone-top':
        if (topDiameter) dimensions.push(`${L.topDiameter}: ${topDiameter}${unit}`);
        if (bottomDiameter) dimensions.push(`${L.bottomDiameter}: ${bottomDiameter}${unit}`);
        if (cylinderHeight) dimensions.push(`${L.cylinderHeight}: ${cylinderHeight}${unit}`);
        if (coneHeight) dimensions.push(`${L.coneHeight}: ${coneHeight}${unit}`);
        break;
      
      case 'frustum':
        if (radius1) dimensions.push(`${L.topRadius}: ${radius1}${unit}`);
        if (radius2) dimensions.push(`${L.bottomRadius}: ${radius2}${unit}`);
        if (height) dimensions.push(`${L.height}: ${height}${unit}`);
        break;
      
      default:
        if (diameter) dimensions.push(`${L.diameter}: ${diameter}${unit}`);
        if (height) dimensions.push(`${L.height}: ${height}${unit}`);
    }
    
    return dimensions;
  };

  const dimensionInfo = getDimensionInfo();

  // 이미지가 없는 경우 기본 표시
  if (!currentImage) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🛢️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {currentName || (isKo ? 'Tank 시각화' : 'Tank Visualization')}
          </h3>
          <p className="text-sm text-gray-500">
            {isKo ? '이미지를 불러올 수 없습니다' : 'Image could not be loaded'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden relative">
      {/* 로딩 상태 */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">{isKo ? '이미지 로딩 중...' : 'Loading image...'}</p>
          </div>
        </div>
      )}

      {/* 에러 상태 */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {currentName}
            </h3>
            <p className="text-sm text-gray-500">
              {isKo ? '이미지를 불러올 수 없습니다' : 'Image could not be loaded'}
            </p>
          </div>
        </div>
      )}

      {/* Tank 타입 이미지 */}
      <div className="relative w-full h-full">
        <Image
          src={currentImage}
          alt={`${currentName} 구조도`}
          fill
          className={`object-contain p-4 transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          priority
        />
        
        {/* Tank 타입 정보 오버레이 */}
        {imageLoaded && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-1">
              {currentName}
            </h3>
            <p className="text-xs text-gray-600">
              {tankType}
            </p>
          </div>
        )}

        {/* 치수 정보 오버레이 */}
        {imageLoaded && dimensionInfo.length > 0 && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">
              {isKo ? '📏 치수 정보' : '📏 Dimension Info'}
            </h4>
            <div className="space-y-1">
              {dimensionInfo.map((dimension, index) => (
                <p key={index} className="text-xs text-gray-600 font-mono">
                  {dimension}
                </p>
              ))}
            </div>
          </div>
        )}


      </div>

      {/* 추가 정보 패널 (선택적) */}
      <div className="absolute top-1/2 left-2 transform -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="bg-gray-800/80 text-white p-2 rounded-lg text-xs max-w-48">
          <p className="font-semibold mb-1">{isKo ? 'Tank 타입 특징:' : 'Tank Type Features:'}</p>
          <p className="text-gray-300">
            {currentDesc}
          </p>
        </div>
      </div>
    </div>
  );
}