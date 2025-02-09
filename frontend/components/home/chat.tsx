export default function Chat({ close, selectedTradeId }: {
    selectedTradeId: string,
    close: () => void
}) {


    return <div className="w-[700px] h-[600px] absolute top-[26%] left-[32%] bg-black rounded-sm">
        <div
            onClick={() => { }}
            className={`absolute w-[600px] h-[400px] flex flex-col items-center -top-[1%] -left-[1%] w-full h-full space-y-2 sen rounded-sm text-sm border border-[2px] border-black py-2 bg-[#faefe0] text-black`}
        >

        </div>

    </div>


}