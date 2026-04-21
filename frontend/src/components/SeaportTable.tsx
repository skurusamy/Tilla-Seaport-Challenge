import type { Seaport } from "../api/graphqlClient";

type SeaportTableProps = {
   seaports: Seaport[];
}

export function SeaportTable({ seaports }: SeaportTableProps) {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Port Name</th>
                    <th>LOCODE</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Timezone</th>
                    <th>Country ISO</th>
                    <th>Source</th>
                </tr>
            </thead>
            <tbody>
                {seaports.map(seaport => (
                    <tr key={seaport.id}>
                        <td>{seaport.id}</td>
                        <td>{seaport.portName}</td>
                        <td>{seaport.locode}</td>
                        <td>{seaport.latitude}</td>
                        <td>{seaport.longitude}</td>
                        <td>{seaport.timezoneOlson}</td>
                        <td>{seaport.countryIso}</td>
                        <td>{seaport.source}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}