import DB from "../db";
import { IMessage, ISock } from "../types/bailieys.types";

export const StartConversationService = async (sock: ISock, message: IMessage) => {
    const { messages } = message;

    if (messages[0].message?.locationMessage != null) {
        console.log("Location message, returning");
        return;

    }

    if (messages[0].message?.conversation === "start") {
        await sock.sendMessage(messages[0].key.remoteJid!, {
            text: `
Hello! Welcome to NammaYatri! 
We are here to help you with your travel needs.
Let's get started!
Send your current location to get started.
        `,
        })
        DB[`${messages[0].key.remoteJid}`].level = 1;
    } else {
        await sock.sendMessage(messages[0].key.remoteJid!, { text: 'Hello there! Type "start" to start your conversation' })
    }
}