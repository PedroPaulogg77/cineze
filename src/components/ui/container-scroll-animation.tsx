"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.8, 1] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[55rem] md:h-[70rem] flex flex-col items-center justify-start relative pt-8 md:pt-20 px-6 md:px-4"
      ref={containerRef}
    >
      <div
        className="w-full relative flex flex-col items-center"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="w-full max-w-5xl text-center flex flex-col items-center z-20"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 50px rgba(6,183,216,0.1), 0 20px 40px rgba(0,0,0,0.5)",
      }}
      className="max-w-[17rem] md:max-w-5xl -mt-10 md:-mt-12 mx-auto h-[35rem] md:h-[40rem] w-full border-[6px] md:border-[8px] border-[#334155]/30 md:border-[#0A1A2F] p-1 md:p-3 bg-[#050D18] rounded-[2.5rem] md:rounded-[2.5rem] relative overflow-hidden z-20 shadow-2xl"
    >
      {/* Decorative iPhone Notch (Mobile Only) */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#334155]/30 rounded-full z-30 pointer-events-none md:hidden" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 to-transparent pointer-events-none z-10" />
      <div className="h-full w-full overflow-hidden rounded-[2rem] md:rounded-[2.2rem] border border-white/5 relative z-0 flex items-center justify-center bg-[#07111F]">
        {children}
      </div>
    </motion.div>
  );
};
