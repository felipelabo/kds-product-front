// Next.js API route como proxy para evitar CORS
import type { NextApiRequest, NextApiResponse } from 'next'

const API_BASE_URL = 'http://localhost:3001'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    })

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `API Error: ${response.status}` 
      })
    }

    const data = await response.json()
    res.status(200).json(data)
    
  } catch (error) {
    console.error('API Proxy Error:', error)
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}