/* globals Object */

const masks = Object.freeze({
  FOUR_SCREEN_MODE:     0b00001000,
  TRAINER:              0b00000100,
  PERSISTENT_MEMORY:    0b00000010,
  MIRRORING_DIRECTION:  0b00000001
})

export default
function deserialize([,,,,prg,chr,flags]) {
  return Object.freeze({
    size: Object.freeze({
      program: prg * 16384,   // 16-KiB PRG-ROM banks
      graphics: chr * 8192    //  8-KiB CHR-ROM banks
    }),

    // iNES mapper number
    mapper: (flags >> 4) & 0x0f,

    mirroring: (flags & masks.FOUR_SCREEN_MODE)
      ? undefined
      : (flags & masks.MIRRORING_DIRECTION)
        ? 'vertical'          // CIRAM A10 = PPU A11
        : 'horizontal',       // CIRAM A10 = PPU A10

    // 4 KiB of RAM at PPU $2000-2FFF
    hasFourScreenMode: !!(flags & masks.FOUR_SCREEN_MODE),

    // 512-byte trainer at $7000-71FF
    hasTrainer: !!(flags & masks.TRAINER),

    // Battery-backed PRG-RAM at $6000-7FFF
    hasPersistentMemory: !!(flags & masks.PERSISTENT_MEMORY)
  })
}
