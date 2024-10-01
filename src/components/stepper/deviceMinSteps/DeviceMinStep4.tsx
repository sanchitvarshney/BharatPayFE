import { CustomButton } from "@/components/reusable/CustomButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/hooks/useReduxHook";
import { Download } from "lucide-react";
import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import styled from "styled-components";

type Props = {
  setStep: (step: number) => void;
  step?: number;
};
const DeviceMinStep4: React.FC<Props> = ({ setStep }) => {
  const {min_no} = useAppSelector(state=>state.divicemin)
  return (
    <Card className="h-[calc(100vh-70px)]">
      <CardHeader className="p-0 bg-hbg h-[60px] justify-center px-[20px]">
        <CardTitle>Confirm And Proceed</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100vh-130px)] flex items-center justify-center">
        <div className="flex flex-col justify-center max-h-max max-w-max gap-[30px]">
          <Success>
            <div className="success-animation">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
          </Success>
         <div className="flex items-center gap-[20px] text-slate-600 justify-center">
          <p className="text-[18px] font-[600]">MIN No.</p>
          <p>{min_no&&min_no}</p>
         </div>
          <div className="flex items-center gap-[10px]">
            <CustomButton disabled variant={"outline"} icon={<Download className="h-[18px] w-[18px]" />}>
              Download
            </CustomButton>
            <CustomButton onClick={() => setStep(1)} className="bg-cyan-700 hover:bg-cyan-800 flex items-center gap-[10px]">
              Create New MIN <FaArrowRightLong className="h-[18px] w-[18px]" />
            </CustomButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
const Success = styled.div`
  .checkmark {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #4bb71b;
    stroke-miterlimit: 10;
    box-shadow: inset 0px 0px 0px #4bb71b;
    animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
    position: relative;
    top: 5px;
    right: 5px;
    margin: 0 auto;
  }
  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #4bb71b;
    fill: #fff;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }

  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  }

  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes scale {
    0%,
    100% {
      transform: none;
    }

    50% {
      transform: scale3d(1.1, 1.1, 1);
    }
  }

  @keyframes fill {
    100% {
      box-shadow: inset 0px 0px 0px 30px #4bb71b;
    }
  }
`;

export default DeviceMinStep4;
