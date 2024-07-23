import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import type { IServer } from "../lib/models/Server.model";

type Props = {
  pathname: string;
  serversString: string;
};

const ServerSelect = (props: Props) => {
  const servers = JSON.parse(props.serversString) as IServer[];
  const [search, setSearch] = React.useState<string>("");
  const [server, setServer] = React.useState<IServer | null>();
  const [serverName, setServerName] = React.useState<string>("");

  React.useEffect(() => {
    const split = props.pathname.split("/");
    const indexOfDashboard = split.indexOf("dashboard");
    const serverId = split[indexOfDashboard + 2];
    const server = servers.find((s) => s._id.toString() === serverId);
    setServer(server);
    setServerName(server?.display_name || "Global");
  }, []);

  return (
    <Popover>
      <PopoverTrigger
        title={serverName}
        className="bg-grad-size truncate hover:bg-grad-pos-end flex flex-row gap-2 px-2 py-2 w-full rounded-lg items-center border-2 dark:border-neutral-600 bg-gradient-to-tr from-brand-200 to-secondary-400 transition-all text-white font-bold"
      >
        {serverName}
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-0">
        <div className="p-2 flex-col flex">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search servers..."
          />
        </div>
        <div className="p-2 flex-col flex">
          {servers
            .filter((s) =>
              search
                ? s.display_name.toLowerCase().includes(search.toLowerCase()) ||
                  s.name.toLowerCase().includes(search.toLowerCase())
                : s,
            )
            .map((server) => {
              return (
                <a
                  href={`/dashboard/servers/${server._id}`}
                  key={server._id.toString()}
                  className="p-2 dark:text-white/70 dark:bg-neutral-700/70 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all rounded-lg cursor-pointer"
                  onClick={() => {
                    setServer(server);
                    setServerName(server.display_name);
                  }}
                >
                  {server.display_name}
                </a>
              );
            })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ServerSelect;
