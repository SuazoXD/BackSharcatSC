"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { userPayload } from "@/app/home/interfaces/userPayload-int";
import { jwtDecode } from "jwt-decode";
import DropdownProfile from "./drop-menu";


const Header = () => {
    const scrolled = useScroll(5);
    const selectedLayout = useSelectedLayoutSegment();

    const [token, setToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<userPayload | null>(null);

    useEffect(() => {
        const access_token = sessionStorage.getItem("access_token");

        if(!access_token){
            console.error("Token no encontrado");
            return
        }

        setToken(access_token);
    }, []);

    useEffect(() => {
        if(token){
            const decoded = jwtDecode<userPayload>(token);
            setUserData(decoded);
        }else{
            setUserData(null);
        }
    }, [token]);

    useEffect(() => {
        console.log(userData);
    }, [userData])

    return (
        <div
            className={cn(
                `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200 bg-blue-500`,
                {
                'border-b border-gray-200 bg-blue-500/90 backdrop-blur-sm': scrolled,
                'border-b border-gray-200 bg-blue-500': selectedLayout,
                },
            )}
            >
            <div className="flex h-[47px] items-center justify-between px-4">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/"
                        className="flex flex-row space-x-3 items-center justify-center md:hidden"
                    >
                        <span className="h-7 w-7 bg-zinc-300 rounded-lg" />
                        <span className="font-bold text-xl flex text-white">SharkCat</span>
                    </Link>
                    </div>

                    <div className="hidden md:block">
                    <div className="h-10 w-10 rounded-full bg-sky-300 flex items-center justify-center text-center">
                        {userData?.profilePhoto !== null && (
                            <DropdownProfile profilePhoto={userData?.profilePhoto}/>
                        )}
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default Header;