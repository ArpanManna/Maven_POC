import Image from 'next/image'
import React from 'react'
// import HeroImg from '../assets/imgs/imgCollage.jpg';
import Img1 from '../assets/imgs/travellekh5.jpg';
import Img2 from '../assets/imgs/travellekh4.jpg';
import Img3 from '../assets/imgs/travellekh1.jpg';
import Link from 'next/link';


const HeroSection = () => {
  return (
    <div className="flex min-h-screen bg-gray-200">
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
              <Link href="/blog/create" className="items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full nline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none lg:w-auto focus-visible:outline-black text-sm focus-visible:ring-black">
                Browse Jobs
              </Link>
              <a href="#" className="inline-flex items-center justify-center text-sm font-semibold text-black duration-200 hover:text-blue-500 focus:outline-none focus-visible:outline-gray-600">
                Learn more
                <span aria-hidden="true"> → </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex-1 mt-36 mr-20 hidden lg:block">
        <div>
          <Image height={240} width={240} className="rounded-md transform transition ease-in-out delay-150 hover:translate-x-4 absolute inset-0 ml-44 -mt-12 -rotate-8 object-cover" src={Img1} alt="" />
          <Image height={200} width={200} className="rounded-md transform transition ease-in-out delay-150 hover:translate-y-4 absolute mt-32 ml-24 rotate-6 inset-0 object-cover" src={Img2} alt="" />
          <Image height={200} width={200} className="rounded-md transform transition ease-in-out delay-150 hover:-translate-x-4 absolute rotate-2 inset-0 object-cover" src={Img3} alt="" />
        </div>
      </div>
    </div>


  )
}

export default HeroSection