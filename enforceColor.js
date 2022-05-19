// @ts-check
export const colorUsed = process.env.OUTPUT_FORMAT !== 'JSON'
if (!colorUsed) process.env.FORCE_COLOR = '0'
