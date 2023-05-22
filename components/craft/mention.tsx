import { CalendarDays } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  HoverPortal,
} from "@/components/ui/hover-card"

const people = [{
    username: "@shadcn",
    profileImg: "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
    description: "Design · Code · Open Source · I tweet about building products with Next.js",
    joined: "April 2009"
  }, {
    username: "@mxkaske",
    profileImg: "https://pbs.twimg.com/profile_images/1559935773151051778/0O_Bf4LY_400x400.jpg",
    description: "Developer · Climber · Just call me Max",
    joined: "January 2017"
  }]

  const defaultUser = {
    username: "@vercel",
    profileImg: "https://github.com/vercel.png",
    description: "The React Framework – created and maintained by @vercel.",
    joined: "December 2021"
  }

export function Mention({ children }: {children: React.ReactNode }) {
    // @ts-expect-error
    const user = people.find(({username}) => username == children[0]) || defaultUser;
    const fallback = user.username.substring(1, 3).toUpperCase()
    const twitterUrl = `https://twitter.com/${user.username.substring(1)}`
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
