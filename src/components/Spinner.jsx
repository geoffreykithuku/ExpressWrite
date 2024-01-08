import React from 'react'
import { FadeLoader } from "react-spinners";
const Spinner = () => {
  return (
    <div className="w-full pb-20">
      <div className="flex justify-center items-center  h-full flex-col gap-6 m-5">
        <p className="text-[#180] text-sm tracking-wide w-full max-w-[500px] text-center">Server was put into sleep mode due to inactivity and may take a <span className=''>few seconds</span> to wake up. Please be patient.
        </p>
        <FadeLoader color="#555E52" />
      </div>
    </div>
  );
}

export default Spinner