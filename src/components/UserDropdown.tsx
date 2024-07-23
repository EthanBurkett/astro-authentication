import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import React from "react";
import type { IDiscordUser } from "../lib/models/DiscordUser.model";
import type { IUser } from "../lib/models/User.model";
import { User } from "react-feather";
import Discord from "../lib/Discord";
import { FaCog, FaDiscord, FaSignOutAlt } from "react-icons/fa";
import UserMenu from "./UserMenu";

type Props = {
  discordUserString: string;
  userString: string;
};

const UserDropdown = (props: Props) => {
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>();

  const discordUser: IDiscordUser = JSON.parse(props.discordUserString);
  const user: IUser = JSON.parse(props.userString);

  React.useEffect(() => {
    const fetchAvatarUrl = async () => {
      const url = await Discord.GetAvatarUrl(
        discordUser._id,
        discordUser.avatar,
      );
      setAvatarUrl(url);
    };

    fetchAvatarUrl();
  }, [discordUser]);

  console.log({ avatarUrl, imageUrl: user.imageUri });

  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-200 to-blue-400 flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserImage discordAvatarUrl={avatarUrl} imageUri={user.imageUri} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2 !rounded-xl m-4">
          <div className="flex flex-row gap-1 p-2 justify-center">
            <UserImage
              discordAvatarUrl={avatarUrl}
              size={10}
              imageUri={user.imageUri}
            />
            <div className="flex flex-col gap-4 py-0 px-2 justify-center">
              <div className="flex flex-col gap-0">
                {user.username || discordUser?.username ? (
                  <>
                    <div className="text-black dark:text-white font-bold text-lg flex flex-row items-center gap-2 ">
                      {user.username || discordUser.username}
                      {discordUser && <FaDiscord className="text-[#5865F2]" />}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      {user.email || discordUser.email}
                    </div>
                  </>
                ) : (
                  <div className="text-black dark:text-white font-bold text-lg">
                    {user.email}
                  </div>
                )}
              </div>
              <div className="flex flex-row gap-2">
                <UserMenu />
                <button
                  onClick={() => (location.href = "/logout")}
                  className="text-neutral-500 hover:text-black dark:text-neutral-300 dark:hover:text-white [&>svg]:transition-[transform] [&>svg]:duration-300 [&>svg]:hover:scale-[1.1] [&>svg]:hover:rotate-[-15deg] flex items-center justify-center flex-row gap-2 rounded-xl bg-neutral-100 transition-all hover:bg-neutral-200 px-4 py-1 dark:bg-neutral-700 dark:hover:bg-neutral-600 font-semibold"
                >
                  <FaSignOutAlt size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// <UserImage discordAvatarUrl={avatarUrl} imageUri={user.imageUri || ""} />

const UserImage = ({
  imageUri,
  size,
  discordAvatarUrl,
}: {
  imageUri?: string;
  discordAvatarUrl?: string;
  size?: number;
}) => (
  <>
    {imageUri && <img src={imageUri} className="w-12 h-12 rounded-full" />}
    {!imageUri && discordAvatarUrl && (
      <img
        src={discordAvatarUrl}
        className="w-12 h-12 rounded-full"
        style={{
          width: size ? `${size / 4}rem` : "48px",
          height: size ? `${size / 4}rem` : "48px",
        }}
      />
    )}
    {!imageUri && !discordAvatarUrl && (
      <User className="text-white" size={32} />
    )}
  </>
);

export default UserDropdown;
