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

export const navSliderData: NavSliderData[] = [
  { path: "#", name: "R1", content: <p>Material Inward Report</p> },
  { path: "#", name: "R2", content: <p>TRC Report</p> },
  { path: "#", name: "R3", content: <p>Battery QC Report</p> },
  { path: "#", name: "R4", content: <p>Production Report</p> },
];

const Navslider: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reportNumber = searchParams.get("reportno");

  const getReportLabel = (reportName: string) => {
    switch (reportName) {
      case "R1":
        return "Material Inward Report";
      case "R2":
        return "TRC Report";
      case "R3":
        return "Battery QC Report";
        case "R4":
        return "Production Report";

      default:
        return "";
    }
  };

  return (
    <Wrapper className="bg-zinc-200 text-slate-600">
      <Swiper
        mousewheel={true}
        slidesPerView={"auto"}
        spaceBetween={1}
        loop={false}
        navigation={true}
        freeMode={true}
        modules={[FreeMode, Navigation, Mousewheel]}
        className="mySwiper"
      >
        {navSliderData.map((link, i) => (
          <SwiperSlide key={i}>
            <NavLink
              to={`?reportno=${link.name}`}
              className={reportNumber === link.name ? "bg-cyan-700 text-white" : ""}
            >
              {link.name}
              {reportNumber === link.name && (
                <span className="flex items-center justify-center h-full font-[400]">
                  {getReportLabel(link.name)}
                </span>
              )}
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
  justify-content: start;
  
  .swiper {
    z-index: 3;
    display: flex;
    justify-content: start;
    width: 100%;
  }

  .swiper-button-next,
  .swiper-button-prev {
    background-color: #adacac;
    padding: 5px 10px;
    color: white;
  }

  .swiper-button-next {
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
  }

  .swiper-button-next::after,
  .swiper-button-prev::after {
    font-size: 20px;
    font-weight: bold;
  }

  .swiper-button-disabled {
    display: none;
  }

  .swiper-slide {
    width: max-content;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;

    a {
      text-transform: uppercase;
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 15px;
      font-weight: 600;
      font-size: 13px;
      gap: 5px;
    }
  }

  span {
    padding: 0px 10px;
    width: 100%;
  }
`;

export default Navslider;
