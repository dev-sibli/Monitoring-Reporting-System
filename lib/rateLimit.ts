import { NextApiRequest, NextApiResponse } from 'next'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const rateLimiter = new RateLimiterMemory({
  points: 5, // Number of points
  duration: 1, // Per second
})

export default async function rateLimitMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  try {
    await rateLimiter.consume(req.socket.remoteAddress!)
    next()
  } catch {
    res.status(429).json({ message: 'Too Many Requests' })
  }
}

