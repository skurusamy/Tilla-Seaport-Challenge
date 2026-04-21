import { useEffect, useMemo, useState } from "react";
import { fetchSeaports, type Seaport } from "../api/graphqlClient";
import { SeaportTable } from "../components/SeaportTable";

export function SeaportsPage() {
    const [seaports, setSeaports] = useState<Seaport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    useEffect(() => {
        async function loadSeaports() {
            try {
                const data = await fetchSeaports();
                setSeaports(data);
                
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }
        loadSeaports();
    }, []);

    const totalPages = Math.max(1, Math.ceil(seaports.length / pageSize));

    const paginatedSeaports = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return seaports.slice(start, end);
    }, [seaports, currentPage]);

    const isPreviousDisabled = currentPage === 1;
    const isNextDisabled = currentPage === totalPages;

    function handlePrevious() {
        if (isPreviousDisabled) return;
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    }

    function handleNext() {
        if (isNextDisabled) return;
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }

    if (loading) return <p>Loading Seaport</p>;
    if (error) return <p>Error loading seaports: {error}</p>;
    return (
        <div>
            <h1>Seaports Dashboard</h1>
            <p>
                Total Seaports: {seaports.length} | Page {currentPage} of {totalPages}
            </p>

            <SeaportTable seaports={paginatedSeaports} />

            <div style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
                <button onClick={handlePrevious} disabled={isPreviousDisabled}> Previous </button>
                <button onClick={handleNext} disabled={isNextDisabled}> Next </button>
            </div>
        </div>
    );

}
