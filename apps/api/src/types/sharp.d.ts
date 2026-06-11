declare module 'sharp' {
  interface Sharp {
    resize(width: number, height: number, options?: object): Sharp
    grayscale(): Sharp
    raw(): Sharp
    png(): Sharp
    toBuffer(options?: object): Promise<{ data: Buffer, info: { width: number, height: number, channels: number } }>
    toFile(path: string): Promise<void>
  }

  function sharp(input?: Buffer | string, options?: object): Sharp

  export default sharp
}
