import Image from "next/image";
import "./section.css"
import "./grid.css"
import { Profile } from "./profile";

const Logo = () => {
  return (
    <div className="relative flex items-center justify-center">
      <Image
        className="logo"
        src="/logo.png"
        alt="Logo"
        width={200}
        height={200}
        priority
      />
    </div>
  )
}

const MainText = () => {
  return (
    <p className="text-3xl p-16 absolute bottom-0 left-0 font-[family-name:var(--font-ibm-plex-serif)]">
      &ldquo;lets flexing to the chaos&rdquo;
    </p>
  );
}

const Savage = () => {
  return (
    <div className="flex flex-col items-center justify-center top-1/2 left-1/2">
      <aside className="text-xs">サヴェージ</aside>
      <h1 className="text-4xl font-[family-name:var(--font-ibm-plex-serif)]">SAVAGE</h1>
    </div>
  )
}

const Grid = () => {
  return (
    <div className="grid-container z-2">
      <div className="grid-line" />
      <div className="grid-line" />
      <div className="grid-line" />
      <div className="grid-line" />
    </div>
  )
}

const ScrollDown = () => {
  return (
    <p className="scroll-down text-xl font-[family-name:var(--font-ibm-plex-serif)]">
      Scroll Down
    </p>
  )
}


export default function Home() {
  return (
    <main>
      <section className="fixed w-screen h-screen flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)] bg-black p-20 fadeIn z-1">
        <Logo />
        <Savage />
        <div className="w-screen glow">
          <MainText />
        </div>
        <ScrollDown />
      </section>
      <section className="second-section bg-black">
        <div className="content flex flex-col items-center p-[2rem]">
          <h2 className="p-8 text-3xl pb-16 font-bold">About</h2>
          <div className="flex flex-row items-center justify-center flex-wrap gap-[2rem]">
            <p className="text-wrap">
              SAVAGE は、不思議で魅惑的な空気感を大切にする、<wbr />VR上のクラブイベントです。<br /><br />
              時折テーマを設け、<wbr />その世界観に深く浸るように構成されたDJセットが特徴です。<br /><br />
              現実とはひと味違う没入感あふれるバーチャルな夜をSAVAGEが創り出します。
            </p>
            <Image
              className="logo"
              src="/1.jpg"
              alt="Logo"
              width={250}
              height={250}
              priority
            />
          </div>
          <h2 className="p-8 text-3xl pb-16 font-bold">Members</h2>
          <div className="flex flex-wrap justify-center gap-[3rem]">
            <Profile name="bonsai" roles={["DJ"]} links={[["X (Twitter)", "https://x.com/iamtakerd"], ["youtube", "https://www.youtube.com/@bonsaiyowai"]]} />
            <Profile name="fuji_Glicine" roles={["DJ"]} links={[["X (Twitter)", "https://x.com/fuji_COREmania"]]} />
            <Profile name="piqLessss" roles={["DJ"]} links={[["X (Twitter)", "https://x.com/JinseihaLoFi"]]} />
            <Profile name="melocilde" roles={["DJ"]} links={[["X (Twitter)", "https://x.com/zyzyzy_vl"]]} />
            <Profile name="RoastPotato" roles={["DJ", "VJ"]} links={[["X (Twitter)", "https://x.com/p5f8f"]]} />
            <Profile name="sichemaniac" roles={["VJ"]} links={[["X (Twitter)", "https://x.com/__lim_1_na"]]} />
          </div>
        </div>
      </section>
      <Grid />
    </main>
  );
}
