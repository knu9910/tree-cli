import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

/**
 * Tailwind CSS 클래스를 조건부로 결합하고 충돌을 해결하는 유틸리티 함수
 *
 * 이 함수는 shadcn/ui에서 사용하는 표준 유틸리티로,
 * clsx와 tailwind-merge를 결합하여 다음 기능을 제공합니다:
 *
 * 1. 조건부 클래스 적용 (clsx)
 * 2. Tailwind CSS 클래스 충돌 해결 (tailwind-merge)
 *
 * 사용 예시:
 * cn("px-2 py-1", condition && "bg-blue-500", "px-4")
 * → "py-1 bg-blue-500 px-4" (px-2와 px-4 충돌 시 나중 것 적용)
 *
 * @param inputs - 결합할 클래스들 (문자열, 조건부 표현식, 배열 등)
 * @returns 충돌이 해결된 최종 클래스 문자열
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
