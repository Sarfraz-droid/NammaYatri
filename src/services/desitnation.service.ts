import DB from "../db";
import { IMessage, ISock } from "../types/bailieys.types";

const destinationService = (sock: ISock, message: IMessage) => {
    if (message.messages[0].message?.locationMessage) {
        console.log("location received", message.messages[0].message.locationMessage);
        const latitude = message.messages[0].message.locationMessage.degreesLatitude;
        const longitude = message.messages[0].message.locationMessage.degreesLongitude;

        sock.sendMessage(message.messages[0].key.remoteJid!, {
            text: `Latitude: ${latitude}
Longitude: ${longitude}
Calculating Fare..
Please Wait!
`})

        DB[`${message.messages[0].key.remoteJid}`] = {
            ...DB[`${message.messages[0].key.remoteJid}`],
            destination: {
                latitude,
                longitude
            },
            processing: true
        }

        setTimeout(() => {
            if (typeof latitude != "number" || typeof longitude != "number") return sock.sendMessage(message.messages[0].key.remoteJid!, { text: 'Please send your location' });

            const dist = Math.sqrt(Math.pow(DB[`${message.messages[0].key.remoteJid}`].location.current.latitude - latitude, 2) + Math.pow(DB[`${message.messages[0].key.remoteJid}`].location.current.longitude - longitude, 2));
            const fare = Math.max(20, Math.floor(dist * 100));
            sock.sendMessage(message.messages[0].key.remoteJid!, {
                text: `Fare Calculated! 
The fare is Rs. ${fare}. Please send your payment details to confirm your booking.

Send *1* for Cash
Send *2* for Online Payment
                `,
            });


            DB[`${message.messages[0].key.remoteJid}`] = {
                ...DB[`${message.messages[0].key.remoteJid}`],
                location: {
                    ...DB[`${message.messages[0].key.remoteJid}`].location,
                    destination: {
                        latitude,
                        longitude
                    }
                },
                processing: false,
                level: 3
            }
        }, 5000)
    }
}

export default destinationService;