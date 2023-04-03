import DB from "../db";
import { IMessage, ISock } from "../types/bailieys.types";

const locationService = (sock: ISock, message: IMessage) => {
    if (message.messages[0].message?.locationMessage) {
        console.log("location received", message.messages[0].message.locationMessage);
        const latitude = message.messages[0].message.locationMessage.degreesLatitude;
        const longitude = message.messages[0].message.locationMessage.degreesLongitude;

        sock.sendMessage(message.messages[0].key.remoteJid!, {
            text: `Latitude: ${latitude}, Longitude: ${longitude}
Searching for nearby drivers..
Please Wait!                   
            `
        })

        DB[`${message.messages[0].key.remoteJid}`] = {
            ...DB[`${message.messages[0].key.remoteJid}`],
            location: {
                current: {
                    latitude,
                    longitude
                }
            },
            processing: true
        }

        setTimeout(() => {
            sock.sendMessage(message.messages[0].key.remoteJid!, {
                text: `Drivers Found! 13+ drivers are available near you! Please send your destination to book a cab.`
            })

            DB[`${message.messages[0].key.remoteJid}`] = {
                ...DB[`${message.messages[0].key.remoteJid}`],
                processing: false,
                level: 2
            }
        }, 5000)
    } else {
        console.log("not location");
        sock.sendMessage(message.messages[0].key.remoteJid!, { text: 'Please send your location' })
    }
}

export default locationService;