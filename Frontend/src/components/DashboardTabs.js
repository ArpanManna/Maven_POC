import React from 'react'
import { Tab, Tabs } from './Tabs'
import ProjectSection from './ProjectSection'
import FreelancerSection from './FreelancerSection'

const DashboardTabs = () => {
    return (
        <>
        
<form className='h-36 bg-black px-8 py-6'>   
    <h2 className="font-semibold text-3xl mb-2">Browse</h2>
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
    <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input type="search" id="default-search" class="block w-full z-0 p-3 pl-10 text-sm text-gray-900 rounded-lg bg-gray-50 focus:outline-none" placeholder="Search Projects, Freelancers..." required />
        <button type="submit" class="text-white absolute right-1 bottom-1 bg-palatte2 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-4 py-2 ">Search</button>
    </div>
</form>

            <Tabs>
                <Tab component={<ProjectSection />} active>Projects</Tab>
                <Tab component={<FreelancerSection />}>
                    Freelancers
                </Tab>
            </Tabs>
        </>)
}

export default DashboardTabs
