import React from "react";
import { Input } from "../ui/input";
import { Fetch } from "../../lib/utils";
import { canCreateServer } from "../../Stores/Servers.Create";

type Props = {
  userId: string;
};

const CreateForm = (props: Props) => {
  const [apiKey, setApiKey] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [port, setPort] = React.useState<string>("");
  const [pluginPort, setPluginPort] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const [testsPassed, setTestsPassed] = React.useState<boolean>(false);
  const [canCreate, setCanCreate] = React.useState<boolean>(false);

  const [serverData, setServerData] = React.useState<{
    server: {
      name: string;
    };
  } | null>(null);

  const test = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await Fetch<any>({
        url: `http://${address}:${pluginPort}/minti`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (res.error || !res.data || !res.data.success) {
        throw new Error("Failed to connect to the server");
      }

      setTestsPassed(true);
      setCanCreate(true);
      canCreateServer.set(true);
      setLoading(false);
      setServerData(res.data);
    } catch (e: any) {
      setTestsPassed(false);
      setLoading(false);
      canCreateServer.set(false);
      setError(e.message);
    }
  };

  const create = async () => {
    setLoading(true);

    await Fetch<{
      success: boolean;
      data: any;
    }>({
      url: "/api/servers/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        display_name: name,
        name: serverData?.server.name,
        address,
        port,
        plugin_port: pluginPort,
        api_key: apiKey,
        user: props.userId,
      },
    }).then((d) => {
      if (d.data && d.data.success) {
        window.location.href = `/dashboard/server/${d.data.data._id}`;
      } else {
        setError(d.error?.message || "Failed to create server");
        setLoading(false);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 relative">
      {error && (
        <div className="absolute top-0 right-0 text-red-400">{error}</div>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="dark:text-white/70 text-sm">
          Server name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="My server"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setCanCreate(false);
          }}
        />
      </div>
      <div className="flex flex-row gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="dark:text-white/70 text-sm">
            Server address
          </label>
          <Input
            id="address"
            type="text"
            placeholder="play.example.com"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setCanCreate(false);
              setTestsPassed(false);
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="port" className="dark:text-white/70 text-sm">
            Server port
          </label>
          <Input
            id="port"
            type="text"
            placeholder="25565"
            value={port}
            onChange={(e) => {
              setPort(e.target.value);
              setCanCreate(false);
              setTestsPassed(false);
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="pluginPort" className="dark:text-white/70 text-sm">
            Minti plugin port
          </label>
          <Input
            id="pluginPort"
            placeholder="8000"
            type="text"
            value={pluginPort}
            onChange={(e) => {
              setPluginPort(e.target.value);
              setCanCreate(false);
              setTestsPassed(false);
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="apiKey" className="dark:text-white/70 text-sm">
          Minti API Key (found in the Minti plugin config)
        </label>
        <Input
          id="apiKey"
          type="text"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            setCanCreate(false);
            setTestsPassed(false);
          }}
        />
      </div>

      <div className="flex flex-row gap-2">
        <button
          onClick={canCreate ? void 0 : test}
          style={{
            opacity: canCreate ? 0.5 : 1,
            cursor: canCreate ? "not-allowed" : "pointer",
            background: testsPassed ? "#10B981" : "rgb(248 113 113)",
          }}
          className="bg-red-400 font-bold text-white py-2 px-4 rounded-md"
        >
          Test connection
        </button>
        <button
          onClick={canCreate && testsPassed && !loading ? create : void 0}
          style={{
            opacity: canCreate && testsPassed && !loading ? 1 : 0.5,
            cursor:
              canCreate && testsPassed && !loading ? "pointer" : "not-allowed",
          }}
          className="button-gradient font-bold text-white py-2 px-4 rounded-md"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateForm;
