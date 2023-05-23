import { CalendarDays } from "lucide-react"
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	HoverPortal,
} from "@/components/ui/hover-card"
import { people } from "./data";

interface Props {
	children: React.ReactNode,
	name: string
}

export function Mention({ children, name }: Props) {
	const isString = Array.isArray(children) && children.length === 1 && typeof children[0] === 'string';
	// REMINDER: children has other children - return early
	if (!isString) {
		return children;
	}

	// REMINDER: name does not include prefix '@', children[0] does
	const user = people.find(({ username }) => username == children[0]);
	// REMINDER: only allowed users are rendered with HoverCard
	if (!user) {
		return children;
	}

	const fallback = name.substring(1, 3).toUpperCase()
	const twitterUrl = `https://twitter.com/${name}`

	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<a href={twitterUrl} target="_blank">{children}</a>
			</HoverCardTrigger>
			<HoverPortal>
				<HoverCardContent className="w-80">
					<div className="flex justify-between space-x-4">
						<Avatar>
							<AvatarImage src={user.profileImg} />
							<AvatarFallback>{fallback}</AvatarFallback>
						</Avatar>
						<div className="space-y-1">
							<h4 className="text-sm font-semibold">{user.username}</h4>
							<p className="text-sm">
								{user.description}
							</p>
							<div className="flex items-center pt-2">
								<CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
								<span className="text-xs text-muted-foreground">
									Joined {user.joined}
								</span>
							</div>
						</div>
					</div>
				</HoverCardContent>
			</HoverPortal>
		</HoverCard>
	)
}
