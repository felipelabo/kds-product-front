export function getRandomId() {
	const length = 5
	let result = ""
	const characters = "0123456789"
	const charactersLength = characters.length
	for (let i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength),
		)
	}
	return result
}

export function getRandomInterval(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
	try {

		const realUrl = `${process.env.NEXT_PUBLIC_API_URL_BASE}:${process.env.NEXT_PUBLIC_API_PORT}${url}`;
		console.log(`Fetching: ${realUrl}`);
		console.log('Options:', options);
		const response = await fetch(realUrl, options);
		
		if (!response.ok) {
			throw new Error(`Error fetching ${url}: ${response.status} ${response.statusText}`);
		}
		
		const data = await response.json() as T;
		return data;
		
	} catch (error) {
		throw new Error(`Fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`); 
	}
}
