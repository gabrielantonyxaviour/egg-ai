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
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';




interface CreateRecipeProps {
    close: () => void;
}

const CreateRecipe: React.FC<CreateRecipeProps> = ({ close }) => {
    const [takeProfits, setTakeProfits] = useState<TakeProfit[]>([{ price: '', percentage: '' }]);
    const [dcaPoints, setDcaPoints] = useState<DCA[]>([{ price: '', percentage: '' }]);
    const [selectedAsset, setSelectedAsset] = useState<string>('');
    const [selectedChain, setSelectedChain] = useState<string>('');
    const [direction, setDirection] = useState<'buy_long' | 'sell_short'>('buy_long');
    const [selectedDate, setSelectedDate] = useState<Date>();
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

    return (
        <div className="relative w-[68%] h-full bg-black rounded-sm">
            <div className="absolute w-full h-full flex flex-col -top-[0.5%] -left-[0.5%] space-y-2 sen rounded-sm text-sm border-2 border-black py-2 bg-[#faefe0] text-black">
                <div className="flex justify-between items-center px-4">
                    <h2 className="text-xl font-bold">Create Trade Play</h2>
                    <Button variant="ghost" size="icon" onClick={close}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[calc(100vh-100px)]">
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
                                                {Object.keys(assets[selectedAsset]).filter((chain: string) => assets[selectedAsset][chain as 'arb' | 'avax'] != '').map((chain: string) => <Image src={`/chains/${chain}.png`} className='rounded-full' width={24} height={24} alt={chain} />)}

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
                                                        className='w-full hover:bg-[#c49963]'
                                                    >
                                                        <div className='ml-2 flex w-full items-center space-x-2'>
                                                            <p className='sen font-semibold '>{asset}/USD</p>
                                                            {selectedAsset === asset && (
                                                                <Check className=" h-4 w-4" />
                                                            )}
                                                            <div className='flex space-x-1 flex-1 justify-end'>
                                                                {Object.keys(chains).filter((chain: string) => chains[chain as 'arb' | 'avax'] != '').map((chain: string) => <Image src={`/chains/${chain}.png`} className='rounded-full' width={24} height={24} alt={chain} />)}

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
                                                {selectedAsset && Object.keys(assets[selectedAsset]).length > 1 && (
                                                    <CommandItem value="both" onSelect={() => setSelectedChain('both')}>
                                                        Either
                                                        {selectedChain === 'both' && (
                                                            <Check className="ml-auto h-4 w-4" />
                                                        )}
                                                    </CommandItem>
                                                )}
                                                {selectedAsset &&
                                                    Object.keys(assets[selectedAsset]).map((chain) => (
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
                        <Input type="number" step="0.01" />
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
                        <Input type="number" step="0.01" />
                    </div>

                    <div className="space-y-2">
                        <Label>Leverage (1-20)</Label>
                        <Input type="number" min="1" max="20" step="1" />
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
                                    onSelect={setSelectedDate}
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
                            />


                        </div>


                    </div>

                    <div className="space-y-2">
                        <Label>Expected PNL (%)</Label>
                        <Input type="number" step="0.1" />
                    </div>

                    <div className="space-y-2">
                        <Label>Research Description</Label>
                        <Textarea
                            className="h-32 resize-none"
                            placeholder="Enter your research description..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Image</Label>
                        <Input type="file" accept="image/*" />
                    </div>

                    <Button type="submit" className="w-full mt-4">
                        Create Trade Play
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CreateRecipe;