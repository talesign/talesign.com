import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Menu as MenuIcon } from "lucide-react";
import ThemeToggle from "./theme-toggle";

const navItems = [
  { url: "/about", label: "About" },
  { url: "/projects", label: "Projects" },
  { url: "/blog", label: "Blog" },
  { url: "/resume", label: "Resume" },
  { url: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="grid grid-cols-2 py-4 items-center sticky top-0 z-50 bg-ctp-latte-base/30 dark:bg-ctp-mocha-base/30 backdrop-blur-md px-4">
      <a
        href="/"
        className="p-2 rounded-xl bg-ctp-latte-crust dark:bg-ctp-mocha-crust justify-self-start"
      >
        otaleghani
      </a>
      <nav className="justify-self-end flex items-center">
        <ThemeToggle />
        <Popover>
          <PopoverButton
            className="ml-2 p-2 rounded-xl bg-ctp-latte-crust dark:bg-ctp-mocha-crust"
            aria-label="Open menu"
          >
            <MenuIcon />
          </PopoverButton>
          <PopoverPanel
            transition
            anchor={{ gap: "16px" }}
            className="w-full z-50 transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
          >
            <div className="px-4 max-w-prose mx-auto ">
              <div className="rounded-xl bg-ctp-latte-mantle dark:bg-ctp-mocha-mantle divide-y divide-ctp-latte-lavander/30 dark:divide-ctp-mocha-lavander/30">
                {navItems.map((item) => (
                  <a key={item.url} className="block p-4" href={item.url}>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </PopoverPanel>
        </Popover>
      </nav>
    </header>
  );
}
