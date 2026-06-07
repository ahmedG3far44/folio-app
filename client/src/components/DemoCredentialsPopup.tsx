import { useState, useEffect } from "react";
import { Copy, Check, X, User, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const DEMO_CREDENTIALS = [
  {
    role: "User",
    icon: <User size={18} />,
    email: "user@demo.com",
    password: "Demo@123456",
    description: "Full portfolio management access",
  },
  {
    role: "Admin",
    icon: <Shield size={18} />,
    email: "admin@demo.com",
    password: "Demo@123456",
    description: "Dashboard & user management access",
  },
];

function DemoCredentialsPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("demo-credentials-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("demo-credentials-dismissed", "true");
    setIsOpen(false);
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="relative p-6 pb-4 border-b border-zinc-700">
              <button
                onClick={handleDismiss}
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Demo Credentials
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Use these accounts to explore the app
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {DEMO_CREDENTIALS.map((cred, index) => (
                <div
                  key={cred.role}
                  className="rounded-xl border border-zinc-700 bg-zinc-800/50 overflow-hidden"
                >
                  <div className="flex items-center gap-2 p-3 bg-zinc-800 border-b border-zinc-700">
                    <span className="text-purple-400">{cred.icon}</span>
                    <span className="text-sm font-semibold text-zinc-200">
                      {cred.role}
                    </span>
                    <span className="text-xs text-zinc-500 ml-auto">
                      {cred.description}
                    </span>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-zinc-500 shrink-0 w-16">
                          Email:
                        </span>
                        <code className="text-sm text-zinc-300 truncate font-mono">
                          {cred.email}
                        </code>
                      </div>
                      <button
                        onClick={() => handleCopy(cred.email, index * 2)}
                        className="p-1.5 rounded-lg hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-purple-400 shrink-0 ml-2"
                        aria-label={`Copy ${cred.role} email`}
                      >
                        {copiedIndex === index * 2 ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-zinc-500 shrink-0 w-16">
                          Password:
                        </span>
                        <code className="text-sm text-zinc-300 truncate font-mono">
                          {cred.password}
                        </code>
                      </div>
                      <button
                        onClick={() => handleCopy(cred.password, index * 2 + 1)}
                        className="p-1.5 rounded-lg hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-purple-400 shrink-0 ml-2"
                        aria-label={`Copy ${cred.role} password`}
                      >
                        {copiedIndex === index * 2 + 1 ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={handleDismiss}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors text-sm"
              >
                Got it, start exploring
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DemoCredentialsPopup;
