export const fetchDataFromServer = async (requestData, route, method) => {
    try {
        const response = await fetch(route, {
            method: method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(requestData)
        });
        if (!response.ok) throw new Error(`Une erreur est survenue: ${response.status}`);
        const result = await response.json();
        if (!result.isSuccessfull) throw new Error(result.message);
        return result;
    } catch (error) {
        console.log(error);
        throw error; // Re-lancer l'erreur pour gérer plus tard si nécessaire
    }
}