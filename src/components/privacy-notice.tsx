import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";

export default function PrivacyNotice() {
  let [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof localStorage !== "undefined") {
      const privacyNotice = localStorage.getItem("privacy-notice");
      if (privacyNotice) {
        return false;
      }
    }
    return true;
  });

  function close() {
    setIsOpen(false);
    localStorage.setItem("privacy-notice", "displayed");
  }

  return (
    <Dialog open={isOpen} onClose={() => { }}>
      <div
        className="z-50 fixed inset-0 bg-ctp-latte-crust/70 dark:bg-ctp-mocha-crust/70"
        aria-hidden
      >
        <div className="max-w-prose mx-auto flex items-end justify-start p-4 h-full">
          <DialogPanel className="w-full rounded-2xl bg-ctp-latte-base dark:bg-ctp-mocha-base p-6 ">
            <DialogTitle className="!pt-2 !pb-4">Privacy Notice</DialogTitle>
            <Description className="!pb-6">
              I hate cookies and tracking, so do you. This website does not use
              third party scripts, does not use cookies and logs just the bare
              minimum. Read more at the{" "}
              <a href="/privacy-policy" className="underline">
                privacy policy
              </a>
              .
            </Description>
            <button
              className="p-2 text-ctp-latte-crust dark:text-ctp-mocha-crust bg-ctp-latte-lavander dark:bg-ctp-mocha-lavander rounded-xl"
              onClick={close}
            >
              That seems resonable
            </button>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
