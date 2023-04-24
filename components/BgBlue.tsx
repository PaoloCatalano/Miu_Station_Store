export default function BgStatic() {
  return (
    <>
      {/* <div className="fading-bg fixed inset-0 h-screen-dynamic -z-40 "></div> */}
      <div className="fixed inset-0 h-screen-dynamic bg-fixed -z-50  bg-[url('/images/bg/bgsm.jpeg')] md:bg-[url('/images/bg/bgm.jpeg')] lg:bg-[url('/images/bg/bglg.jpeg')] bg-cover animate-fade-in"></div>
    </>
  );
}
