import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import DeliveryConversationService from './services/index.service'


async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
    })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            if (lastDisconnect == undefined) return;
            const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if (shouldReconnect) {
                connectToWhatsApp()
            }
        } else if (connection === 'open') {
            console.log('opened connection')
        }
    })
    sock.ev.on('messages.upsert', async (m) => {
        console.log("Got Message", JSON.stringify(m, undefined, 2))

        if (m.messages[0].message?.conversation?.startsWith('!') || m.messages[0].message?.extendedTextMessage?.text?.startsWith('!'))
            return;
        if (!m.messages[0].key.remoteJid?.startsWith('917303435034')
            && !m.messages[0].key.remoteJid?.startsWith('919868622141')
        ) return;


        if (m.messages[0].key.fromMe) {
            return;
        }

        console.log('replying to', m.messages[0].key.remoteJid)
        DeliveryConversationService(sock, m);
    })

}


// run in main file
connectToWhatsApp()
