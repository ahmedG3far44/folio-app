import { useTheme } from "@/contexts/ThemeProvider";
import { SeparatorHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import Logo from "./Logo";

function Footer() {
  const { activeTheme } = useTheme();
  return (
    <div
      className="w-full flex items-center justify-center p-8 mt-auto"
      style={{
        backgroundColor: activeTheme.cardColor,
        color: activeTheme.primaryText,
      }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Logo />
            <p className="text-zinc-400 text-sm mb-6 mt-4">
              Showcase your creative work with a professional portfolio. Build,
              share, and grow your online presence with our easy-to-use
              platform.
            </p>
          </div>

          
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-zinc-400 hover:text-white text-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-white text-sm">
                  Templates
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-white text-sm">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-white text-sm">
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-zinc-400 hover:text-white text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-white text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-white text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-white text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Subscribe to our newsletter for tips, updates, and inspiration.
            </p>
            <div className="flex space-x-2">
              <Button className="bg-pink-500 hover:bg-pink-600 text-black">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <SeparatorHorizontal className="my-8 bg-zinc-800" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-zinc-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Folio. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-zinc-500 text-sm hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-zinc-500 text-sm hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="text-zinc-500 text-sm hover:text-white">
              Cookies Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
