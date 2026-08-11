import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function UserLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
