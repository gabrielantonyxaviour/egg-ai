import ngrok from '@ngrok/ngrok';
const testingAddress = "0x891ff4ebB5Db6ad420b721C28cc847dD9389F2F4"


async function listTunnels() {
    console.log(JSON.stringify({
        executedTradeId: "a67597de-4113-45a6-b866-1130a96faf90", message: {
            text: "Hello there!",
            replyToMessageId: undefined,
        }
    }))
}

listTunnels()