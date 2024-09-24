import React from "react";
import styled from "styled-components";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

import { FreeMode, Navigation, Mousewheel } from "swiper/modules";
import { NavLink, useSearchParams } from "react-router-dom";

interface NavSliderData {
  path: string;
  name: string;
  content: React.ReactNode;
}

export const navSliderData = Array.from({ length: 2 }, (_, i) => ({
  path: "#",
  name: `Q${i + 1}`,
  content: <p>{`Q${i + 1}`} query Detail</p>,
}));

const QueryNavSlider: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reportNumber = searchParams.get("query");
  console.log(reportNumber);
  return (
    <Wrapper className="bg-zinc-200 text-slate-600">
      <Swiper mousewheel={true} slidesPerView={"auto"} spaceBetween={1} loop={false} navigation={true} freeMode={true} modules={[FreeMode, Navigation, Mousewheel]} className="mySwiper">
        {navSliderData.map((link: NavSliderData, i: number) => (
          <SwiperSlide key={i}>
            <NavLink to={`?query=${link.name}`} className={`${reportNumber === link.name ? "bg-cyan-700 text-white" : ""}`}>
              {link.name}
              {reportNumber === link.name ? <span className="flex items-center justify-center h-full font-[400] ">{link.name==="Q1"&&"SKU Statement"}</span> : null}
            </NavLink>
          </SwiperSlide>
        ))}
      </Swiper>
    </Wrapper>
  );
};

// Styling with styled-components
const Wrapper = styled.div`
  width: 100%;
  height: 35px;
  display: flex;
 
  .swiper {
    z-index: 3;
    display: flex;
    width: 100%;
  }

  .swiper-button-next {
    background-color: #adacac;
    right: 0;
    padding: 5px 10px;
    color: white;
  }
  .swiper-button-next::after,
  .swiper-button-prev::after {
    font-size: 20px;
    font-weight: bold;
  }
  .swiper-button-disabled {
    display: none;
  }
  .swiper-button-prev {
    background-color: #adacac;
    left: 0;
    padding: 5px 10px;
    color: white;
  }
  .swiper-slide {
    width: max-content;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;

    a {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 15px;
      font-weight: 600;
      font-size: 13px;
      display: flex;
      justify-items: center;
      gap: 5px;
    }
  }

  span {
    padding: 0px 10px;
    width: 100%;
  }
`;

export default QueryNavSlider;
