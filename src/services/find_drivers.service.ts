import DB from "../db";
import { IMessage, ISock } from "../types/bailieys.types";

const FindDriversService = async (sock: ISock, message: IMessage) => {
    const { messages } = message;
    console.log("Find Drivers Service")

    const bookCab = message.messages[0].message?.conversation === "book";

    if (!bookCab) {
        sock.sendMessage(messages[0].key.remoteJid!, {
            text: `Please send *book* to book your cab.`,
        })
        return;
    }

    if (message.messages[0].message?.locationMessage !== null) {
        console.log("location message... returning")
        return;
    }

    sock.sendMessage(messages[0].key.remoteJid!, {
        text: `Finding drivers near you.. Please wait!`,
    });

    setTimeout(() => {
        sock.sendMessage(messages[0].key.remoteJid!, {
            text: `Drivers Found!
*Driver Name*: Sarfraz Alam
*Driver Number*: +91 7303435034
*Driver Rating*: 4.5/5
*Driver Vehicle*: Maruti Suzuki Swift
*Driver Vehicle Number*: KA 01 AB 1234
*Driver Vehicle Color*: White

*Payment Mode*: ${DB[`${messages[0].key.remoteJid}`].paymentMode}

Your driver will be at your location in 1 minute. Please wait!
            `,
        })
    }, 5000)

    setTimeout(() => {
        sock.sendMessage(messages[0].key.remoteJid!, {
            text: `Your driver is here!`
        })

        DB[`${messages[0].key.remoteJid}`] = {
            ...DB[`${messages[0].key.remoteJid}`],
            processing: false,
            level: 0

        }
    }, 6000)
}

export default FindDriversService;