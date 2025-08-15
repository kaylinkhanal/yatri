'use client'
import dynamic from "next/dynamic";
import { useMemo } from "react";

export default  function Page() {
    const Map =  dynamic(
        () => import('@/components/map/'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    )

    return (
        <>
            <div className="bg-white-700 mx-auto my-5 w-[100%] h-[100%]">
                <Map posix={[27.71, 85.32]} />
            </div>
        </>
    )
}