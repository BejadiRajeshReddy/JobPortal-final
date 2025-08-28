// import * as React from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import { ArrowLeft, ArrowRight } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";

// const CarouselContext = React.createContext(null);

// function useCarousel() {
//   const context = React.useContext(CarouselContext);

//   if (!context) {
//     throw new Error("useCarousel must be used within a <Carousel />");
//   }

//   return context;
// }

// function Carousel({
//   orientation = "horizontal",
//   opts,
//   setApi,
//   plugins,
//   className,
//   children,
//   ...props
// }) {
//   const [carouselRef, api] = useEmblaCarousel(
//     {
//       ...opts,
//       axis: orientation === "horizontal" ? "x" : "y",
//     },
//     plugins
//   );
//   const [canScrollPrev, setCanScrollPrev] = React.useState(false);
//   const [canScrollNext, setCanScrollNext] = React.useState(false);

//   const onSelect = React.useCallback((api) => {
//     if (!api) return;
//     setCanScrollPrev(api.canScrollPrev());
//     setCanScrollNext(api.canScrollNext());
//   }, []);

//   const scrollPrev = React.useCallback(() => {
//     api?.scrollPrev();
//   }, [api]);

//   const scrollNext = React.useCallback(() => {
//     api?.scrollNext();
//   }, [api]);

//   const handleKeyDown = React.useCallback(
//     (event) => {
//       if (event.key === "ArrowLeft") {
//         event.preventDefault();
//         scrollPrev();
//       } else if (event.key === "ArrowRight") {
//         event.preventDefault();
//         scrollNext();
//       }
//     },
//     [scrollPrev, scrollNext]
//   );

//   React.useEffect(() => {
//     if (!api || !setApi) return;
//     setApi(api);
//   }, [api, setApi]);

//   React.useEffect(() => {
//     if (!api) return;
//     onSelect(api);
//     api.on("reInit", onSelect);
//     api.on("select", onSelect);

//     return () => {
//       api?.off("select", onSelect);
//     };
//   }, [api, onSelect]);

//   return (
//     <CarouselContext.Provider
//       value={{
//         carouselRef,
//         api: api,
//         opts,
//         orientation:
//           orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
//         scrollPrev,
//         scrollNext,
//         canScrollPrev,
//         canScrollNext,
//       }}
//     >
//       <div
//         onKeyDownCapture={handleKeyDown}
//         className={cn("relative", className)}
//         role="region"
//         aria-roledescription="carousel"
//         data-slot="carousel"
//         {...props}
//       >
//         {children}
//       </div>
//     </CarouselContext.Provider>
//   );
// }

// function CarouselContent({ className, ...props }) {
//   const { carouselRef, orientation } = useCarousel();

//   return (
//     <div
//       ref={carouselRef}
//       className="overflow-hidden"
//       data-slot="carousel-content"
//     >
//       <div
//         className={cn(
//           "flex",
//           orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
//           className
//         )}
//         {...props}
//       />
//     </div>
//   );
// }

// function CarouselItem({ className, ...props }) {
//   const { orientation } = useCarousel();

//   return (
//     <div
//       role="group"
//       aria-roledescription="slide"
//       data-slot="carousel-item"
//       className={cn(
//         "min-w-0 shrink-0 grow-0 basis-full",
//         orientation === "horizontal" ? "pl-15" : "pt-4",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// function CarouselPrevious({
//   className,
//   variant = "outline",
//   size = "icon",
//   ...props
// }) {
//   const { orientation, scrollPrev, canScrollPrev } = useCarousel();

//   return (
//     <Button
//       data-slot="carousel-previous"
//       variant={variant}
//       size={size}
//       className={cn(
//         "absolute size-8 rounded-full",
//         orientation === "horizontal"
//           ? "top-1/2 -left-12 -translate-y-1/2"
//           : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
//         className
//       )}
//       disabled={!canScrollPrev}
//       onClick={scrollPrev}
//       {...props}
//     >
//       <ArrowLeft />
//       <span className="sr-only">Previous slide</span>
//     </Button>
//   );
// }

// function CarouselNext({
//   className,
//   variant = "outline",
//   size = "icon",
//   ...props
// }) {
//   const { orientation, scrollNext, canScrollNext } = useCarousel();

//   return (
//     <Button
//       data-slot="carousel-next"
//       variant={variant}
//       size={size}
//       className={cn(
//         "absolute size-8 rounded-full",
//         orientation === "horizontal"
//           ? "top-1/2 -right-12 -translate-y-1/2"
//           : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
//         className
//       )}
//       disabled={!canScrollNext}
//       onClick={scrollNext}
//       {...props}
//     >
//       <ArrowRight />
//       <span className="sr-only">Next slide</span>
//     </Button>
//   );
// }

// export {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselPrevious,
//   CarouselNext,
// };

"use client";

import { cn } from "@/lib/utils";
import { useMotionValue, animate, motion } from "framer-motion";
import { useState, useEffect } from "react";
import useMeasure from "react-use-measure";

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 55,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let controls;
    const size = direction === "horizontal" ? width : height;
    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration:
          currentDuration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prevKey) => prevKey + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: "linear",
        duration: currentDuration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    return controls?.stop;
  }, [
    key,
    translation,
    currentDuration,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
  ]);

  const hoverProps = durationOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentDuration(durationOnHover);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setCurrentDuration(duration);
        },
      }
    : {};

  return (
    <div className={cn("overflow-hidden", className)} data-oid="jp69t2n">
      <motion.div
        className="flex w-max"
        style={{
          ...(direction === "horizontal"
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        ref={ref}
        {...hoverProps}
        data-oid="cciesrc"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
