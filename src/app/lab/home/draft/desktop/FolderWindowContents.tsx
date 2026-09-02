"use client";

import Image from "next/image";
import Link from "next/link";

import type { FolderItem } from "./desktopFolders";

type FolderWindowContentsProps = {
  label: string;
  description?: string;
  items: FolderItem[];
};

export function FolderWindowContents({ label, description, items }: FolderWindowContentsProps) {
  return (
    <div className="folder-window">
      <header className="folder-window__toolbar">
        <p className="folder-window__path">{label}</p>
        <span className="folder-window__count">{items.length} items</span>
      </header>
      {description ? (
        <p className="folder-window__description">{description}</p>
      ) : null}
      <ul className="folder-window__grid">
        {items.map((item) => (
          <li key={item.slug}>
            {item.external ? (
              <a
                href={item.href}
                className="folder-window__item"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FolderItemThumb item={item} />
              </a>
            ) : (
              <Link href={item.href} className="folder-window__item">
                <FolderItemThumb item={item} />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FolderItemThumb({ item }: { item: FolderItem }) {
  return (
    <>
      <span className="folder-window__thumb-wrap">
        {item.thumb ? (
          <Image
            src={item.thumb}
            alt=""
            width={88}
            height={88}
            className="folder-window__thumb"
            unoptimized
          />
        ) : (
          <span className="folder-window__thumb-placeholder" aria-hidden />
        )}
      </span>
      <span className="folder-window__item-label">{item.title}</span>
    </>
  );
}
