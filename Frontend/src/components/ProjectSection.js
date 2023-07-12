import React from "react";
import ProjectCards from "./ProjectCards";

function ProjectSection() {
    return (
        <div className="flex flex-no-wrap p-5">
            <div className="w-64 absolute rounded-lg sm:relative bg-white shadow md:h-screen flex-col justify-between hidden sm:flex">
                <div className="px-8">
                    <div className="h-16 w-full flex items-center">
                        <h3 className="text-gray-800">Filters</h3>
                    </div>
                    <ul className="mt-12">
                        <li className="flex w-full justify-between text-gray-300 hover:text-gray-500 cursor-pointer items-center mb-6">
                            1.
                        </li>
                        <li className="flex w-full justify-between text-gray-600 hover:text-gray-500 cursor-pointer items-center mb-6">
                            2.
                        </li>
                        <li className="flex w-full justify-between text-gray-600 hover:text-gray-500 cursor-pointer items-center mb-6">
                            3.
                        </li>
                        <li className="flex w-full justify-between text-gray-600 hover:text-gray-500 cursor-pointer items-center mb-6">
                            4.
                        </li>
                        <li className="flex w-full justify-between text-gray-600 hover:text-gray-500 cursor-pointer items-center mb-6">
                            5.
                        </li>
                        <li className="flex w-full justify-between text-gray-600 hover:text-gray-500 cursor-pointer items-center mb-6">
                            6.
                        </li>
                        <li className="flex w-full justify-between text-gray-600 hover:text-gray-500 cursor-pointer items-center">
                            7.
                        </li>
                    </ul>

                </div>

            </div>

            <div className="mx-auto md:w-4/5 w-11/12 pl-5">
                <div className="w-full h-full ">
                    <ProjectCards />
                </div>
            </div>
        </div>
    );
}

export default ProjectSection;
