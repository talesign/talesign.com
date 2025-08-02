import PrivacyNotice from "./privacy-notice";

export default function Footer() {
  return (
    <footer className="p-6">
      <hr />
      <div className="flex gap-4">
        <a href="/">Home</a>
        <a href="/projects">Projects</a>
        <a href="/about">About</a>
        <a href="/resume">Resume</a>
        <a href="/contact">Contact</a>
        <a href="/" target="_blank">
          Github
        </a>
        <a href="/" target="_blank">
          Linkedin
        </a>
        <a href="/privacy-policy">Privacy Policy</a>
      </div>
      <PrivacyNotice />
    </footer>
  );
}
