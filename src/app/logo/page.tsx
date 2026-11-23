import { Logo } from '../_components/Logo'

// Same WebGL logo as the top page hero, on its own
export default function LogoPage() {
  return (
    <main id="main-content" tabIndex={-1} className="w-full h-full focus:outline-none">
      <section className="fixed w-full h-dvh flex flex-col items-center justify-center bg-black p-20 fadeIn z-1">
        <Logo />
      </section>
    </main>
  )
}
