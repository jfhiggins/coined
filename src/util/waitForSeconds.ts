export default (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration * 1000));
