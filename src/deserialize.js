/* globals Object */

const mask = Object.freeze({
  FOUR_SCREEN_MODE:     0b1000,
  TRAINER:              0b0100,
  PERSISTENT_MEMORY:    0b0010,
  MIRRORING_DIRECTION:  0b0001
})

export default
function deserialize([,,,,program,graphics,flags]) {
  return Object.freeze({
    size: Object.freeze({
      program: program << 14,     // 16-KiB PRG-ROM banks
      graphics: graphics << 13    // 8-KiB CHR-ROM banks
    }),

    // iNES mapper number
    mapper: (flags >>> 4) & 0b1111,

    mirroring: (flags & mask.FOUR_SCREEN_MODE)
      ? undefined
      : (flags & mask.MIRRORING_DIRECTION)
        ? 'vertical'          // CIRAM A10 = PPU A11
        : 'horizontal',       // CIRAM A10 = PPU A10

    // 4 KiB of RAM at PPU $2000-2FFF
    hasFourScreenMode: !!(flags & mask.FOUR_SCREEN_MODE),

    // 512-byte trainer at $7000-71FF
    hasTrainer: !!(flags & mask.TRAINER),

    // Battery-backed PRG-RAM at $6000-7FFF
    hasPersistentMemory: !!(flags & mask.PERSISTENT_MEMORY)
  })
}
