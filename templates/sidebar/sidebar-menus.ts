'use client';
import {
	ClipboardList,
	FileText,
	MessageCircle,
	MessageSquare,
	Presentation,
	Settings,
	ShoppingCart,
	SquareArrowOutUpRight,
	User,
	UserPlus,
	Users,
	type LucideIcon,
} from 'lucide-react';

// 단일 메뉴 타입
type TMenuItem = {
	title: string;
	url: string;
	icon?: LucideIcon; // 아이콘이 있을 수도 있고 없을 수도 있음
	role: string[];
};

export type TMenuGroup = {
	label: string;
	icon?: LucideIcon; // 그룹 아이콘도 선택적으로 변경
	items: TMenuItem[];
	opened?: boolean; // 처음부터 열려 있을지 여부
};
// 최상위 메뉴 타입
export type TMenuStructure = {
	singleItems: TMenuItem[][];
	groupItems: TMenuGroup[];
};

// 메뉴 데이터 구조
export const MenuStructure: TMenuStructure = {
	singleItems: [
		[
			{
				title: '회원관리',
				url: '/admin/members',
				icon: User,
				role: ['ADMIN'],
			},
			{
				title: '조직관리',
				url: '/admin/organization',
				icon: Users,
				role: ['ADMIN'],
			},

			{
				title: '게시판관리',
				url: '/admin/boards',
				icon: ClipboardList,
				role: ['ADMIN'],
			},
			{
				title: '게시물관리',
				url: '/admin/posts',
				icon: FileText,
				role: ['ADMIN'],
			},
			{
				title: '문의형게시판관리',
				url: '/admin/inquiry-meta',
				icon: MessageSquare,
				role: ['ADMIN'],
			},
			{
				title: '1:1문의관리',
				url: '/admin/inquiry',
				icon: MessageCircle,
				role: ['ADMIN'],
			},
			{
				title: '배너관리',
				url: '/admin/banners',
				icon: Presentation,
				role: ['ADMIN'],
			},
			{
				title: '팝업관리',
				url: '/admin/popups',
				icon: SquareArrowOutUpRight,
				role: ['ADMIN'],
			},
			{
				title: '판매자신청관리',
				url: '/admin/seller-applications',
				icon: UserPlus,
				role: ['ADMIN'],
			},
			{
				title: '사이트설정',
				url: '/admin/settings',
				icon: Settings,
				role: ['ADMIN'],
			},
		],
	],
	groupItems: [
		{
			label: '상품관리',
			icon: ShoppingCart,
			items: [
				{
					title: '상품등록',
					url: '/admin/products/add',
					role: ['ADMIN', 'SELLER'],
				},
				{
					title: '상품목록',
					url: '/admin/products',
					role: ['ADMIN', 'SELLER'],
				},
			],
			opened: true, // 예시로 true로 설정
		},
	],
};
