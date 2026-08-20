export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#07090e] transition-colors duration-300">
      {children}
    </div>
  );
}
