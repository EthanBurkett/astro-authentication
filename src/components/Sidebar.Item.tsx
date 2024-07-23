import React, { type ReactNode } from "react";
import type { Link } from "./Sidebar.astro";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

type Props = {
  itemString: string;
  serverId?: string;
};

type Element = {
  key: any;
  ref: any;
  props: {
    attr: {
      viewBox: string;
      xmlns: string;
      fill: string;
      width: string;
      height: string;
    };
    children: [
      {
        type: string;
        key: string;
        ref: string;
        props: {
          d: string;
          children: any[];
        };
        _owner: any;
        _store: any;
      },
    ];
  };
  _owner: any;
  _store: any;
};

export const ConvertIcon = (elementString: string): ReactNode => {
  const element: Element = JSON.parse(elementString);

  return React.createElement("svg", {
    ...element.props.attr,
    className: "h-4 w-4",
    id: "icon",
    children: [
      element.props.children.map((child) => {
        return React.createElement(child.type, {
          className: "fill-current",
          ...child.props,
        });
      }),
    ],
  });
};

const Item = (props: Props) => {
  const item: Link = JSON.parse(props.itemString);
  const children = item.children;
  if (!children) return;
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={item.name}>
        <AccordionTrigger className="py-2 ">
          {/* Converts element from Astro to React element */}
          <div className="flex flex-row gap-2 items-center">
            {ConvertIcon(item.iconString)}
            {item.name}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {children.map((child: Link) => {
            return (
              <a
                href={
                  child.excludeId || item.excludeId
                    ? `/dashboard${child.to}`
                    : `/dashboard/servers/${props.serverId}${child.to}`
                }
                className="flex flex-row gap-2 items-center text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white transition-all cursor-pointer p-1"
              >
                {ConvertIcon(child.iconString)}
                {child.name}
              </a>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Item;
