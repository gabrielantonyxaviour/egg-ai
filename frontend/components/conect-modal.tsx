
export default function ConnectModal({ isOpen, onClose }: {
    isOpen: boolean,
    onClose: () => void
}) {
    return <div className="absolute bg-black top-[20%] left-[33%] w-[100%] md:w-[700px] 2xl:h-[50%] h-[75%] sm:h-[60%] rounded-xl mx-auto">
        <div className="p-4 absolute flex flex-col justify-start -top-[4px] -left-[4px] bg-[#faefe0]  w-[100%] md:w-[700px] mx-auto h-full rounded-xl border-[1px] border-black">
            <p className="text-center pt-2 font-bold text-xl sen tracking-wide">
                Connect Lit Wallet
            </p>


        </div>
    </div>
}