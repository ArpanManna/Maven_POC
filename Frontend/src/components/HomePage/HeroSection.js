import Image from 'next/image'
import React from 'react'
// import HeroImg from '../assets/imgs/imgCollage.jpg';
import freelancerImg from "../../assets/imgs/freelancer.svg"
import Link from 'next/link';


const HeroSection = () => {
  return (
    <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24 flex h-screen">
      <div className="flex flex-col justify-center flex-1 px-8 md:px-12 lg:flex-none lg:px-20">
        <div className="w-full mx-auto lg:max-w-6xl">
          <div className="max-w-xl mx-auto text-center lg:p-10 lg:text-left">
            <div><h1 className="max-w-5xl text-2xl font-bold leading-none tracking-normal md:text-5xl lg:text-5xl lg:max-w-7xl">
              {"Decentralized Freelancing Platform"}
            </h1>
              <p className="max-w-xl font-mono mt-4 text-base tracking-tight text-gray-600">
                Earn freely with ownership protection rights!
              </p>
            </div>
            <div className="flex flex-col items-center justify-center max-w-lg gap-3 mx-auto mt-10 lg:flex-row lg:justify-start">
              <Link href="/browse" className="items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full nline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none lg:w-auto focus-visible:outline-black text-sm focus-visible:ring-black">
                Browse Jobs
              </Link>
              <Link href="#featureCard" scroll={false} className="transition ease-in-out delay-700 inline-flex items-center justify-center text-sm font-semibold text-black duration-200 hover:text-blue-500 focus:outline-none focus-visible:outline-gray-600">
                Learn more
                <span aria-hidden="true"> → </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex-1 mt-32 mr-20 hidden lg:block">
        <div>
        <Image src={freelancerImg} alt='Connect' width={450} height={450}/>
        </div>
      </div>
    </div>


  )
}

export default HeroSection