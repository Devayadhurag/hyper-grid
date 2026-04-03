addEventListener('message', ({ data }) => {
  const result = heavyCalculation(data);
  postMessage(result);
});

function heavyCalculation(data: number[]) {
  return data.map(x => x * Math.random() * 100);
}