import DB from "../db";
import { IMessage, ISock } from "../types/bailieys.types";
import destinationService from "./desitnation.service";
import FindDriversService from "./find_drivers.service";
import locationService from "./location.service";
import PaymentModeService from "./payment_mode.service";
import { StartConversationService } from "./start_conversation.service";

const conversationLevels = [
    StartConversationService,
    locationService,
    destinationService,
    PaymentModeService,
    FindDriversService
];

const DeliveryConversationService = async (sock: ISock, message: IMessage) => {
    const { messages } = message;

    if (DB[`${messages[0].key.remoteJid}`] === undefined) {
        DB[`${messages[0].key.remoteJid}`] = {
            level: 0,
        }
    }

    const { level } = DB[`${messages[0].key.remoteJid}`];

    console.log("level", level);

    if (DB[`${messages[0].key.remoteJid}`].processing) {
        sock.sendMessage(messages[0].key.remoteJid!, { text: '!Please wait while we process your request' })
    }

    await conversationLevels[level](sock, message);
}

export default DeliveryConversationService;