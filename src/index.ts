require('dotenv').config()
import {getAllEvents, Event} from './clients/tekisCalendarApiClient'
import * as moment from 'moment'
import {scheduleTask, getTasks} from './utils/scheduler'
import * as Client from 'node-telegram-bot-api'
import {inspect} from 'util';

const client = new Client(process.env.TELEGRAM_BOT_TOKEN, { polling: true })

const locations = ['Moskova, Venäjä', 'New York City, New York, Yhdysvallat', 'Tokyo, Japani', 'Tukholma, Ruotsi', 'Berliini, Saksa']

function pollNewEvents() {
  const date = new Date()
  const fromDateStr = moment(date).format('YYYY-MM-DD')
  getAllEvents(fromDateStr).then(events => {
    events
      .filter(filterEvents)
      .forEach(event => {
        scheduleTask(event.id, event.starts, sendMessage)
      })
      console.log(inspect(getTasks()))
  })
}

setInterval(pollNewEvents, 60 * 60 * 1000)
pollNewEvents()

function filterEvents(event: Event) {
  return event.category.toLowerCase().indexOf('sitsit') > -1 || event.category.toLowerCase().indexOf('vuosijuhlat') > -1
}

function sendMessage() {
  const location = locations[Math.floor(locations.length * Math.random())]
  client.sendMessage(process.env.TELEGRAM_CHAT_ID, 'Päivän konferenssipuhelu: ' + location)
}