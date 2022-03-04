export async function generateUID() {
  const firstPart = (Math.random() * 56656) | 0;
  const secondPart = (Math.random() * 56656) | 0;
  const u1 =
    ('000' + firstPart.toString(36)).slice(-3) +
    ('000' + secondPart.toString(36)).slice(-3);
  const uuid = u1.toUpperCase();
  return uuid;
}
