import React from 'react'

const ComparisonTable = () => {
    const protocolList = [{
        "title": "Cryptotask",
        "description": "Kuch bhi",
    }
    ]

    return (
        <section>
            <div className="relative items-center w-full mx-auto md:px-8 lg:px-8 max-w-7xl">
                <div>
                    <h1 className="max-w-5xl text-center my-24 text-2xl font-bold leading-none tracking-tighter text-neutral-600 md:text-5xl lg:text-6xl lg:max-w-7xl">
                        {"Powering Everything,"} <br className="hidden lg:block mt-2" />
                        Overpowering Others
                    </h1>
                    <div className="relative p-10 space-y-12 overflow-hidden lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-x-8 rounded-xl">
                        <div className="relative flex flex-col p-8 bg-white">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-neutral-600">CryptoTask</h3>
                                {/* <p className="mt-6 text-gray-500">The essentials to provide your best work for clients.</p> */}

                                <ul role="list" className="pt-6 mt-6 space-y-6 border-t">
                                    {/* <span className="text-lg font-semibold text-neutral-600">What's included?</span> */}

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-neutral-600">Upto 3% client fee</span>
                                    </li>

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-neutral-600">Upto 3% freelancer fee</span>
                                    </li>

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-red-600 rounded-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 p-1 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-neutral-600">No ownership protection</span>
                                    </li>

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-neutral-600">General profile only</span>
                                    </li>

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-red-600 rounded-xl">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 p-1 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>

                                        </div>
                                        <span className="ml-3 text-neutral-600">No real time communication</span>
                                    </li>
                                    {/* <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-neutral-600">No real time communication</span>
                                    </li> */}

                                </ul>
                            </div>
                            {/* <div className="mt-6 rounded-lg">
                                <a href="#" type="highlight" className="w-full items-center block px-10 py-3.5 text-base font-medium text-center text-blue-600 transition duration-500 ease-in-out transform border-2 border-white shadow-md rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 bg-white"> Get Started </a>
                            </div> */}
                        </div>
                        <div className="relative flex flex-col p-8 bg-white">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-neutral-600">LaborX</h3>
                                {/* <p className="mt-6 text-gray-500">The essentials to provide your best work for clients.</p> */}

                                <ul role="list" className="pt-6 mt-6 space-y-6 border-t">
                                    {/* <span className="text-lg font-semibold text-neutral-600">What's included?</span> */}

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-neutral-600">0% client fee</span>
                                    </li>
                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-red-600 rounded-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 p-1 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-neutral-600">10% freelancer fee</span>
                                    </li>

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-neutral-600">Centralized data storage</span>
                                    </li>

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-red-600 rounded-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 p-1 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-neutral-600">No ownership protection</span>
                                    </li>

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-neutral-600">General profile only</span>
                                    </li>
                                </ul>
                            </div>
                            {/* <div className="mt-6 rounded-lg">
                                <a href="#" type="highlight" className="w-full items-center block px-10 py-3.5 text-base font-medium text-center text-blue-600 transition duration-500 ease-in-out transform border-2 border-white shadow-md rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 bg-white"> Get Started </a>
                            </div> */}
                        </div>


                        <div className="relative flex flex-col p-8 bg-white">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-neutral-600">Hyve</h3>
                                {/* <p className="mt-6 text-gray-500">Dedicated support and infrastructure for your company.</p> */}

                                <ul role="list" className="pt-6 mt-6 space-y-6 border-t">
                                    {/* <span className="text-lg font-semibold text-neutral-600">What's included?</span> */}

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-neutral-600">0.5% - 8% client fee</span>
                                    </li>

                                    {/* <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-neutral-600">Unlimited credits</span>
                                    </li>

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-neutral-600">A super wallet</span>
                                    </li> */}

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-red-600 rounded-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 p-1 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-neutral-600">No ownership protection </span>
                                    </li>

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-neutral-600">Real time communication</span>
                                    </li>

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-neutral-600">General profile only</span>
                                    </li>
                                </ul>
                            </div>

                            {/* <div className="mt-6 rounded-lg">
                                <a href="#" type="highlight" className="w-full items-center block px-10 py-3.5 text-base font-medium text-center text-blue-600 transition duration-500 ease-in-out transform border-2 border-white shadow-md rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 bg-white"> Get Started </a>
                            </div> */}
                        </div>
                        <div className="relative flex flex-col p-8 bg-blue-600 rounded-2xl">
                            <div className="relative flex-1">
                                <h3 className="text-xl font-semibold text-white">Maven</h3>

                                {/* <p className="mt-6 text-white text-solitud">A plan that scales with your rapidly growing business.</p> */}

                                <ul role="list" className="pt-6 mt-6 space-y-6 border-t">
                                    {/* <span className="text-lg font-semibold text-white">What's included?</span> */}

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-white rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-neutral-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-white">Only 1% client fee</span>
                                    </li>

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-white rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-neutral-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-white">ERC6551 based Job ownership protection</span>
                                    </li>

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-white rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-neutral-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-white">Real time Push notification</span>
                                    </li>

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-white rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-neutral-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-white">NFT Profile and unlimited updates</span>
                                    </li>
                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-white rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-neutral-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-white">Anonymous Dispute Resolution</span>
                                    </li>

                                    <li className="flex">
                                        <div className="inline-flex items-center w-6 h-6 bg-white rounded-xl">
                                            <svg className="flex-shrink-0 w-4 h-4 mx-auto text-neutral-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="ml-3 text-white">Escrowed Contract</span>
                                    </li>
                                </ul>
                            </div>
                            {/* <div className="z-50 mt-6 rounded-lg">
                                <a href="/pricing" type="highlight" className="w-full items-center block px-10 py-3.5 text-base font-medium text-center text-blue-600 transition duration-500 ease-in-out transform border-2 border-white shadow-md rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 bg-white"> Get started </a>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ComparisonTable