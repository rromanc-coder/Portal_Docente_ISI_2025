import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      <Navbar />
      <main className="pt-20 px-4">{children}</main>
      <footer className="mt-16 py-6 text-center border-t border-gray-800 text-sm text-gray-400">
        © {new Date().getFullYear()} Centro Universitario UAEM Nezahualcóyotl – Ingeniería en Sistemas Inteligentes
      </footer>
    </div>
  );
}
