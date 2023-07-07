import React from 'react'
import { ReactComponent as EmailIcon } from "../assets/email.svg"
import {ReactComponent as MobileIcon} from "../assets/mobile.svg"


const TopNav = () => {
  return (
    <div className="flex flex-wrap bg-gray-900 text-white justify-center lg:justify-end items-center italic">
      <div className="flex py-1 px-5">
        <EmailIcon />
        <span className='leading-[23px]'>contact@vapemate.pl</span>
      </div>
      <div className="flex py-1 px-5">
        <MobileIcon />
        <span className='leading-[25px]'>+48 000 000 000</span>
      </div>
    </div>
  );
}

export default TopNav