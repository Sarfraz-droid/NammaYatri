import DB from "../db";
import { IMessage, ISock } from "../types/bailieys.types";

const mp = {
    1: "Cash",
    2: "Online Payment"
}

const PaymentModeService = async (sock: ISock, message: IMessage) => {

    console.log("Payment Mode Service")
    console.log("message", JSON.stringify(message));
    if (message.messages[0].message?.locationMessage !== null) {
        console.log("location message... returning", message.messages[0].message?.locationMessage)
        return;

    }
    const paymentMode = mp[parseInt(message.messages[0].message?.conversation || "")];

    if (paymentMode === undefined) {
        await sock.sendMessage(message.messages[0].key.remoteJid!, {
            text: `Please send a valid option.`,
        })
        return;
    }
    console.log("payment mode", paymentMode);
    DB[`${message.messages[0].key.remoteJid}`] = {
        ...DB[`${message.messages[0].key.remoteJid}`],
        paymentMode: paymentMode,
        level: 4
    }

    await sock.sendMessage(message.messages[0].key.remoteJid!, {
        text: `Your payment mode is set to ${paymentMode}. 
Click on the button below to book your cab.

Send *book* to book your cab.
        `,
    });
}


export default PaymentModeService;