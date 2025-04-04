import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login'); // Redirige automáticamente a la página de Login
}
