'use client';
import {usePathname} from 'next/navigation'; // 현재 경로 가져오기
import {cn} from '@/lib/utils';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from '@/components/custom-ui/sidebar/sidebar';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/custom-ui/accordion/accordion';
import Link from 'next/link';
import Image from 'next/image';
import {TMenuStructure} from '@/components/custom-ui/sidebar/sidebar-menus';
import * as React from 'react';
import {Star, StarOff} from 'lucide-react';

type Props = React.HTMLAttributes<HTMLElement> & {
	menus: TMenuStructure;
};

export const ApplicationSideBar = ({className, menus}: Readonly<Props>) => {
	const pathname = usePathname(); // 현재 경로 가져오기
	const {singleItems: individualMenus, groupItems: groupedMenus} = menus;

	// 즐겨찾기 상태 관리
	const [favoriteUrls, setFavoriteUrls] = React.useState<string[]>([]);

	React.useEffect(() => {
		const stored = localStorage.getItem('sidebar-favorites');
		if (stored) {
			setFavoriteUrls(JSON.parse(stored));
		}
	}, []);

	const toggleFavorite = (url: string) => {
		setFavoriteUrls(prev => {
			let next;
			if (prev.includes(url)) {
				next = prev.filter(u => u !== url);
			} else {
				next = [...prev, url];
			}
			localStorage.setItem('sidebar-favorites', JSON.stringify(next));
			return next;
		});
	};

	// 즐겨찾기 메뉴 추출
	const favoriteMenus = [
		...individualMenus.flat().filter(item => favoriteUrls.includes(item.url)),
		...groupedMenus.flatMap(group =>
			group.items.filter(item => favoriteUrls.includes(item.url)),
		),
	];

	const [openedGroups, setOpenedGroups] = React.useState<string[]>(
		groupedMenus.filter(group => group.opened).map(group => group.label),
	);

	return (
		<Sidebar className={cn('', className)}>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel asChild>
						<Link href="/" className="py-2 h-12 mb-3">
							<Image
								className="dark:invert object-contain object-center w-max h-full"
								src="/logo.svg"
								alt="logo"
								width={150}
								height={32}
							/>
						</Link>
					</SidebarGroupLabel>
					<SidebarGroupContent>
						{/* 즐겨찾기 메뉴 렌더링 */}
						{favoriteMenus.length > 0 && (
							<>
								<div className="px-3 py-1 text-xs font-semibold text-muted-foreground select-none">
									즐겨찾는 메뉴
								</div>
								<SidebarMenu className="mb-2 border-b pb-2">
									{favoriteMenus.map(item => (
										<SidebarMenuItem key={item.url}>
											<SidebarMenuButton
												asChild
												isActive={
													pathname === item.url ||
													pathname.startsWith(item.url + '/')
												}
												className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
											>
												<div className="flex items-center w-full">
													<Link
														href={item.url}
														className="flex-1 flex items-center gap-2"
													>
														{item.icon && <item.icon />}
														<span>{item.title}</span>
													</Link>
													<button
														type="button"
														className="ml-2 text-yellow-400 hover:text-yellow-500 cursor-pointer"
														onClick={e => {
															e.stopPropagation();
															e.preventDefault();
															toggleFavorite(item.url);
														}}
														aria-label="즐겨찾기 해제"
													>
														<Star className="w-4 h-4 fill-yellow-400" />
													</button>
												</div>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</>
						)}
						{/* 단일 메뉴 렌더링 */}
						{individualMenus.length > 0 && (
							<SidebarMenu>
								{individualMenus.map((menuGroup, idx) =>
									menuGroup.map(item => (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton
												asChild
												isActive={
													pathname === item.url ||
													pathname.startsWith(item.url + '/')
												}
												className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
											>
												<div className="flex items-center w-full">
													<Link
														href={item.url}
														className="flex-1 flex items-center gap-2"
													>
														{item.icon && <item.icon />}
														<span>{item.title}</span>
													</Link>
													<button
														type="button"
														className={
															(favoriteUrls.includes(item.url)
																? 'ml-2 text-yellow-400'
																: 'ml-2 text-muted-foreground hover:text-yellow-400') +
															' cursor-pointer'
														}
														onClick={e => {
															e.stopPropagation();
															e.preventDefault();
															toggleFavorite(item.url);
														}}
														aria-label={
															favoriteUrls.includes(item.url)
																? '즐겨찾기 해제'
																: '즐겨찾기 등록'
														}
													>
														{favoriteUrls.includes(item.url) ? (
															<Star className="w-4 h-4 fill-yellow-400" />
														) : (
															<StarOff className="w-4 h-4" />
														)}
													</button>
												</div>
											</SidebarMenuButton>
										</SidebarMenuItem>
									)),
								)}
							</SidebarMenu>
						)}
						{/* 그룹 메뉴(아코디언) 렌더링 */}
						{groupedMenus.length > 0 && (
							<div className="mt-4">
								<Accordion
									type="multiple"
									value={openedGroups}
									onValueChange={setOpenedGroups}
								>
									{groupedMenus.map(group => (
										<AccordionItem value={group.label} key={group.label}>
											<AccordionTrigger className="flex cursor-pointer items-center p-2 font-normal">
												<div className="flex items-center gap-2">
													{group.icon && <group.icon className="h-5 w-5" />}
													<span className="text-base">{group.label}</span>
												</div>
											</AccordionTrigger>
											<AccordionContent className="flex text-sm">
												<SidebarMenu>
													{group.items.map(item => (
														<SidebarMenuItem key={item.title}>
															<SidebarMenuButton
																asChild
																isActive={pathname === item.url}
																className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary pl-6"
															>
																<div className="flex items-center w-full">
																	<Link
																		href={item.url}
																		className="flex-1 flex items-center gap-2"
																	>
																		{item.icon && (
																			<item.icon className="h-4 w-4" />
																		)}
																		<span>{item.title}</span>
																	</Link>
																	<button
																		type="button"
																		className={
																			(favoriteUrls.includes(item.url)
																				? 'ml-2 text-yellow-400'
																				: 'ml-2 text-muted-foreground hover:text-yellow-400') +
																			' cursor-pointer'
																		}
																		onClick={e => {
																			e.stopPropagation();
																			e.preventDefault();
																			toggleFavorite(item.url);
																		}}
																		aria-label={
																			favoriteUrls.includes(item.url)
																				? '즐겨찾기 해제'
																				: '즐겨찾기 등록'
																		}
																	>
																		{favoriteUrls.includes(item.url) ? (
																			<Star className="w-4 h-4 fill-yellow-400" />
																		) : (
																			<StarOff className="w-4 h-4" />
																		)}
																	</button>
																</div>
															</SidebarMenuButton>
														</SidebarMenuItem>
													))}
												</SidebarMenu>
											</AccordionContent>
										</AccordionItem>
									))}
								</Accordion>
							</div>
						)}
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};
