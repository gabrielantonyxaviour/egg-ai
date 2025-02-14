import { CryptoPanicPost, ProcessedSentiment } from "../types.js";
import OpenAI from "openai";
interface Votes {
    negative: number;
    positive: number;
    important: number;
    liked: number;
    disliked: number;
    lol: number;
    toxic: number;
    saved: number;
    comments: number;
}

interface SentimentScore {
    score: number;  // Range from -1 to 1
    engagement: number;  // Total interactions
    controversy: number;  // Ratio of opposing reactions
}

function calculateSentiment(votes: Votes): SentimentScore {
    const totalVotes = votes.positive + votes.negative + votes.important +
        votes.liked + votes.disliked + votes.lol + votes.toxic;

    const positiveSignals = votes.positive + votes.liked + votes.important;
    const negativeSignals = votes.negative + votes.disliked + votes.toxic;

    return {
        score: totalVotes ? (positiveSignals - negativeSignals) / totalVotes : 0,
        engagement: totalVotes + votes.comments + votes.saved,
        controversy: Math.min(positiveSignals, negativeSignals) /
            (Math.max(positiveSignals, negativeSignals) || 1)
    };
}
export async function processSentimentCryptoPanic(asset: string): Promise<ProcessedSentiment> {
    const posts: CryptoPanicPost[] = []

    const response = await fetch(`https://cryptopanic.com/api/v1/posts/?auth_token=${process.env.CRYPTO_PANIC_API_KEY}&currencies=${asset}&public=true&panic_score=true&kind=news`)
    const { results } = await response.json() as any

    for (const result of results) {
        posts.push({
            text: result.title,
            sentiment: calculateSentiment(result.votes)
        })
    }
    const prompt = {
        system: `You are a specialized crypto sentiment analyzer. Analyze crypto-related posts and extract key insights. Return a JSON object matching the ProcessedSentiment type with:
 - overallSentiment: number 0-100 representing aggregate sentiment
 - engagementScore: number 0-100 based on interaction levels
 - topInfluencers: array of key entities/people mentioned
 - keyPhrases: array of important technical/market terms
 
Expected JSON response format:
{
 "overallSentiment": number, // 0-100 based on aggregate sentiment across posts
 "engagementScore": number,  // 0-100 calculated from interaction levels
 "topInfluencers": string[], // Array of key entities/people mentioned in posts
 "keyPhrases": string[]      // Array of important technical/market terms, trends
}
 `,

        human: `Analyze these crypto posts and their sentiment metrics: ${JSON.stringify(posts)}`
    };
    const openai = new OpenAI({
        apiKey: process.env.VENICE_AI_API_KEY || "",
        baseURL: "https://api.venice.ai/api/v1",
    });
    const completion = await openai.chat.completions.create({
        messages: [{
            role: "system",
            content: prompt.system
        }, {
            role: "user",
            content: prompt.human
        }],
        model: "llama-3.2-3b"
    })

    console.log("COMPLETION  RESPONES")
    console.log("Received response from VeniceAI model.");
    const messageContent = JSON.parse(completion as any).choices[0].message.content;
    if (!messageContent) {
        console.error("❌ No response from generateMessageResponse");
        return {
            overallSentiment: 0,
            engagementScore: 0,
            topInfluencers: [],
            keyPhrases: []
        }
    }
    console.log(messageContent)
    return JSON.parse(messageContent) as ProcessedSentiment;
}