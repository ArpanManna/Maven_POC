import { useWeb3 } from '@3rdweb/hooks';
import { Menu, Transition } from '@headlessui/react';
import { PowerIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React from 'react'
import metamaskIcon from "../../assets/imgs/Metamask.svg"

const Modal = dynamic(() => import("./Modal"), {
    ssr: false,
  });

const WalletConnect = () => {
    const { connectWallet, address, disconnectWallet, error, balance } = useWeb3();
    return (
        <>
            {address ? (
                <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
                    <div className="relative flex-shrink-0">
                        <Menu>
                            <Menu.Button className="inline-flex text-gray-800 bg-gray-300 w-28 justify-center rounded-3xl border border-gray-800 md:px-3 px-1 sm:py-2 py-1 text-sm font-medium hover:bg-opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-15">
                                {'0x...'}
                                {address.slice(address.length - 6)}
                            </Menu.Button>
                            <Transition
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4"
                                enterTo="opacity-100 -translate-x-7"
                                leave="ease-in duration-300"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-4"
                            >
                                <Menu.Items className="absolute  -right-20 mt-3 w-72 bg-white origin-top-right rounded-lg shadow-large z-40 sm:-right-14">
                                    <Menu.Item>
                                        <Menu.Item>
                                            <div className="border-b border-dashed border-gray-200 px-6 py-5 ">
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="text-sm font-medium -tracking-tighter text-gray-600 dark:text-gray-400">
                                                        Balance
                                                    </span>
                                                    <span className="rounded-lg bg-gray-100 px-2 py-1 text-sm tracking-tighter">
                                                        {address.slice(0, 6)}
                                                        {'...'}
                                                        {address.slice(address.length - 6)}
                                                    </span>
                                                </div>
                                                <div className="mt-3 text-center font-medium uppercase tracking-wider">
                                                    {balance && balance.formatted} MATIC
                                                </div>
                                            </div>
                                        </Menu.Item>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <div className="p-3">
                                            <div
                                                className="flex cursor-pointer items-center gap-3 rounded-lg py-2.5 px-3 text-sm font-medium text-gray-900 transition hover:bg-gray-200 bg-gray-100"
                                            onClick={() => disconnectWallet()}
                                            >
                                                <PowerIcon height={20} width={20}/>
                                                <span className="grow uppercase">Disconnect</span>
                                            </div>
                                        </div>
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            ) : (
                <button
                    className="px-2 py-2 rounded-3xl bg-gray-800 cursor-pointer hover:bg-purple-500 text-sm font-normal duration-100 text-white"
                    onClick={() => connectWallet("injected")}
                >
                    <Image src={metamaskIcon} alt='Connect' width={18} height={18}/>
                </button>
            )}
            {error && <Modal title="Unsupported Network"/>}
        </>
    );
}

export default WalletConnect