import React, { useState } from 'react';
import { X, Plus, Check, Smile, Trash2, CalendarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; import { format } from "date-fns"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { DCA, TakeProfit } from '@/types';
import { assets } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useEnvironmentStore } from '../context';

interface CreateRecipeProps {
    close: () => void;
}

const CreateRecipe: React.FC<CreateRecipeProps> = ({ close }) => {
    const { chef, setRecipe } = useEnvironmentStore((store) => store)
    const [entryPrice, setEntryPrice] = useState<number>(2628); // Entry price for ETH
    const [leverage, setLeverage] = useState<number>(3); // Adjusted leverage for ETH
    const [stopLoss, setStopLoss] = useState<number>(2500); // Stop loss below entry

    const [takeProfits, setTakeProfits] = useState<TakeProfit[]>([
        { price: '2750', percentage: '30' }, // Take profit above entry
        { price: '2850', percentage: '100' }, // Another take profit level
    ]);

    const [dcaPoints, setDcaPoints] = useState<DCA[]>([
        { price: '2628', percentage: '30' }, // DCA below entry
        { price: '2600', percentage: '30' }, // Another DCA level
        { price: '2575', percentage: '40' }, // Another DCA level
    ]);

    const [selectedAsset, setSelectedAsset] = useState<string>('ETH'); // Asset name
    const [selectedChain, setSelectedChain] = useState<string>('any'); // Blockchain network
    const [direction, setDirection] = useState<'buy_long' | 'sell_short'>('buy_long'); // Position type
    const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Trade date
    const [selectedTime, setSelectedTime] = useState<string>('19:00'); // Trade time
    const [expectedPnl, setExpectedPnl] = useState<string>('12'); // Expected profit & loss

    const [researchDescription, setResearchDescription] = useState<string>(
        'Taking a long position on ETH at $2628 because technical indicators show bullish momentum with MACD crossover and RSI at 60. ' +
        'On-chain metrics indicate growing network activity, with transaction volume up 15% to 5.2M ETH and active addresses increasing by 7% to 1.1M. ' +
        'Recent whale accumulation of 120K ETH and improving liquidity suggest strong upside potential. The main risk is macroeconomic uncertainty, ' +
        'but current price level offers an attractive risk/reward ratio for a long entry.'
    );

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [loading, setLoading] = useState(0);
    const [error, setError] = useState<string>('');
    // Sample asset data - replace with your actual data

    const handleAddTakeProfit = () => {
        if (takeProfits.length < 3) {
            setTakeProfits([...takeProfits, { price: '', percentage: '' }]);
        }
    };

    const handleSubTakeProfit = () => {
        if (takeProfits.length > 1) {
            setTakeProfits(takeProfits.slice(0, takeProfits.length - 1));
        }
    }

    const handleAddDCA = () => {
        if (dcaPoints.length < 3) {
            setDcaPoints([...dcaPoints, { price: '', percentage: '' }]);
        }
    };

    const handleSubDCA = () => {
        if (dcaPoints.length > 1) {
            setDcaPoints(dcaPoints.slice(0, dcaPoints.length - 1));
        }
    }

    const handleAssetChange = (asset: string) => {
        setSelectedAsset(asset);
        const chains = Object.keys(assets[asset]);
        if (chains.length === 1) {
            setSelectedChain(chains[0]);
        } else {
            setSelectedChain('');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            console.log("Selected file:", file);
            const img = new Image()
            img.onload = () => {
                console.log("Image loaded successfully");
                setImage(file)
                setImagePreview(URL.createObjectURL(file))
            }
            img.onerror = () => {
                console.error("Failed to load image");
            }
            img.src = URL.createObjectURL(file)
        } else {
            console.log("No file selected");
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Submitted")
        setLoading(1)
        console.log(image)
        if (!image) {
            setError('Please upload a profile image')
            return
        }
        // Handle form submission here
        console.log({ takeProfits, dcaPoints, selectedAsset, selectedChain, direction, selectedDate, entryPrice, leverage, stopLoss, researchDescription, image, imagePreview, selectedTime, expectedPnl })

        const targetDateTime = new Date(selectedDate);
        const [hours, minutes] = selectedTime.split(':').map(Number);
        targetDateTime.setHours(hours, minutes, 0, 0);

        const currentDate = new Date();
        const timeFrame = Math.floor((targetDateTime.getTime() - currentDate.getTime()) / 1000);

        console.log(timeFrame)
        const formData = new FormData()
        formData.append('chef_id', chef?.id || "")
        formData.append('username', (chef as any).username || "")
        formData.append('asset', selectedAsset)
        formData.append('direction', direction)
        formData.append('chain', selectedChain)
        formData.append('entry_price', entryPrice.toString());
        formData.append('stop_loss', stopLoss.toString());
        formData.append('leverage', leverage.toString());
        formData.append('timeframe', timeFrame.toString());
        formData.append('research_description', researchDescription);
        formData.append('dex', 'GMX');
        formData.append('image', image);
        formData.append('take_profit', JSON.stringify(takeProfits));
        formData.append('dca', JSON.stringify(dcaPoints));
        formData.append('expected_pnl', expectedPnl.length > 0 ? expectedPnl : "0");
        console.log("FormData")
        console.log(formData)

        try {

            const response = await fetch('/api/supabase/create-play', {
                method: 'POST',
                body: formData
            })
            const { play, error } = await response.json()

            if (error) {
                console.log(error)
                setError(error)
                setLoading(0);
                return
            }
            console.log("Successfully created play")
            console.log(play)
            setLoading(2)
            setRecipe(play)
        } catch (e) {
            setLoading(3)
        }

    }
    return (
        <div className="2xl:relative absolute 2xl:top-[0%] 2xl:left-[0%] left-[16%] xl:w-[48%] w-[80%] 2xl:h-full h-[600px] bg-black rounded-sm">
            <div className="absolute w-full h-full flex flex-col -top-[0.5%] -left-[0.5%] space-y-2 sen rounded-sm text-sm border-2 border-black py-2 bg-[#faefe0] text-black">
                <div className="flex justify-between items-center px-4">
                    <h2 className="text-xl font-bold">Create Trade Play</h2>
                    <Button variant="ghost" size="icon" onClick={close} className="hover:bg-transparent">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <ScrollArea className='max-h-[calc(100vh-100px)]'>
                    <form className="flex flex-col gap-4 p-4 overflow-y-auto " onSubmit={handleSubmit}>
                        {/* Top Row: DEX, Asset, Chain */}
                        <div className="flex gap-4 items-start">
                            {/* DEX */}
                            <div className="flex-none w-32">
                                <Label>DEX</Label>
                                <div className="flex items-center p-2 border rounded-md bg-[#c49963] mt-2">
                                    <img src="/gmx.png" alt="GMX Logo" className="mr-2 w-[20px] h-[20px] rounded-full" />
                                    <span className='text-white font-semibold'>GMX</span>
                                </div>
                            </div>

                            {/* Asset Selection */}
                            <div className="flex-1">
                                <Label>Asset</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full mt-2 justify-between hover:bg-[#c49963] hover:text-white">
                                            <div className='ml-2 flex w-full items-center space-x-2'>
                                                <p className='sen font-semibold '>{selectedAsset ? `${selectedAsset}/USD` : "Select Asset"}</p>
                                                {selectedAsset && <div className='flex space-x-1 flex-1 justify-end'>
                                                    {Object.keys(assets[selectedAsset]).filter((chain: string) => assets[selectedAsset][chain as 'arb' | 'avax'] != '').map((chain: string) => <img key={chain} src={`/chains/${chain}.png`} className='rounded-full w-[24px] h-[24px]' alt={chain} />)}

                                                </div>}

                                            </div>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search assets..." className='sen' />
                                            <CommandList>
                                                <CommandEmpty className='sen p-4 text-sm text-center'>No assets found.</CommandEmpty>
                                                <CommandGroup>

                                                    {Object.entries(assets).map(([asset, chains]) => (
                                                        <CommandItem
                                                            key={asset}
                                                            value={asset}
                                                            onSelect={() => handleAssetChange(asset)}
                                                            className='w-full hover:bg-[#c49963] cursor-pointer'
                                                        >
                                                            <div className='ml-2 flex w-full items-center space-x-2'>
                                                                <p className='sen font-semibold '>{asset}/USD</p>
                                                                {selectedAsset === asset && (
                                                                    <Check className=" h-4 w-4" />
                                                                )}
                                                                <div className='flex space-x-1 flex-1 justify-end'>
                                                                    {Object.keys(chains).filter((chain: string) => chains[chain as 'arb' | 'avax'] != '').map((chain: string) => <img key={chain} src={`/chains/${chain}.png`} className='rounded-full w-[24px] h-[24px]' alt={chain} />)}

                                                                </div>

                                                            </div>



                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>

                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Chain Selection */}
                            <div className="flex-1">
                                <Label>Chain</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full mt-2 hover:bg-[#c49963] hover:text-white"
                                            disabled={!selectedAsset || Object.keys(assets[selectedAsset] || {}).length === 1}
                                        >
                                            {selectedChain ? selectedChain.toUpperCase() : "Select Chain"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 sen" align="start">
                                        <Command>
                                            <CommandList>
                                                <CommandGroup>
                                                    {selectedAsset && Object.values(assets[selectedAsset]).filter((address) => address != '').length > 1 && (
                                                        <CommandItem value="any" onSelect={() => setSelectedChain('any')}>
                                                            Any
                                                            {selectedChain === 'any' && (
                                                                <Check className="ml-auto h-4 w-4" />
                                                            )}
                                                        </CommandItem>
                                                    )}
                                                    {selectedAsset &&
                                                        Object.keys(assets[selectedAsset]).filter((chain) => assets[selectedAsset][chain as 'arb' | 'avax'] != "").map((chain) => (
                                                            <CommandItem
                                                                key={chain}
                                                                value={chain}
                                                                onSelect={() => setSelectedChain(chain)}
                                                            >
                                                                {chain.toUpperCase()}
                                                                {selectedChain === chain && (
                                                                    <Check className="ml-auto h-4 w-4" />
                                                                )}
                                                            </CommandItem>
                                                        ))}
                                                </CommandGroup>
                                            </CommandList>

                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Direction Radio Group */}
                        <div className="space-y-2">
                            <Label>Direction</Label>
                            <RadioGroup
                                defaultValue="buy_long"
                                onValueChange={(value) => setDirection(value as 'buy_long' | 'sell_short')}
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="buy_long" id="buy_long" />
                                    <Label htmlFor="buy_long">Buy Long</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="sell_short" id="sell_short" />
                                    <Label htmlFor="sell_short">Sell Short</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Entry Price */}
                        <div className="space-y-2">
                            <Label>Entry Price</Label>
                            <Input type="number" step="0.01" value={entryPrice} onChange={(e) => {
                                setEntryPrice(Number(e.target.value))
                            }} />
                        </div>

                        {/* Take Profit Points */}
                        <div className="space-y-2">
                            <Label>Take Profit Points</Label>
                            {takeProfits.map((tp, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <Input
                                        type="number"
                                        placeholder="Price"
                                        step="0.01"
                                        value={tp.price}
                                        onChange={(e) => {
                                            const newTakeProfits = [...takeProfits];
                                            newTakeProfits[index].price = e.target.value;
                                            setTakeProfits(newTakeProfits);
                                        }}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Percentage"
                                        step="0.1"
                                        value={tp.percentage}
                                        onChange={(e) => {
                                            const newTakeProfits = [...takeProfits];
                                            newTakeProfits[index].percentage = e.target.value;
                                            setTakeProfits(newTakeProfits);
                                        }}
                                    />
                                </div>
                            ))}
                            <div className='flex space-x-2'>  {takeProfits.length < 3 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddTakeProfit}
                                    className="flex items-center gap-1 hover:bg-[#c49963] hover:text-white"
                                >
                                    <Plus className="h-4 w-4" /> Add Take Profit
                                </Button>
                            )}
                                {takeProfits.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={handleSubTakeProfit}
                                        className="flex items-center gap-1 bg-[#d74b1a] hover:bg-[#d74b1a]"
                                    >
                                        <Trash2 className="h-4 w-4" /> Remove
                                    </Button>
                                )}</div>

                        </div>

                        {/* DCA Points */}
                        <div className="space-y-2">
                            <Label>DCA Points</Label>
                            {dcaPoints.map((dca, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <Input
                                        type="number"
                                        placeholder="Price"
                                        step="0.01"
                                        value={dca.price}
                                        onChange={(e) => {
                                            const newDcaPoints = [...dcaPoints];
                                            newDcaPoints[index].price = e.target.value;
                                            setDcaPoints(newDcaPoints);
                                        }}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Percentage"
                                        step="0.1"
                                        value={dca.percentage}
                                        onChange={(e) => {
                                            const newDcaPoints = [...dcaPoints];
                                            newDcaPoints[index].percentage = e.target.value;
                                            setDcaPoints(newDcaPoints);
                                        }}
                                    />
                                </div>
                            ))}
                            <div className='flex space-x-2'>  {dcaPoints.length < 3 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddDCA}
                                    className="flex items-center gap-1 hover:bg-[#c49963] hover:text-white"
                                >
                                    <Plus className="h-4 w-4" /> Add DCA points
                                </Button>
                            )}
                                {dcaPoints.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={handleSubDCA}
                                        className="flex items-center gap-1 bg-[#d74b1a] hover:bg-[#d74b1a]"
                                    >
                                        <Trash2 className="h-4 w-4" /> Remove
                                    </Button>
                                )}</div>
                        </div>

                        {/* Other Fields */}
                        <div className="space-y-2">
                            <Label>Stop Loss</Label>
                            <Input type="number" step="0.01" value={stopLoss} onChange={(e) => {
                                setStopLoss(Number(e.target.value))
                            }} />
                        </div>

                        <div className="space-y-2">
                            <Label>Leverage (1-20)</Label>
                            <Input type="number" min="1" max="20" step="1" value={leverage} onChange={(e) => {
                                setLeverage(Number(e.target.value));
                            }} />
                        </div>

                        <div className=" flex flex-col space-y-2">
                            <Label>Timeframe</Label>
                            <div className='flex space-x-2'><Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal hover:bg-[#c49963] hover:text-white",
                                            !selectedDate && "text-muted-foreground"
                                        )}
                                    >
                                        {selectedDate ? (
                                            format(selectedDate, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => date && setSelectedDate(date)}
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                        initialFocus
                                        className='sen'
                                    />
                                </PopoverContent>
                            </Popover>
                                <Input
                                    type="time"
                                    className={cn(
                                        "h-10 px-3 py-2 rounded-md border border-gray-200",
                                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                        "hover:border-gray-300",
                                        "text-gray-900 placeholder:text-gray-400",
                                        "transition-colors duration-200 w-[120px]",
                                    )}
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                />


                            </div>


                        </div>

                        <div className="space-y-2">
                            <Label>Expected PNL (%)</Label>
                            <Input id="subFee"
                                type="number"
                                step="0.05"
                                min="1" value={expectedPnl} onChange={(e) => {
                                    setExpectedPnl(e.target.value)
                                }} />

                        </div>

                        <div className="space-y-2">
                            <Label>Research Description</Label>
                            <Textarea
                                className="h-32 resize-none"
                                placeholder="Enter your research description..."
                                value={researchDescription}
                                onChange={(e) => {
                                    setResearchDescription(e.target.value)
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Image</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={handleImageChange}
                                className="bg-white"
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>

                        <Button type="submit" className="w-full mt-4" disabled={loading != 0 && loading != 3}>
                            {loading == 1 ? "Loading" : loading == 2 ? 'Successfully posted play ✅' : loading == 3 ? 'Something went wrong' : "Create Trade Play"}
                        </Button>
                    </form>
                    <ScrollBar orientation='vertical' />
                </ScrollArea>

            </div>
        </div>
    );
};

export default CreateRecipe;