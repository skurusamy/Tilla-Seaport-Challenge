export type Seaport = {
    id: number;
    portName: string;
    locode: string;
    latitude: number;
    longitude: number;
    timezoneOlson?: string | null;
    countryIso?: string | null;
    source?: string | null;
}

export async function fetchSeaports(): Promise<Seaport[]> {
    const query = `
    query {
        findAllSeaports {
            id
            portName
            locode
            latitude
            longitude
            timezoneOlson
            countryIso
            source
        }
    }
    `

    const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
    })

    if (!response.ok) {
        throw new Error('Backend service failed');
    }

    const json = await response.json();

    if (json.errors) {
        throw new Error('Failed to fetch seaports');
    }

    return json.data.findAllSeaports;
}