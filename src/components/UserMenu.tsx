import { FaCog } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Props = {};

const UserMenu = (props: Props) => {
  return (
    <Dialog>
      <DialogTrigger className="text-neutral-500 hover:text-black dark:text-neutral-300 dark:hover:text-white [&>svg]:transition-[transform] [&>svg]:duration-500 [&>svg]:hover:rotate-[130deg] flex items-center justify-center flex-row gap-2 rounded-xl bg-neutral-100 transition-all hover:bg-neutral-200 px-4 py-1 dark:bg-neutral-700 dark:hover:bg-neutral-600 font-semibold">
        <FaCog size={16} />
        Settings
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserMenu;
