
import { motion } from "framer-motion";
import IM from "../assets/IM.jpeg";
import Button from "./Button";
import Section from "./Section";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 20 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <Section
        className="pt-[12rem] -mt-[5.25rem]"
        crosses
        crossesOffset="lg:translate-y-[5.25rem]"
        customPadding
        id="hero"
      >
        <div className="container relative">
          <div className="relative mt-20 z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb:[7rem]">
            <h1 className="text-4xl font-bold">Empower Your School with QualityGap</h1>
            <p className="mt-4 text-lg">
              Simplify school operations, enhance communication, and ensure quality
              education for everyone.
            </p>
            <Button
              className="mt-6 px-6 py-3 text-lg font-medium text-white bg-amber-300 rounded-lg shadow-lg hover:bg-amber-200 transition"
            >
              <a href="/placeholder.html">Get Started</a>
            </Button>
          </div>
          <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-2">
            <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
               <div className="relative bg-amber-200 rounded-[1rem]">
                <div className="h-[1.5rem] bg-amber-100 rounded-t-2xl" />

                <div className="aspect-[33/40] rounded-b-[1rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                  <img src={IM} alt="IM" className="w-full scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[23%]"
                  width={1024}
                  height={490}
                    />
                </div>
               </div>
            </div>
          </div>
        </div>
      </Section>
    </motion.div>
  );
};
export default Home;
