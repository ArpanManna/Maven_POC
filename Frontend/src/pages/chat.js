import Nav from '@/components/Nav'
const PushAPI = require('@pushprotocol/restapi');

import { fetchChatList } from '@/lib/pushProtocol'
import { useWeb3 } from '@3rdweb/hooks'
import React, { useEffect } from 'react'

const Chat = () => {
    const {address, provider} = useWeb3();

    const fetchChat = async () => {
        const res = await fetchChatList(address, provider.getSigner());
        console.log(res)
    //     const user = await PushAPI.user.get({
    //         account: `eip155:${address}`,
    //         env: 'staging',
    //       });
    //     console.log(user)
    }

    useEffect(() => {
        if (address) fetchChat();
    },[address])
    return (
        <>
            <Nav />
            <div class="m-4 shadow-lg rounded-lg">
                
                <div class="flex flex-row justify-between bg-white">
                    <div class="flex flex-col w-2/5 border-r-2 overflow-y-auto">
                        <div class="border-b-2 py-4 px-2">
                            <input
                                type="text"
                                placeholder="search chatting"
                                class="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
                            />
                        </div>
                        <div
                            class="flex flex-row py-4 px-2 justify-center items-center border-b-2"
                        >
                            <div class="w-1/4">
                                <img
                                    src="https://source.unsplash.com/_7LbC5J-jw4/600x600"
                                    class="object-cover h-12 w-12 rounded-full"
                                    alt=""
                                />
                            </div>
                            <div class="w-full">
                                <div class="text-lg font-semibold">Luis1994</div>
                                <span class="text-gray-500">Pick me at 9:00 Am</span>
                            </div>
                        </div>
                        <div class="flex flex-row py-4 px-2 items-center border-b-2">
                            <div class="w-1/4">
                                <img
                                    src="https://source.unsplash.com/otT2199XwI8/600x600"
                                    class="object-cover h-12 w-12 rounded-full"
                                    alt=""
                                />
                            </div>
                            <div class="w-full">
                                <div class="text-lg font-semibold">Everest Trip 2021</div>
                                <span class="text-gray-500">Hi Sam, Welcome</span>
                            </div>
                        </div>
                        <div
                            class="flex flex-row py-4 px-2 items-center border-b-2 border-l-4 border-blue-400"
                        >
                            <div class="w-1/4">
                                <img
                                    src="https://source.unsplash.com/L2cxSuKWbpo/600x600"
                                    class="object-cover h-12 w-12 rounded-full"
                                    alt=""
                                />
                            </div>
                            <div class="w-full">
                                <div class="text-lg font-semibold">MERN Stack</div>
                                <span class="text-gray-500">Lusi : Thanks Everyone</span>
                            </div>
                        </div>
                        <div class="flex flex-row py-4 px-2 items-center border-b-2">
                            <div class="w-1/4">
                                <img
                                    src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                                    class="object-cover h-12 w-12 rounded-full"
                                    alt=""
                                />
                            </div>
                            <div class="w-full">
                                <div class="text-lg font-semibold">Javascript Indonesia</div>
                                <span class="text-gray-500">Evan : some one can fix this</span>
                            </div>
                        </div>
                        <div class="flex flex-row py-4 px-2 items-center border-b-2">
                            <div class="w-1/4">
                                <img
                                    src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                                    class="object-cover h-12 w-12 rounded-full"
                                    alt=""
                                />
                            </div>
                            <div class="w-full">
                                <div class="text-lg font-semibold">Javascript Indonesia</div>
                                <span class="text-gray-500">Evan : some one can fix this</span>
                            </div>
                        </div>

                        <div class="flex flex-row py-4 px-2 items-center border-b-2">
                            <div class="w-1/4">
                                <img
                                    src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                                    class="object-cover h-12 w-12 rounded-full"
                                    alt=""
                                />
                            </div>
                            <div class="w-full">
                                <div class="text-lg font-semibold">Javascript Indonesia</div>
                                <span class="text-gray-500">Evan : some one can fix this</span>
                            </div>
                        </div>
                    </div>
                    <div class="w-full px-5 flex flex-col justify-between">
                        <div class="flex flex-col mt-5">
                            <div class="flex justify-end mb-4">
                                <div
                                    class="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                                >
                                    Welcome to group everyone !
                                </div>
                                <img
                                    src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                                    class="object-cover h-8 w-8 rounded-full"
                                    alt=""
                                />
                            </div>
                            <div class="flex justify-start mb-4">
                                <img
                                    src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                                    class="object-cover h-8 w-8 rounded-full"
                                    alt=""
                                />
                                <div
                                    class="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
                                >
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
                                    at praesentium, aut ullam delectus odio error sit rem. Architecto
                                    nulla doloribus laborum illo rem enim dolor odio saepe,
                                    consequatur quas?
                                </div>
                            </div>
                            <div class="flex justify-end mb-4">
                                <div>
                                    <div
                                        class="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                                    >
                                        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                                        Magnam, repudiandae.
                                    </div>

                                    <div
                                        class="mt-4 mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                                    >
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                        Debitis, reiciendis!
                                    </div>
                                </div>
                                <img
                                    src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                                    class="object-cover h-8 w-8 rounded-full"
                                    alt=""
                                />
                            </div>
                            <div class="flex justify-start mb-4">
                                <img
                                    src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                                    class="object-cover h-8 w-8 rounded-full"
                                    alt=""
                                />
                                <div
                                    class="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
                                >
                                    happy holiday guys!
                                </div>
                            </div>
                        </div>
                        <div class="py-5">
                            <input
                                class="w-full bg-gray-300 py-5 px-3 rounded-xl"
                                type="text"
                                placeholder="type your message here..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chat