// "use client";
// import { logout as supabaseLogout } from "@/app/(auth)/actions";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useUserContext } from "@/context/user-context";
// // import { useAuth } from "../../context/auth-provider";
// import { useRouter } from "next/navigation";

// export function UserNav() {
//   // const { logout, user } = useAuth();

//   const router = useRouter();

//   const logoutUser = async () => {
//     const { error } = await supabaseLogout();
//     if (!error) {
//       // Optionally, redirect to the login page or home page
//       router.push("/login"); // Use Next.js router to handle redirects
//     } else {
//       console.error("Logout failed:", error);
//     }
//   };

//   const { user } = useUserContext();
//   console.log("usernav", user);

//   if (user?.email) {
//     return (
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//             <Avatar className="h-8 w-8 bg-accent">
//               <AvatarImage
//                 src={user?.imageUrl || "./user.png"}
//                 alt={user?.firstName ?? ""}
//               />
//               <AvatarFallback>{user.firstName}</AvatarFallback>
//             </Avatar>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="w-56" align="end" forceMount>
//           <DropdownMenuLabel className="font-normal">
//             <div className="flex flex-col space-y-1">
//               <p className="text-sm font-medium leading-none">
//                 {`${user.firstName ?? ""} ${user.lastName ?? ""}`}
//               </p>

//               <p className="text-xs leading-none text-muted-foreground">
//                 {user?.primaryEmailAddress?.emailAddress}
//               </p>
//             </div>
//           </DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuGroup>
//             <DropdownMenuItem>
//               Profile
//               <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
//             </DropdownMenuItem>
//             <DropdownMenuItem>
//               Billing
//               <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
//             </DropdownMenuItem>
//             <DropdownMenuItem>
//               Settings
//               <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
//             </DropdownMenuItem>
//             <DropdownMenuItem>New Team</DropdownMenuItem>
//           </DropdownMenuGroup>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem onClick={logoutUser}>
//             Log out
//             <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     );
//   }
// }

"use client";
import { logout as supabaseLogout } from "@/app/(auth)/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserContext } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { useAuth } from "@/context/auth-provider";
import { useState, useEffect } from "react";
import Link from "next/link";

export function UserNav() {
  const router = useRouter();
  const { user, setUser } = useUserContext();
  const { logout } = useAuth();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const logoutUser = async () => {
    try {
      await supabaseLogout();
      deleteCookie("user");
      setUser({
        id: "",
        username: "",
        firstName: "",
        email: "",
      });
      logout(); // Ensure logout state is cleared before redirect
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (user?.email) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isClient && (
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 bg-accent">
                <AvatarImage src={"./user.png"} alt={user?.firstName ?? ""} />
                <AvatarFallback>{user.firstName?.[0]}</AvatarFallback>
              </Avatar>
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {`${user.firstName ?? ""}`}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href="/dashboard/settings/account-info">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard/settings/account-info">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard/settings/mailbox">Settings</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logoutUser}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return null;
}
