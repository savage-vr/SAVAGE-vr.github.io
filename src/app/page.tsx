import React from "react";
import Image from "next/image";
import { Grid } from "./_components/Grid"
import { Profile } from "./_components/Profile";
import { ScrollDown } from "./_components/ScrollDown";
import { members } from "./_data/members.schema";
import Slideshow from "./_components/Slideshow";

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
    <div className="w-screen glow">
      <p className="text-3xl p-16 absolute bottom-0 left-0 font-[family-name:var(--font-ibm-plex-serif)]">
        &ldquo;lets flexing to the chaos&rdquo;
      </p>
    </div >
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

const About = () => {
  return (
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
  )
}

const SectionHeader: React.FC<{ children: string }> = ({ children }) => {
  return (
    <h2 className="p-16 text-3xl font-bold">{children}</h2>
  )
}

export default function Home() {
  return (
    <main>
      <section className="fixed w-screen h-screen flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)] bg-black p-20 fadeIn z-1">
        <Logo />
        <Savage />
        <MainText />
        <ScrollDown />
      </section>
      <section className="second-section bg-black">
        <div className="content flex flex-col items-center p-[2rem]">
          <SectionHeader>About</SectionHeader>
          <About />
          <div className="flex flex-row flex-wrap gap-4 p-[1rem]">
            <a className="flex flex-row gap-4 p-[1rem]" href="https://vrchat.com/home/group/grp_0fa30f81-0523-4034-90ab-c3ca819b9fea" target="_blank" referrerPolicy="no-referrer">
              <Image
                width={82}
                height={42}
                src="/logo/vrc-logo.png"
                alt="Logo"
                priority
              />
              <span className="text-base/8">
                VRChar Group
              </span>
            </a>
            <a className="flex flex-row gap-4 p-[1rem]" href="https://x.com/vrcsavageinfo" target="_blank" referrerPolicy="no-referrer">
              <Image
                width={40}
                height={40}
                src="/logo/X_logo.svg"
                alt="Logo"
                priority
              />
              <span className="text-base/8">
                Ofiicial SNS
              </span>
            </a>
          </div>
          <SectionHeader>Members</SectionHeader>
          <div className="flex flex-wrap justify-center gap-[3rem]">
            {members.members.map(member => (
              <Profile key={member.name} imgSrc={member.imgSrc} name={member.name} roles={member.roles} links={member.links} />
            ))}
          </div>
          <SectionHeader>Gallery</SectionHeader>
          <Slideshow />
        </div>
        <div className="flex flex-col items-center p-[2rem] bg-black">
          © SAVAGE-vr
        </div>
      </section>
      <Grid />
    </main>
  );
}
