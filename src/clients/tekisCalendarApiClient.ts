import * as request from 'request-promise'
import * as Bluebird from 'bluebird'

export interface Event {
  id: number,
  name: string,
  created: Date,
  starts: Date,
  registration_starts: Date | null,
  registration_ends: Date | null,
  cancellation_starts: Date | null,
  cancellation_ends: Date | null,
  location: string,
  category: string,
  description: string
}

export function getAllEvents(fromDate: string): Bluebird<Event[]> {
  const opts: request.RequestPromiseOptions = {
    qs: { fromDate },
    headers: {
      'X-Token': process.env.TEKIS_CALENDAR_TOKEN
    }
  }
  return request('https://members.tko-aly.fi/api/events', opts)
    .then(JSON.parse)
    .then(formatResponse)
}

function formatResponse(rawDataArr: any[]): Event[] {
  return rawDataArr.map(rawData => ({
    ...rawData,
    created: new Date(rawData.created),
    starts: new Date(rawData.starts),
    registration_starts: new Date(rawData.registration_starts),
    registration_ends: new Date(rawData.registration_ends),
    cancellation_starts: new Date(rawData.cancellation_starts),
    cancellation_ends: new Date(rawData.cancellation_ends)
  }))
}