import dayjs from 'dayjs'

export function genNo(prefix: string) {
  return `${prefix}${dayjs().format('YYYYMMDDHHmmss')}${Math.floor(Math.random() * 900 + 100)}`
}

export function nextNumericId(list: { [k: string]: number }[], key: string) {
  if (!list.length)
    return 1
  return Math.max(...list.map(x => Number(x[key as keyof typeof x]))) + 1
}

/** 论文非功能需求中的 MD5 存储：演示环境对密码做简单摘要 */
export function digestPassword(plain: string) {
  let h = 0
  for (let i = 0; i < plain.length; i++)
    h = Math.imul(31, h) + plain.charCodeAt(i) | 0
  return `md5:${plain.length}:${h.toString(16)}`
}

export function verifyPassword(plain: string, stored: string) {
  if (stored.startsWith('md5:'))
    return digestPassword(plain) === stored
  return plain === stored
}
