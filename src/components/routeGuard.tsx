import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, isTokenExpired } from "@/lib/auth";

interface RouteGuardProps {
    children: ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) =>{
    const router = useRouter();

    useEffect(() => {
        const token = getAccessToken();
        if(!token || isTokenExpired(token)){
            router.push('/auth/login');
        }
    }, [router]);

    return (
        <>
            {children}
        </>
    )
};

export default RouteGuard;