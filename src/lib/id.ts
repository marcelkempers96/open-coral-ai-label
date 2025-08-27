export function uuid(): string {
  // RFC4122 v4 via crypto API
  const buf = new Uint8Array(16)
  crypto.getRandomValues(buf)
  buf[6] = (buf[6] & 0x0f) | 0x40
  buf[8] = (buf[8] & 0x3f) | 0x80
  const bth: string[] = []
  for (let i = 0; i < 256; ++i) bth[i] = (i + 0x100).toString(16).substring(1)
  return (
    bth[buf[0]] +
    bth[buf[1]] +
    bth[buf[2]] +
    bth[buf[3]] +
    '-' +
    bth[buf[4]] +
    bth[buf[5]] +
    '-' +
    bth[buf[6]] +
    bth[buf[7]] +
    '-' +
    bth[buf[8]] +
    bth[buf[9]] +
    '-' +
    bth[buf[10]] +
    bth[buf[11]] +
    bth[buf[12]] +
    bth[buf[13]] +
    bth[buf[14]] +
    bth[buf[15]]
  )
}

