import {useEffect, useState} from "react";

export function useFetchGetListes(listes, setListes, url, options = {}) {
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState(null)
// eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url, {
                    ...options,
                    headers: {'Accept': 'application/json; charset=UTF-8', ...options.headers}
                });
                if (!response.ok) throw new Error(`Une erreur est survenue: ${response.status}`);
                const data = await response.json();
                setListes(data.listes)
            } catch (error) {
                setErrors(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, []);
    return {loading, errors}
}