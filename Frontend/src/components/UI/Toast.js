import React from "react";
import { toast } from "react-toastify";

export const displayIcon = (type) => {
    switch (type) {
        case "success":
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
                ;
        case "info":
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
                ;
        case "error":
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
                ;
        case "warning":
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
                ;
        default:
            return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
                ;
    }
};

const explorerUrl = "https://mumbai.polygonscan.com/tx/";

export const ToastMessage = ({ type, title, body }) =>
    toast[type](
        <div>
            <div style={{ flexGrow: 1, fontSize: 10, padding: "8px 12px" }}>
                {title}
            </div>
            <div style={{ flexGrow: 1, fontSize: 15, padding: "8px 12px" }}>
                {body}
            </div>
        </div>
    );

ToastMessage.dismiss = toast.dismiss;


export const TransactionToastMessage = ({ type, title, txHash }) =>
    toast[type](
        
        <div className="p-2">
            <h2 className="font-xs w-full">
                Transaction {title} !!
            </h2>
            {txHash &&
                <a href={`${explorerUrl}${txHash}`}
                    target="__blank" className="underline hover:text-blue-600 mb-2 xs:mt-0 xs:tracking-widest">View on polyscan</a>
            }
        </div>
    );

TransactionToastMessage.dismiss = toast.dismiss;