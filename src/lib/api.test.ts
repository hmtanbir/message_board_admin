import { describe, it, expect, beforeEach, vi } from 'vitest'
import { encryptPayload, decryptPayload, apiClient } from './api'

describe('API Crypto Helpers', () => {
  const testData = { message: 'Hello World', id: 123 }

  it('should encrypt and decrypt data consistently', async () => {
    const encrypted = await encryptPayload(testData)
    expect(typeof encrypted).toBe('string')
    expect(encrypted.length).toBeGreaterThan(28)

    const decrypted = await decryptPayload(encrypted)
    expect(decrypted).toEqual(testData)
  })

  it('should throw error for too short payload during decryption', async () => {
    await expect(decryptPayload('too-short')).rejects.toThrow('Payload too short')
  })
})

describe('apiClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    })
    // Ensure environment variables are set for consistency
    process.env.NEXT_PUBLIC_API_BASE_URL = 'http://test-api.com/api/v1'
    process.env.NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_ENABLED = 'false'
  })

  it('should call fetch with correct URL and headers', async () => {
    const mockResponse = { ok: true, text: () => Promise.resolve(JSON.stringify({ success: true })) }
    vi.mocked(fetch).mockResolvedValue(mockResponse as any)

    await apiClient('/test-endpoint', { method: 'GET' })

    expect(fetch).toHaveBeenCalledWith(
      'http://test-api.com/api/v1/test-endpoint',
      expect.objectContaining({
        method: 'GET',
        headers: expect.any(Headers),
      })
    )
  })

  it('should include Authorization header if token exists', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue('mock-token')
    const mockResponse = { ok: true, text: () => Promise.resolve(JSON.stringify({})) }
    vi.mocked(fetch).mockResolvedValue(mockResponse as any)

    await apiClient('/test')

    const callArgs = vi.mocked(fetch).mock.calls[0]
    const headers = callArgs[1]?.headers as Headers
    expect(headers.get('Authorization')).toBe('Bearer mock-token')
  })

  it('should encrypt body if encryption is enabled', async () => {
    process.env.NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_ENABLED = 'true'
    const mockResponse = { ok: true, text: () => Promise.resolve(JSON.stringify({})) }
    vi.mocked(fetch).mockResolvedValue(mockResponse as any)

    const data = { foo: 'bar' }
    await apiClient('/post-test', { method: 'POST', data })

    const callArgs = vi.mocked(fetch).mock.calls[0]
    const body = JSON.parse(callArgs[1]?.body as string)
    expect(body).toHaveProperty('payload')
    expect(typeof body.payload).toBe('string')
  })

  it('should throw error on non-ok response', async () => {
    const mockResponse = { 
      ok: false, 
      status: 401, 
      statusText: 'Unauthorized',
      text: () => Promise.resolve(JSON.stringify({ message: 'Invalid session' })) 
    }
    vi.mocked(fetch).mockResolvedValue(mockResponse as any)

    await expect(apiClient('/fail')).rejects.toThrow('Invalid session')
  })
})
